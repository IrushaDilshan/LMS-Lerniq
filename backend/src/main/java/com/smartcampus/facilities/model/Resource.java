package com.smartcampus.facilities.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Resource Entity - Represents bookable campus resources.
 * Examples: Lecture halls, labs, meeting rooms, equipment.
 *
 * Member 1 - Facilities & Assets Catalogue
 */
@Entity
@Table(name = "resources")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Resource name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Resource type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    @Column(nullable = false)
    private String location;

    @Min(value = 1, message = "Capacity must be at least 1")
    @Column
    private Integer capacity;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(length = 500)
    private String description;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    /**
     * Availability windows stored as a simple string list (e.g., "MON 08:00-18:00").
     * Stored as a comma-separated string in DB for simplicity.
     */
    @ElementCollection
    @CollectionTable(name = "resource_availability_windows",
            joinColumns = @JoinColumn(name = "resource_id"))
   @Column(name = "available_window")
    private List<String> availabilityWindows;

    @Column
    private String building;

    @Column
    private String floor;

    @Column
    private String roomNumber;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column
    private LocalDateTime updatedAt;

    @Column
    private String createdBy;
}
