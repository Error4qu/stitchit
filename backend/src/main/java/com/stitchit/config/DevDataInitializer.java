package com.stitchit.config;

import com.stitchit.entity.Role;
import com.stitchit.entity.User;
import com.stitchit.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile({"dev", "local"})
public class DevDataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DevDataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        seedUser("Admin User",  "admin@stitchit.com",  "Admin@123",  Role.ADMIN);
        seedUser("Tailor User", "tailor@stitchit.com", "Tailor@123", Role.TAILOR);
    }

    private void seedUser(String name, String email, String password, Role role) {
        if (userRepository.existsByEmail(email)) return;
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
        log.info("DEV_SEED created {} email={}", role, email);
    }
}
