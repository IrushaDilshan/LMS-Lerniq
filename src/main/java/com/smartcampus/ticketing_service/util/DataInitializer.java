package com.smartcampus.ticketing_service.util;

import com.smartcampus.ticketing_service.model.User;
import com.smartcampus.ticketing_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@uni-ops.com")
                    .fullName("Head Admin")
                    .role(User.UserRole.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // Seed Technician
        if (!userRepository.existsByUsername("tech")) {
            User tech = User.builder()
                    .username("tech")
                    .password(passwordEncoder.encode("tech123"))
                    .email("tech@uni-ops.com")
                    .fullName("Agent Smith")
                    .role(User.UserRole.TECHNICIAN)
                    .build();
            userRepository.save(tech);
        }

        // Seed Student
        if (!userRepository.existsByUsername("student")) {
            User student = User.builder()
                    .username("student")
                    .password(passwordEncoder.encode("student123"))
                    .email("student@uni.edu")
                    .fullName("Student User")
                    .role(User.UserRole.USER)
                    .build();
            userRepository.save(student);
        }
    }
}
