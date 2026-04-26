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
        private String id;
        private String name;
        private String email;
        private UserRole role;
    }

    private static final Map<String, MockUser> USERS = new HashMap<>();

    static {
        // Hardcoded users for demo - Using String IDs to match MongoDB ObjectIds
        USERS.put("1",    new MockUser("1",    "Student User", "student@uni.edu", UserRole.STUDENT));
        USERS.put("10",   new MockUser("10",   "Agent Smith", "smith@uni-ops.com", UserRole.TECHNICIAN));
        USERS.put("99",   new MockUser("99",   "Head Admin", "admin@uni-ops.com", UserRole.ADMIN));
        
        // Add the specific ID causing the crash just in case
        USERS.put("69ee64b21215fd919e23e309", new MockUser("69ee64b21215fd919e23e309", "Legacy User", "legacy@uni-ops.com", UserRole.ADMIN));
    }

    public static MockUser getUserById(String id) {
        if (id == null) return new MockUser(null, "System Automaton", "system@uni-ops.com", UserRole.ADMIN);
        return USERS.getOrDefault(id, new MockUser(id, "External User", "unknown@example.com", UserRole.STUDENT));
    }

    public static boolean isAdmin(String userId) {
        return USERS.containsKey(userId) && USERS.get(userId).getRole() == UserRole.ADMIN;
    }

    public static boolean isTechnician(String userId) {
        return USERS.containsKey(userId) && USERS.get(userId).getRole() == UserRole.TECHNICIAN;
    }
}

