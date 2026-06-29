package com.stitchit.service;

import com.stitchit.dto.*;
import com.stitchit.entity.Role;
import com.stitchit.entity.User;
import com.stitchit.repository.UserRepository;
import com.stitchit.security.JwtService;
import com.stitchit.security.UserPrincipal;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StringRedisTemplate redisTemplate;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, @Lazy AuthenticationManager authenticationManager,
                       StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("An account with this email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.CUSTOMER);
        user.setProvider("LOCAL");

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid token type");
        }

        if (jwtService.isTokenExpired(refreshToken)) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        String jti = jwtService.extractJti(refreshToken);
        try {
            String storedUserId = redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + jti);
            if (storedUserId == null) {
                throw new IllegalArgumentException("Refresh token has been revoked");
            }
            redisTemplate.delete(REFRESH_TOKEN_PREFIX + jti);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Redis unavailable during token refresh — proceeding without revocation check: {}", e.getMessage());
        }

        String email = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        return buildAuthResponse(user);
    }

    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            try {
                String jti = jwtService.extractJti(refreshToken);
                redisTemplate.delete(REFRESH_TOKEN_PREFIX + jti);
            } catch (Exception ignored) {
                // Token malformed — nothing to revoke
            }
        }
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return toUserResponse(user);
    }

    public void storeRefreshToken(String jti, String userId) {
        try {
            long ttlSeconds = jwtService.getRefreshExpiration() / 1000;
            redisTemplate.opsForValue().set(
                    REFRESH_TOKEN_PREFIX + jti,
                    userId,
                    Duration.ofSeconds(ttlSeconds)
            );
        } catch (Exception e) {
            log.warn("Redis unavailable — refresh token revocation disabled: {}", e.getMessage());
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal userPrincipal = UserPrincipal.from(user);
        String accessToken = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        storeRefreshToken(jwtService.extractJti(refreshToken), String.valueOf(user.getId()));

        return new AuthResponse(accessToken, refreshToken, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getPhone(), user.getRole());
    }
}
