package com.smartcampus.ticketing_service.controller;

import com.smartcampus.ticketing_service.dto.ResourceCreateRequest;
import com.smartcampus.ticketing_service.dto.ResourceResponse;
import com.smartcampus.ticketing_service.dto.ResourceUpdateRequest;
import com.smartcampus.ticketing_service.model.Resource;
import com.smartcampus.ticketing_service.service.ResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Resource Controller - Module A: Facilities & Assets Catalogue
 * Manages campus resources including Lecture Halls, Labs, Meeting Rooms and Equipment
 *
 * Endpoints:
 * GET    /api/resources               - Get all resources with filters
 * GET    /api/resources/{id}          - Get resource by ID
 * POST   /api/resources               - Create resource (Admin only)
 * PUT    /api/resources/{id}          - Update resource (Admin only)
 * DELETE /api/resources/{id}          - Delete resource (Admin only)
 * PATCH  /api/resources/{id}/status   - Update status (Admin only)
 *
 * @author IrushaDilshan
 */

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {
    
    private final ResourceService resourceService;
    
    /**
     * Get all resources with optional filters
     * GET /api/resources?type=LECTURE_HALL&location=Building%20A&minCapacity=30&activeOnly=true
     */
    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(defaultValue = "false") Boolean activeOnly) {
        
        log.info("GET /api/resources - type: {}, location: {}, minCapacity: {}, activeOnly: {}",
                type, location, minCapacity, activeOnly);
        
        List<ResourceResponse> resources = resourceService.getAllResources(type, location, minCapacity, activeOnly);
        return ResponseEntity.ok(resources);
    }
    
    /**
     * Get resource by ID
     * GET /api/resources/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable String id) {
        log.info("GET /api/resources/{} - Fetching resource by ID", id);
        ResourceResponse resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }
    
    /**
     * Create a new resource (ADMIN only)
     * POST /api/resources
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceCreateRequest request) {
        log.info("POST /api/resources - Creating new resource: {}", request.getName());
        ResourceResponse createdResource = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
    }
    
    /**
     * Update a resource (ADMIN only)
     * PUT /api/resources/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceUpdateRequest request) {
        
        log.info("PUT /api/resources/{} - Updating resource", id);
        ResourceResponse updatedResource = resourceService.updateResource(id, request);
        return ResponseEntity.ok(updatedResource);
    }
    
    /**
     * Delete a resource (ADMIN only)
     * DELETE /api/resources/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        log.info("DELETE /api/resources/{} - Deleting resource", id);
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Update resource status (ADMIN only)
     * PATCH /api/resources/{id}/status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> updateResourceStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        
        log.info("PATCH /api/resources/{}/status - Updating status", id);
        
        String statusStr = request.get("status");
        if (statusStr == null || statusStr.isEmpty()) {
            log.error("Status not provided in request body");
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Resource.ResourceStatus status = Resource.ResourceStatus.valueOf(statusStr.toUpperCase());
            ResourceResponse updatedResource = resourceService.updateStatus(id, status);
            return ResponseEntity.ok(updatedResource);
        } catch (IllegalArgumentException e) {
            log.error("Invalid status value: {}", statusStr);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid status. Must be ACTIVE or OUT_OF_SERVICE");
            return ResponseEntity.badRequest().body(null);
        }
    }
}
