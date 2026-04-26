package com.smartcampus.ticketing_service.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

/**
 * Temporary Utility to simulate User Management during Viva demo.
 * This acts as our mock Auth/User service.
 */
public class SimulatedUserContext {

    @Getter
    @AllArgsConstructor
    public enum UserRole {
        STUDENT,
        TECHNICIAN,
        ADMIN
    }

    @Getter
    @AllArgsConstructor
    public static class MockUser {
        private Long id;
        private String name;
        private String email;
        private UserRole role;
    }

    private static final Map<Long, MockUser> USERS = new HashMap<>();

    static {
        // Hardcoded users for demo
        USERS.put(1001L, new MockUser(1001L, "Student User", "student@uni.edu", UserRole.STUDENT));
        USERS.put(2002L, new MockUser(2002L, "Agent Smith", "smith@uni-ops.com", UserRole.TECHNICIAN));
        USERS.put(5005L, new MockUser(5005L, "Head Admin", "admin@uni-ops.com", UserRole.ADMIN));
    }

    public static MockUser getUserById(Long id) {
        return USERS.getOrDefault(id, new MockUser(id, "External User", "unknown@example.com", UserRole.STUDENT));
    }

    public static boolean isAdmin(Long userId) {
        return USERS.containsKey(userId) && USERS.get(userId).getRole() == UserRole.ADMIN;
    }

    public static boolean isTechnician(Long userId) {
        return USERS.containsKey(userId) && USERS.get(userId).getRole() == UserRole.TECHNICIAN;
    }
}
