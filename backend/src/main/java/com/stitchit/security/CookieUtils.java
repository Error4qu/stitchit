package com.stitchit.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class CookieUtils {

    public static final String ACCESS_TOKEN_COOKIE = "jwt";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private static final String ACCESS_TOKEN_PATH = "/api";
    // Refresh token is only needed on auth endpoints — scope it tightly to limit exposure
    private static final String REFRESH_TOKEN_PATH = "/api/v1/auth";

    @Value("${app.cookie.secure:false}")
    private boolean secure;

    @Value("${jwt.expiration:900000}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshTokenExpirationMs;

    public void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        addCookie(response, ACCESS_TOKEN_COOKIE, accessToken,
                (int) (accessTokenExpirationMs / 1000), ACCESS_TOKEN_PATH);
        addCookie(response, REFRESH_TOKEN_COOKIE, refreshToken,
                (int) (refreshTokenExpirationMs / 1000), REFRESH_TOKEN_PATH);
    }

    public void clearAuthCookies(HttpServletResponse response) {
        addCookie(response, ACCESS_TOKEN_COOKIE, "", 0, ACCESS_TOKEN_PATH);
        addCookie(response, REFRESH_TOKEN_COOKIE, "", 0, REFRESH_TOKEN_PATH);
    }

    public String extractCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> cookieName.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void addCookie(HttpServletResponse response, String name, String value,
                           int maxAge, String path) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .path(path)
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}