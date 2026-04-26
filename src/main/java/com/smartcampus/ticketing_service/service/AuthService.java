package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.SignupRequest;
import com.smartcampus.ticketing_service.dto.LoginRequest;
import com.smartcampus.ticketing_service.dto.AuthResponse;
import com.smartcampus.ticketing_service.dto.StudentSignupOtpRequest;
import com.smartcampus.ticketing_service.dto.VerifyOtpRequest;
import com.smartcampus.ticketing_service.model.User;
import com.smartcampus.ticketing_service.model.OtpVerification;
import com.smartcampus.ticketing_service.model.Role;
import com.smartcampus.ticketing_service.repository.UserRepository;
import com.smartcampus.ticketing_service.repository.OtpVerificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private EmailService emailService;

    public AuthResponse signup(SignupRequest request) {
        // Validate email not already used
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Validate password not empty
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        // Validate fullName not empty
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Full name cannot be empty");
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // For demo (use BCrypt for production)
        user.setCreatedAt(LocalDateTime.now());

        // Set role from request
        try {
            user.setRole(Role.valueOf(request.getRole()));
        } catch (IllegalArgumentException e) {
            user.setRole(Role.USER); // Default to USER if invalid role
        }

        // Save user to database
        User savedUser = userRepository.save(user);

        // Return AuthResponse without password
        return new AuthResponse(
            savedUser.getId(),
            savedUser.getFullName(),
            savedUser.getEmail(),
            savedUser.getRole().toString(),
            "Signup successful"
        );
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOptional.get();

        // Check password (simple string comparison for demo)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Validate role matches
        String requestRole = request.getRole();
        String userRole = user.getRole().toString();
        if (!userRole.equals(requestRole)) {
            throw new RuntimeException("This account is registered as " + userRole + ", not " + requestRole);
        }

        // Return AuthResponse without password
        return new AuthResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().toString(),
            "Login successful"
        );
    }

    public String requestStudentSignupOtp(StudentSignupOtpRequest request) {
        // Validate role is USER
        if (!request.getRole().equals("USER")) {
            throw new RuntimeException("OTP verification is only for student signup");
        }

        // Validate email ends with @my.sliit.lk
        if (!request.getEmail().endsWith("@my.sliit.lk")) {
            throw new RuntimeException("Please use your SLIIT student email ending with @my.sliit.lk");
        }

        // Check if email already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Validate password not empty
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        // Validate fullName not empty
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Full name cannot be empty");
        }

        // Generate 6-digit OTP
        String otp = generateOtp();
        logger.info("Generated OTP for {}: {}", request.getEmail(), otp);

        // Delete old OTP records for same email
        otpVerificationRepository.deleteByEmail(request.getEmail());

        // Save pending signup data into OtpVerification collection
        OtpVerification otpVerification = new OtpVerification(
            request.getEmail(),
            request.getFullName(),
            request.getPassword(),
            Role.USER,
            otp,
            LocalDateTime.now().plusMinutes(5) // OTP expires in 5 minutes
        );
        otpVerificationRepository.save(otpVerification);

        // Send email with OTP
        try {
            emailService.sendOtpEmail(request.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP. Please try again.");
        }

        return "OTP sent to your SLIIT email";
    }

    public AuthResponse verifyStudentSignupOtp(VerifyOtpRequest request) {
        // Find latest OTP by email
        Optional<OtpVerification> otpOptional = otpVerificationRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail());
        if (otpOptional.isEmpty()) {
            throw new RuntimeException("No OTP request found for this email");
        }

        OtpVerification otpVerification = otpOptional.get();

        // Check if expired
        if (LocalDateTime.now().isAfter(otpVerification.getExpiresAt())) {
            otpVerificationRepository.delete(otpVerification);
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        // Check if OTP mismatch
        if (!otpVerification.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check if already verified
        if (otpVerification.isVerified()) {
            throw new RuntimeException("OTP already verified");
        }

        // Create actual User using stored data
        User user = new User();
        user.setFullName(otpVerification.getFullName());
        user.setEmail(otpVerification.getEmail());
        user.setPassword(otpVerification.getPassword());
        user.setRole(otpVerification.getRole());
        user.setCreatedAt(LocalDateTime.now());

        // Save user in users collection
        User savedUser = userRepository.save(user);

        // Delete OTP record after successful verification
        otpVerificationRepository.delete(otpVerification);

        // Return AuthResponse without password
        return new AuthResponse(
            savedUser.getId(),
            savedUser.getFullName(),
            savedUser.getEmail(),
            savedUser.getRole().toString(),
            "Student account created successfully"
        );
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
}
