package com.smartcampus.ticketing_service.service;

import com.smartcampus.ticketing_service.dto.ResourceCreateRequest;
import com.smartcampus.ticketing_service.dto.ResourceResponse;
import com.smartcampus.ticketing_service.dto.ResourceUpdateRequest;
import com.smartcampus.ticketing_service.exception.ResourceNotFoundException;
import com.smartcampus.ticketing_service.model.Resource;
import com.smartcampus.ticketing_service.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Resource Service - Module A: Facilities & Assets Catalogue
 * Handles all business logic for campus resource management
 *
 * Features:
 * - Dynamic filtering using MongoDB Query and Criteria builder
 * - Partial update support - only provided fields are updated
 * - Automatic timestamp management (createdAt, updatedAt)
 * - ResourceNotFoundException thrown when resource not found
 *
 * @author IrushaDilshan
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceService {
    
    private final ResourceRepository resourceRepository;
    private final org.springframework.data.mongodb.core.MongoTemplate mongoTemplate;
    
    /**
     * Get all resources with optional filters
     */
    public List<ResourceResponse> getAllResources(
            String type,
            String location,
            Integer minCapacity,
            Boolean activeOnly) {
        
        log.info("Fetching resources with filters - type: {}, location: {}, minCapacity: {}, activeOnly: {}",
                type, location, minCapacity, activeOnly);
        
        org.springframework.data.mongodb.core.query.Query query = new org.springframework.data.mongodb.core.query.Query();
        
        if (type != null && !type.isEmpty() && !type.equalsIgnoreCase("ALL")) {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("type").is(Resource.ResourceType.valueOf(type)));
        }
        
        if (location != null && !location.isEmpty()) {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("location").regex(location, "i"));
        }
        
        if (minCapacity != null) {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("capacity").gte(minCapacity));
        }
        
        if (activeOnly != null && activeOnly) {
            query.addCriteria(org.springframework.data.mongodb.core.query.Criteria.where("status").is(Resource.ResourceStatus.ACTIVE));
        }
        
        List<Resource> resources = mongoTemplate.find(query, Resource.class);
        
        log.info("Found {} resources matching the criteria", resources.size());
        return resources.stream()
                .map(ResourceResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * Get resource by ID
     */
    public ResourceResponse getResourceById(String id) {
        log.info("Fetching resource with ID: {}", id);
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Resource not found with ID: {}", id);
                    return new ResourceNotFoundException("Resource not found with ID: " + id);
                });
        return ResourceResponse.fromEntity(resource);
    }
    
    /**
     * Create a new resource (ADMIN only)
     */
    public ResourceResponse createResource(ResourceCreateRequest request) {
        log.info("Creating new resource: {}", request.getName());
        
        // Convert DTO to Entity
        List<Resource.AvailabilityWindow> windows = null;
        if (request.getAvailabilityWindows() != null) {
            windows = request.getAvailabilityWindows().stream()
                    .map(w -> Resource.AvailabilityWindow.builder()
                            .daysOfWeek(w.getDaysOfWeek())
                            .date(w.getDate())
                            .startTime(w.getStartTime())
                            .endTime(w.getEndTime())
                            .build())
                    .toList();
        }
        
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .description(request.getDescription())
                .availabilityWindows(windows)
                .status(Resource.ResourceStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Resource savedResource = resourceRepository.save(resource);
        log.info("Resource created successfully with ID: {}", savedResource.getId());
        return ResourceResponse.fromEntity(savedResource);
    }
    
    /**
     * Update an existing resource (ADMIN only)
     */
    public ResourceResponse updateResource(String id, ResourceUpdateRequest request) {
        log.info("Updating resource with ID: {}", id);
        
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Resource not found with ID: {}", id);
                    return new ResourceNotFoundException("Resource not found with ID: " + id);
                });
        
        // Update fields if provided
        if (request.getName() != null) {
            resource.setName(request.getName());
        }
        if (request.getType() != null) {
            resource.setType(request.getType());
        }
        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }
        if (request.getLocation() != null) {
            resource.setLocation(request.getLocation());
        }
        if (request.getDescription() != null) {
            resource.setDescription(request.getDescription());
        }
        if (request.getAvailabilityWindows() != null) {
            List<Resource.AvailabilityWindow> windows = request.getAvailabilityWindows().stream()
                    .map(w -> Resource.AvailabilityWindow.builder()
                            .daysOfWeek(w.getDaysOfWeek())
                            .date(w.getDate())
                            .startTime(w.getStartTime())
                            .endTime(w.getEndTime())
                            .build())
                    .toList();
            resource.setAvailabilityWindows(windows);
        }
        
        resource.setUpdatedAt(LocalDateTime.now());
        Resource updatedResource = resourceRepository.save(resource);
        log.info("Resource updated successfully with ID: {}", id);
        return ResourceResponse.fromEntity(updatedResource);
    }
    
    /**
     * Delete a resource (ADMIN only)
     */
    public void deleteResource(String id) {
        log.info("Deleting resource with ID: {}", id);
        
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Resource not found with ID: {}", id);
                    return new ResourceNotFoundException("Resource not found with ID: " + id);
                });
        
        resourceRepository.delete(resource);
        log.info("Resource deleted successfully with ID: {}", id);
    }
    
    /**
     * Update resource status (ADMIN only)
     */
    public ResourceResponse updateStatus(String id, Resource.ResourceStatus status) {
        log.info("Updating resource status for ID: {} to: {}", id, status);
        
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Resource not found with ID: {}", id);
                    return new ResourceNotFoundException("Resource not found with ID: " + id);
                });
        
        resource.setStatus(status);
        resource.setUpdatedAt(LocalDateTime.now());
        Resource updatedResource = resourceRepository.save(resource);
        log.info("Resource status updated successfully for ID: {}", id);
        return ResourceResponse.fromEntity(updatedResource);
    }
}
