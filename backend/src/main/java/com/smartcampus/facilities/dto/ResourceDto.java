package com.smartcampus.facilities.dto;

import com.smartcampus.facilities.model.ResourceStatus;
import com.smartcampus.facilities.model.ResourceType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTOs for Resource endpoints.
 * Separating request/response to avoid exposing entity internals.
 *
 * Member 1 - Facilities & Assets Catalogue
 */
public class ResourceDto {

    // ── CREATE / UPDATE Request ──────────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {

        @NotBlank(message = "Resource name is required")
        @Size(min = 2, max = 100)
        private String name;

        @NotNull(message = "Resource type is required")
        private ResourceType type;

        @NotBlank(message = "Location is required")
        @Size(max = 200)
        private String location;

        @Min(value = 1, message = "Capacity must be at least 1")
        private Integer capacity;

        @Size(max = 500)
        private String description;

        private ResourceStatus status;

        private List<String> availabilityWindows;

        private String building;
        private String floor;
        private String roomNumber;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {

        @Size(min = 2, max = 100)
        private String name;

        private ResourceType type;

        @Size(max = 200)
        private String location;

        @Min(1)
        private Integer capacity;

        @Size(max = 500)
        private String description;

        private ResourceStatus status;

        private List<String> availabilityWindows;

        private String building;
        private String floor;
        private String roomNumber;
    }

    // ── Status Patch Request ─────────────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest {

        @NotNull(message = "Status is required")
        private ResourceStatus status;
    }

    // ── Response ─────────────────────────────────────────────────────────────

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String name;
        private ResourceType type;
        private String location;
        private Integer capacity;
        private String description;
        private ResourceStatus status;
        private List<String> availabilityWindows;
        private String building;
        private String floor;
        private String roomNumber;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String createdBy;
    }
}
