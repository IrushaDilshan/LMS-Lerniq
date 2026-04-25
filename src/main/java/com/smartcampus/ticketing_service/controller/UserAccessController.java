package com.smartcampus.ticketing_service.controller;

import com.smartcampus.ticketing_service.dto.UpdateUserRoleRequest;
import com.smartcampus.ticketing_service.dto.UserResponse;
import com.smartcampus.ticketing_service.service.UserAccessService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAccessController {
    private final UserAccessService userAccessService;

    public UserAccessController(UserAccessService userAccessService) {
        this.userAccessService = userAccessService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userAccessService.getAllUsers());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userAccessService.updateRole(id, request));
    }

}
