package com.smartcampus.facilities.controller;

import com.smartcampus.facilities.dto.ApiResponse;
import com.smartcampus.facilities.dto.ResourceDto;
import com.smartcampus.facilities.model.ResourceStatus;
import com.smartcampus.facilities.model.ResourceType;
import com.smartcampus.facilities.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Facilities & Assets Catalogue.
 *
 * Base URL: /api/resources
 *
 * Endpoints (Member 1):
 *   POST   /api/resources              - Create a new resource (ADMIN only)
 *   GET    /api/resources              - List / search resources (all authenticated)
 *   GET    /api/resources/{id}         - Get resource by ID
 *   PUT    /api/resources/{id}         - Full update (ADMIN only)
 *   PATCH  /api/resources/{id}/status  - Update status only (ADMIN only)
 *   DELETE /api/resources/{id}         - Delete resource (ADMIN only)
 *   GET    /api/resources/stats        - Get statistics (ADMIN only)
 *
 * Member 1 - Facilities & Assets Catalogue
 */
@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173") // React dev server
public class ResourceController {

    private final ResourceService resourceService;

    // ── POST /resources ──────────────────────────────────────────────────────

    /**
     * Creates a new bookable campus resource.
     * Only ADMIN users can create resources.
     *
     * @return 201 Created with the new resource, or 400/409 on error
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDto.Response>> createResource(
            @Valid @RequestBody ResourceDto.CreateRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String createdBy = jwt.getSubject();
        ResourceDto.Response created = resourceService.createResource(request, createdBy);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", created));
    }

    // ── GET /resources ───────────────────────────────────────────────────────

    /**
     * Lists and searches all resources with optional filters.
     * All authenticated users can browse the catalogue.
     *
     * Query params:
     *   type        - filter by ResourceType enum
     *   status      - filter by ResourceStatus enum
     *   location    - partial match on location string
     *   minCapacity - minimum capacity filter
     *   keyword     - search in name / description
     *   page        - page number (0-based, default 0)
     *   size        - page size (default 10)
     *   sort        - sort field (default: name)
     *   direction   - ASC or DESC (default: ASC)
     *
     * @return 200 OK with paginated list of resources
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<ResourceDto.Response>>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "ASC") String direction) {

        Sort.Direction sortDir = direction.equalsIgnoreCase("DESC")
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sort));

        Page<ResourceDto.Response> results =
                resourceService.searchResources(type, status, location, minCapacity, keyword, pageable);

        return ResponseEntity.ok(ApiResponse.success(results));
    }

    // ── GET /resources/stats ─────────────────────────────────────────────────

    /**
     * Returns summary statistics (counts by type and status).
     * Used for the Admin dashboard.
     *
     * @return 200 OK with statistics map
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = resourceService.getResourceStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ── GET /resources/{id} ──────────────────────────────────────────────────

    /**
     * Gets a single resource by its ID.
     *
     * @return 200 OK with resource, or 404 if not found
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ResourceDto.Response>> getResourceById(
            @PathVariable Long id) {

        ResourceDto.Response resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.success(resource));
    }

    // ── PUT /resources/{id} ──────────────────────────────────────────────────

    /**
     * Fully updates an existing resource.
     * Only ADMIN users can modify resources.
     *
     * @return 200 OK with updated resource, or 404/400/409 on error
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDto.Response>> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceDto.UpdateRequest request) {

        ResourceDto.Response updated = resourceService.updateResource(id, request);
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", updated));
    }

    // ── PATCH /resources/{id}/status ─────────────────────────────────────────

    /**
     * Updates only the status of a resource (e.g., ACTIVE → OUT_OF_SERVICE).
     * Only ADMIN users can change resource status.
     *
     * @return 200 OK with updated resource
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceDto.Response>> updateResourceStatus(
            @PathVariable Long id,
            @Valid @RequestBody ResourceDto.StatusUpdateRequest request) {

        ResourceDto.Response updated = resourceService.updateResourceStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Resource status updated", updated));
    }

    // ── DELETE /resources/{id} ───────────────────────────────────────────────

    /**
     * Permanently deletes a resource.
     * Only ADMIN users can delete resources.
     *
     * @return 204 No Content on success, or 404 if not found
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(ApiResponse.<Void>builder()
                        .success(true)
                        .message("Resource deleted successfully")
                        .build());
    }
}
