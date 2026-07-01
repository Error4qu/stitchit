package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.AuthRequest;
import com.stitchit.dto.AuthResponse;
import com.stitchit.dto.RegisterRequest;
import com.stitchit.dto.UserResponse;
import com.stitchit.security.CookieUtils;
import com.stitchit.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final CookieUtils cookieUtils;

    public AuthController(AuthService authService, CookieUtils cookieUtils) {
        this.authService = authService;
        this.cookieUtils = cookieUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        cookieUtils.setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        log.info("AUTH_REGISTER email={} ip={}", request.getEmail(), clientIp(httpRequest));
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", authResponse.getUser()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        cookieUtils.setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        log.info("AUTH_LOGIN email={} ip={}", request.getEmail(), clientIp(httpRequest));
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse.getUser()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<UserResponse>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = cookieUtils.extractCookieValue(request, CookieUtils.REFRESH_TOKEN_COOKIE);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "No refresh token provided", null));
        }
        AuthResponse authResponse = authService.refresh(refreshToken);
        cookieUtils.setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        log.info("AUTH_REFRESH email={} ip={}", authResponse.getUser().getEmail(), clientIp(request));
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed", authResponse.getUser()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = cookieUtils.extractCookieValue(request, CookieUtils.REFRESH_TOKEN_COOKIE);
        authService.logout(refreshToken);
        cookieUtils.clearAuthCookies(response);
        log.info("AUTH_LOGOUT ip={}", clientIp(request));
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Not authenticated", null));
        }
        UserResponse userResponse = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", userResponse));
    }

    private String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) return xff.split(",")[0].trim();
        String xri = request.getHeader("X-Real-IP");
        if (xri != null && !xri.isEmpty()) return xri;
        return request.getRemoteAddr();
    }
}