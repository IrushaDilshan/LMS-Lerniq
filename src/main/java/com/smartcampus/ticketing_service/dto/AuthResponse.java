package com.smartcampus.ticketing_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String role;
    private Long userId; // For legacy frontend compatibility if needed
    private String id; // Real MongoDB ID
}
