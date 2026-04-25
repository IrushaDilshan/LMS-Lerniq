package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.AuthResponse;
import com.smartcampus.ticketing_service.dto.LoginRequest;
import com.smartcampus.ticketing_service.dto.RegisterRequest;
import com.smartcampus.ticketing_service.model.Role;
import com.smartcampus.ticketing_service.model.User;
import com.smartcampus.ticketing_service.repository.UserRepository;
import com.smartcampus.ticketing_service.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            throw new IllegalArgumentException("Email is already registered.");
        });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setAuthProvider("LOCAL");
        user.setLastLoginAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(toUserDetails(saved));
        return new AuthResponse(token, saved.getEmail(), saved.getName(), saved.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));
        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password.");
        }
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(toUserDetails(user));
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }

    public User upsertGoogleUser(String email, String name, String avatarUrl) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setEmail(email);
        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        user.setAuthProvider("GOOGLE");
        user.setLastLoginAt(LocalDateTime.now());
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode("oauth2-login-user"));
        }
        return userRepository.save(user);
    }

    public UserDetails toUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword() == null ? "" : user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
