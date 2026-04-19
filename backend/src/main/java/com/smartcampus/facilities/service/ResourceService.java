package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.ResourceDto;
import com.smartcampus.facilities.exception.DuplicateResourceException;
import com.smartcampus.facilities.exception.ResourceNotFoundException;
import com.smartcampus.facilities.model.Resource;
import com.smartcampus.facilities.model.ResourceStatus;
import com.smartcampus.facilities.model.ResourceType;
import com.smartcampus.facilities.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service layer for Facilities & Assets Catalogue.
 * Contains all business logic - controllers only call this.
 *
 * Member 1 - Facilities & Assets Catalogue
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ResourceService {

    private final ResourceRepository resourceRepository;

    // ── CREATE ───────────────────────────────────────────────────────────────

    /**
     * Creates a new campus resource.
     * Validates for duplicate names before saving.
     */
    @Transactional
    public ResourceDto.Response createResource(ResourceDto.CreateRequest request, String createdBy) {
        log.info("Creating resource: {} of type: {}", request.getName(), request.getType());

        // Business rule: no duplicate names
        if (resourceRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException(
                    "A resource with name '" + request.getName() + "' already exists");
        }

        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : ResourceStatus.ACTIVE)
                .availabilityWindows(request.getAvailabilityWindows())
                .building(request.getBuilding())
                .floor(request.getFloor())
                .roomNumber(request.getRoomNumber())
                .createdBy(createdBy)
                .build();

        Resource saved = resourceRepository.save(resource);
        log.info("Resource created with id: {}", saved.getId());
        return toResponse(saved);
    }

    // ── READ ─────────────────────────────────────────────────────────────────

    /**
     * Gets a single resource by ID.
     */
    public ResourceDto.Response getResourceById(Long id) {
        Resource resource = findResourceOrThrow(id);
        return toResponse(resource);
    }

    /**
     * Searches/filters resources with pagination.
     * All filter params are optional.
     */
    public Page<ResourceDto.Response> searchResources(
            ResourceType type,
            ResourceStatus status,
            String location,
            Integer minCapacity,
            String keyword,
            Pageable pageable) {

        log.debug("Searching resources: type={}, status={}, location={}, minCap={}, keyword={}",
                type, status, location, minCapacity, keyword);

        return resourceRepository
                .searchResources(type, status, location, minCapacity, keyword, pageable)
                .map(this::toResponse);
    }

    /**
     * Gets summary statistics for the admin dashboard.
     */
    public Map<String, Object> getResourceStats() {
        Map<String, Object> stats = new HashMap<>();

        // Count by status
        Map<String, Long> byStatus = new HashMap<>();
        resourceRepository.countByStatus()
                .forEach(row -> byStatus.put(row[0].toString(), (Long) row[1]));
        stats.put("byStatus", byStatus);

        // Count by type
        Map<String, Long> byType = new HashMap<>();
        resourceRepository.countByType()
                .forEach(row -> byType.put(row[0].toString(), (Long) row[1]));
        stats.put("byType", byType);

        stats.put("totalResources", resourceRepository.count());
        return stats;
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    /**
     * Full update of a resource (PUT semantics - fields not provided are left unchanged).
     */
    @Transactional
    public ResourceDto.Response updateResource(Long id, ResourceDto.UpdateRequest request) {
        log.info("Updating resource id: {}", id);
        Resource resource = findResourceOrThrow(id);

        // Only update fields that are provided (not null)
        if (request.getName() != null) {
            if (!resource.getName().equalsIgnoreCase(request.getName())
                    && resourceRepository.existsByNameIgnoreCase(request.getName())) {
                throw new DuplicateResourceException(
                        "A resource with name '" + request.getName() + "' already exists");
            }
            resource.setName(request.getName());
        }
        if (request.getType() != null)                  resource.setType(request.getType());
        if (request.getLocation() != null)              resource.setLocation(request.getLocation());
        if (request.getCapacity() != null)              resource.setCapacity(request.getCapacity());
        if (request.getDescription() != null)           resource.setDescription(request.getDescription());
        if (request.getStatus() != null)                resource.setStatus(request.getStatus());
        if (request.getAvailabilityWindows() != null)   resource.setAvailabilityWindows(request.getAvailabilityWindows());
        if (request.getBuilding() != null)              resource.setBuilding(request.getBuilding());
        if (request.getFloor() != null)                 resource.setFloor(request.getFloor());
        if (request.getRoomNumber() != null)            resource.setRoomNumber(request.getRoomNumber());

        Resource updated = resourceRepository.save(resource);
        log.info("Resource updated: {}", updated.getId());
        return toResponse(updated);
    }

    /**
     * Patch only the status of a resource (PATCH semantics).
     */
    @Transactional
    public ResourceDto.Response updateResourceStatus(Long id, ResourceStatus newStatus) {
        log.info("Updating resource {} status to {}", id, newStatus);
        Resource resource = findResourceOrThrow(id);
        resource.setStatus(newStatus);
        return toResponse(resourceRepository.save(resource));
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    /**
     * Deletes a resource permanently.
     * Only callable by ADMIN role (enforced at controller level).
     */
    @Transactional
    public void deleteResource(Long id) {
        log.info("Deleting resource id: {}", id);
        Resource resource = findResourceOrThrow(id);
        resourceRepository.delete(resource);
        log.info("Resource {} deleted successfully", id);
    }

    // ── Private Helpers ──────────────────────────────────────────────────────

    private Resource findResourceOrThrow(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", id));
    }

    private ResourceDto.Response toResponse(Resource resource) {
        return ResourceDto.Response.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .location(resource.getLocation())
                .capacity(resource.getCapacity())
                .description(resource.getDescription())
                .status(resource.getStatus())
                .availabilityWindows(resource.getAvailabilityWindows())
                .building(resource.getBuilding())
                .floor(resource.getFloor())
                .roomNumber(resource.getRoomNumber())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .createdBy(resource.getCreatedBy())
                .build();
    }
}
