package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.OAuthLoginRequest;
import com.smartcampus.ticketing_service.dto.UpdateUserRoleRequest;
import com.smartcampus.ticketing_service.dto.UserResponse;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.model.AppUser;
import com.smartcampus.ticketing_service.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserAccessService {
    private final AppUserRepository appUserRepository;

    public UserAccessService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public List<UserResponse> getAllUsers() {
        return appUserRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse updateRole(String userId, UpdateUserRoleRequest request) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setRole(request.getRole());
        return toResponse(appUserRepository.save(user));
    }

    public UserResponse oauthLogin(OAuthLoginRequest request) {
        if (request.getProviderToken().length() < 8) {
            throw new IllegalArgumentException("Invalid OAuth token.");
        }

        AppUser user = appUserRepository.findByEmail(request.getEmail()).orElseGet(AppUser::new);
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setAuthProvider(request.getAuthProvider().toUpperCase());
        user.setExternalUserId(request.getExternalUserId());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setLastLoginAt(LocalDateTime.now());

        if (user.getRole() == null) {
            user.setRole(com.smartcampus.ticketing_service.model.UserRole.USER);
        }

        return toResponse(appUserRepository.save(user));
    }

    private UserResponse toResponse(AppUser user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setExternalUserId(user.getExternalUserId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAuthProvider(user.getAuthProvider());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
    }
}
