package com.smartcampus.ticketing_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "otp_verifications")
public class OtpVerification {

    @Id
    private String id;

    private String email;

    private String fullName;

    private String password;

    private Role role;

    private String otp;

    private LocalDateTime expiresAt;

    private LocalDateTime createdAt;

    private boolean verified;

    public OtpVerification() {
    }

    public OtpVerification(String email, String fullName, String password, Role role, String otp, LocalDateTime expiresAt) {
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.role = role;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.createdAt = LocalDateTime.now();
        this.verified = false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
