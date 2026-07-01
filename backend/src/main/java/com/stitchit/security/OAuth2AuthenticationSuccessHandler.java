package com.stitchit.security;

import com.stitchit.service.AuthService;
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
    private final CookieUtils cookieUtils;

    @Value("${frontend.customer-url:http://localhost:3000}")
    private String customerFrontendUrl;

    public OAuth2AuthenticationSuccessHandler(JwtService jwtService, AuthService authService,
                                              CookieUtils cookieUtils) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.cookieUtils = cookieUtils;
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

        cookieUtils.setAuthCookies(response, accessToken, refreshToken);

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response,
                customerFrontendUrl + "/auth/callback?oauth=true");
    }
}