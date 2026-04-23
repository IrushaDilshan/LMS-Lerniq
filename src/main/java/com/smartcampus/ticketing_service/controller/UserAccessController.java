package com.smartcampus.ticketing_service.controller;

import com.smartcampus.ticketing_service.dto.OAuthLoginRequest;
import com.smartcampus.ticketing_service.dto.UpdateUserRoleRequest;
import com.smartcampus.ticketing_service.dto.UserResponse;
import com.smartcampus.ticketing_service.service.UserAccessService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/users")
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

    @PostMapping("/oauth-login")
    public ResponseEntity<?> oauthLogin(@Valid @RequestBody OAuthLoginRequest request) {
        try {
            return new ResponseEntity<>(userAccessService.oauthLogin(request), HttpStatus.OK);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
