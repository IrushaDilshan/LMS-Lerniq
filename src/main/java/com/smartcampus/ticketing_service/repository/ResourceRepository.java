package com.smartcampus.ticketing_service.repository;

import com.smartcampus.ticketing_service.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    /**
     * Find all resources by type
     */
    List<Resource> findByType(Resource.ResourceType type);
    
    /**
     * Find all resources by location (case-insensitive)
     */
    List<Resource> findByLocationIgnoreCase(String location);
    
    /**
     * Find all resources by status
     */
    List<Resource> findByStatus(Resource.ResourceStatus status);
    
    /**
     * Find resources with capacity greater than or equal to minCapacity
     */
    List<Resource> findByCapacityGreaterThanEqual(Integer minCapacity);
    
    /**
     * Find resources by name (case-insensitive, containing)
     */
    List<Resource> findByNameIgnoreCaseContaining(String name);
    
    /**
     * Find resources by type and status
     */
    List<Resource> findByTypeAndStatus(Resource.ResourceType type, Resource.ResourceStatus status);
    
    /**
     * Find resources by location and status
     */
    List<Resource> findByLocationIgnoreCaseAndStatus(String location, Resource.ResourceStatus status);
    
    /**
     * Find resources by type and capacity >= minCapacity
     */
    List<Resource> findByTypeAndCapacityGreaterThanEqual(Resource.ResourceType type, Integer minCapacity);
}
