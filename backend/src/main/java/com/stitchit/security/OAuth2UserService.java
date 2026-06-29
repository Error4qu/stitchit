package com.stitchit.security;

import com.stitchit.entity.Role;
import com.stitchit.entity.User;
import com.stitchit.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase();
        String providerAccountId = String.valueOf(attributes.get("sub"));
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Email not provided by OAuth2 provider");
        }

        Optional<User> existingByProvider = userRepository.findByProviderAndProviderAccountId(provider, providerAccountId);

        User user;
        if (existingByProvider.isPresent()) {
            user = existingByProvider.get();
            user.setName(name);
        } else {
            Optional<User> existingByEmail = userRepository.findByEmail(email);
            if (existingByEmail.isPresent()) {
                user = existingByEmail.get();
                user.setProvider(provider);
                user.setProviderAccountId(providerAccountId);
            } else {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setRole(Role.CUSTOMER);
                user.setProvider(provider);
                user.setProviderAccountId(providerAccountId);
            }
        }

        user = userRepository.save(user);
        return new OAuth2UserPrincipal(UserPrincipal.from(user), attributes);
    }
}
