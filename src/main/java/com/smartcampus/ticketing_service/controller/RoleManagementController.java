package com.smartcampus.ticketing_service.controller;

import com.smartcampus.ticketing_service.dto.RoleUpdateRequest;
import com.smartcampus.ticketing_service.model.User;
import com.smartcampus.ticketing_service.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class RoleManagementController {

    private final UserRepository userRepository;

    public RoleManagementController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users for admin role management page
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update selected user's role
    @PutMapping("/{userId}/role")
    public User updateUserRole(@PathVariable String userId,
                               @Valid @RequestBody RoleUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(request.getRole());
        return userRepository.save(user);
    }
}