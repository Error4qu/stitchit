package com.stitchit.service;

import com.stitchit.dto.*;
import com.stitchit.entity.Role;
import com.stitchit.entity.User;
import com.stitchit.repository.UserRepository;
import com.stitchit.security.JwtService;
import com.stitchit.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.CUSTOMER);

        userRepository.save(user);

        UserPrincipal userPrincipal = UserPrincipal.from(user);
        String jwt = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        UserResponse userResponse = new UserResponse(
            user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole()
        );

        return new AuthResponse(jwt, refreshToken, userResponse);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalStateException("User not found"));

        UserPrincipal userPrincipal = UserPrincipal.from(user);
        String jwt = jwtService.generateToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        UserResponse userResponse = new UserResponse(
            user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole()
        );

        return new AuthResponse(jwt, refreshToken, userResponse);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("User not found"));
        return new UserResponse(
            user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole()
        );
    }
}
