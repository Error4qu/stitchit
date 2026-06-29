package com.stitchit.security;

import com.stitchit.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final AuthService authService;

    @Value("${frontend.customer-url:http://localhost:3000}")
    private String customerFrontendUrl;

    public OAuth2AuthenticationSuccessHandler(JwtService jwtService, AuthService authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2UserPrincipal oAuth2User = (OAuth2UserPrincipal) authentication.getPrincipal();
        UserPrincipal userPrincipal = oAuth2User.getUserPrincipal();

        String accessToken = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        authService.storeRefreshToken(jwtService.extractJti(refreshToken),
                String.valueOf(userPrincipal.getId()));

        addCookie(response, "jwt", accessToken, 15 * 60);
        addCookie(response, "refresh_token", refreshToken,
                (int) (jwtService.getRefreshExpiration() / 1000));

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response,
                customerFrontendUrl + "/auth/callback?oauth=true");
    }

    private void addCookie(HttpServletResponse response, String name, String value, int maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeSeconds);
        response.addCookie(cookie);
    }
}
