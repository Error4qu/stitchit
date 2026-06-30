package com.stitchit.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stitchit.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    // Only public auth endpoints need protection — /me and /refresh are already guarded by JWT
    private static final Set<String> RATE_LIMITED_PATHS = Set.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register"
    );

    private static final String KEY_PREFIX = "rate_limit:auth:";

    // Sliding-window log using a sorted set — atomic via Lua, no burst at window boundary.
    // ARGV[1]=now(ms)  ARGV[2]=window(ms)  ARGV[3]=limit  ARGV[4]=unique member
    private static final RedisScript<Long> SLIDING_WINDOW_SCRIPT;
    static {
        DefaultRedisScript<Long> s = new DefaultRedisScript<>();
        s.setScriptText(
            "local now=tonumber(ARGV[1]) " +
            "local win=tonumber(ARGV[2]) " +
            "local lim=tonumber(ARGV[3]) " +
            "redis.call('ZREMRANGEBYSCORE',KEYS[1],0,now-win) " +
            "local cnt=redis.call('ZCARD',KEYS[1]) " +
            "if cnt<lim then " +
            "  redis.call('ZADD',KEYS[1],now,ARGV[4]) " +
            "  redis.call('EXPIRE',KEYS[1],math.ceil(win/1000)) " +
            "  return 0 " +
            "end " +
            "return 1"
        );
        s.setResultType(Long.class);
        SLIDING_WINDOW_SCRIPT = s;
    }

    @Value("${app.rate-limit.max-requests:10}")
    private int maxRequests;

    @Value("${app.rate-limit.window-seconds:60}")
    private int windowSeconds;

    // XFF/X-Real-IP are only trusted when the TCP connection arrives from one of these IPs.
    // In production set TRUSTED_PROXY_IPS to your nginx/load-balancer IP(s).
    @Value("#{'${app.rate-limit.trusted-proxies:127.0.0.1,::1}'.split(',')}")
    private List<String> trustedProxies;

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    // Suppress log spam: emit at most one Redis-down error per minute
    private volatile long lastRedisErrorLogMs = 0;

    public RateLimitFilter(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !RATE_LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String clientIp = resolveClientIp(request);
        String key = KEY_PREFIX + clientIp;
        long nowMs = System.currentTimeMillis();
        long windowMs = (long) windowSeconds * 1000;

        boolean blocked = false;
        try {
            Long result = redisTemplate.execute(
                    SLIDING_WINDOW_SCRIPT,
                    List.of(key),
                    String.valueOf(nowMs),
                    String.valueOf(windowMs),
                    String.valueOf(maxRequests),
                    UUID.randomUUID().toString()
            );
            blocked = Long.valueOf(1L).equals(result);
        } catch (Exception ex) {
            long now = System.currentTimeMillis();
            if (now - lastRedisErrorLogMs > 60_000) {
                log.error("RATE_LIMIT redis_down path={} ip={} — failing open: {}",
                        request.getRequestURI(), clientIp, ex.getMessage());
                lastRedisErrorLogMs = now;
            }
        }

        if (blocked) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ApiResponse<Void> body = new ApiResponse<>(false,
                    "Too many requests. Please wait before trying again.", null);
            response.getWriter().write(objectMapper.writeValueAsString(body));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        if (!isTrustedProxy(remoteAddr)) {
            return remoteAddr;
        }
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        String xri = request.getHeader("X-Real-IP");
        if (xri != null && !xri.isBlank()) {
            return xri;
        }
        return remoteAddr;
    }

    private boolean isTrustedProxy(String remoteAddr) {
        return trustedProxies.stream().anyMatch(tp -> tp.trim().equals(remoteAddr));
    }
}
