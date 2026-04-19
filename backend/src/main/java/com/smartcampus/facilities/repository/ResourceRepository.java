package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.model.Resource;
import com.smartcampus.facilities.model.ResourceStatus;
import com.smartcampus.facilities.model.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Resource entity.
 * Provides CRUD + custom search/filter queries.
 *
 * Member 1 - Facilities & Assets Catalogue
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Dynamic search with optional filters: type, status, location, minCapacity.
     * All parameters are optional (null = ignored in filter).
     */
    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:keyword IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Resource> searchResources(
            @Param("type") ResourceType type,
            @Param("status") ResourceStatus status,
            @Param("location") String location,
            @Param("minCapacity") Integer minCapacity,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    /**
     * Find all resources by type.
     */
    List<Resource> findByType(ResourceType type);

    /**
     * Find all active resources.
     */
    List<Resource> findByStatus(ResourceStatus status);

    /**
     * Check if a resource name already exists (for duplicate prevention).
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Count resources grouped by status (for admin dashboard).
     */
    @Query("SELECT r.status, COUNT(r) FROM Resource r GROUP BY r.status")
    List<Object[]> countByStatus();

    /**
     * Count resources grouped by type.
     */
    @Query("SELECT r.type, COUNT(r) FROM Resource r GROUP BY r.type")
    List<Object[]> countByType();
}
