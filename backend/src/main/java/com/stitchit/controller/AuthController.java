package com.stitchit.controller;

import com.stitchit.dto.ApiResponse;
import com.stitchit.dto.AuthRequest;
import com.stitchit.dto.AuthResponse;
import com.stitchit.dto.RegisterRequest;
import com.stitchit.dto.UserResponse;
import com.stitchit.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final int ACCESS_TOKEN_MAX_AGE = 15 * 60;
    private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", authResponse.getUser()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse.getUser()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<UserResponse>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = extractCookieValue(request, "refresh_token");
        AuthResponse authResponse = authService.refresh(refreshToken);
        setAuthCookies(response, authResponse.getToken(), authResponse.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed", authResponse.getUser()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = extractCookieValue(request, "refresh_token");
        authService.logout(refreshToken);
        clearAuthCookies(response);
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "Not authenticated", null));
        }
        UserResponse userResponse = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", userResponse));
    }

    private void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        addCookie(response, "jwt", accessToken, ACCESS_TOKEN_MAX_AGE);
        addCookie(response, "refresh_token", refreshToken, REFRESH_TOKEN_MAX_AGE);
    }

    private void clearAuthCookies(HttpServletResponse response) {
        addCookie(response, "jwt", "", 0);
        addCookie(response, "refresh_token", "", 0);
    }

    private void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    private String extractCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> cookieName.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
