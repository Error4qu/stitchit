package com.stitchit.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * CSRF defense-in-depth alongside SameSite=Lax cookies: browsers always send
 * the Origin header on cross-site state-changing requests, so any mutating
 * request carrying an Origin outside the allow-list is rejected. Requests
 * without an Origin header (curl, mobile apps, server-to-server) pass through —
 * non-browser clients cannot be CSRF'd because they don't auto-attach cookies.
 */
@Component
public class OriginValidationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(OriginValidationFilter.class);
    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS", "TRACE");

    private final Set<String> allowedOrigins;

    public OriginValidationFilter(
            @Value("${cors.origins:http://localhost:3000,http://localhost:3001,http://localhost:3002}")
            String corsOrigins) {
        this.allowedOrigins = Arrays.stream(corsOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return SAFE_METHODS.contains(request.getMethod())
                || !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if (origin != null && !allowedOrigins.contains(origin)) {
            log.warn("CSRF_BLOCKED method={} path={} origin={}",
                    request.getMethod(), request.getRequestURI(), origin);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"success\":false,\"message\":\"Origin not allowed\",\"data\":null}");
            return;
        }
        filterChain.doFilter(request, response);
    }
}
