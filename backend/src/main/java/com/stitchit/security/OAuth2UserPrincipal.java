package com.stitchit.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class OAuth2UserPrincipal implements OAuth2User {

    private final UserPrincipal userPrincipal;
    private final Map<String, Object> attributes;

    public OAuth2UserPrincipal(UserPrincipal userPrincipal, Map<String, Object> attributes) {
        this.userPrincipal = userPrincipal;
        this.attributes = attributes;
    }

    public UserPrincipal getUserPrincipal() {
        return userPrincipal;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userPrincipal.getAuthorities();
    }

    @Override
    public String getName() {
        return userPrincipal.getUsername();
    }
}
