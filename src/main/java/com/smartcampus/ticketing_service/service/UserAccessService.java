package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.UpdateUserRoleRequest;
import com.smartcampus.ticketing_service.dto.UserResponse;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.model.User;
import com.smartcampus.ticketing_service.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserAccessService {
    private final UserRepository userRepository;

    public UserAccessService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse updateRole(String userId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setRole(request.getRole());
        return toResponse(userRepository.save(user));
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setExternalUserId(user.getExternalUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setAuthProvider(user.getAuthProvider());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
    }
}
