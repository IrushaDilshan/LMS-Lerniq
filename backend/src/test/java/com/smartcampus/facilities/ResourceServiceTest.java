package com.smartcampus.facilities;

import com.smartcampus.facilities.dto.ResourceDto;
import com.smartcampus.facilities.exception.DuplicateResourceException;
import com.smartcampus.facilities.exception.ResourceNotFoundException;
import com.smartcampus.facilities.model.Resource;
import com.smartcampus.facilities.model.ResourceStatus;
import com.smartcampus.facilities.model.ResourceType;
import com.smartcampus.facilities.repository.ResourceRepository;
import com.smartcampus.facilities.service.ResourceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ResourceService.
 * Tests business logic without hitting the database.
 *
 * Member 1 - Facilities & Assets Catalogue
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ResourceService Unit Tests")
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceService resourceService;

    private Resource sampleResource;
    private ResourceDto.CreateRequest createRequest;

    @BeforeEach
    void setUp() {
        sampleResource = Resource.builder()
                .id(1L)
                .name("Lab A101")
                .type(ResourceType.LAB)
                .location("Block A, Floor 1")
                .capacity(30)
                .status(ResourceStatus.ACTIVE)
                .build();

        createRequest = ResourceDto.CreateRequest.builder()
                .name("Lab A101")
                .type(ResourceType.LAB)
                .location("Block A, Floor 1")
                .capacity(30)
                .build();
    }

    // ── Create Tests ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should create resource successfully")
    void createResource_Success() {
        when(resourceRepository.existsByNameIgnoreCase("Lab A101")).thenReturn(false);
        when(resourceRepository.save(any(Resource.class))).thenReturn(sampleResource);

        ResourceDto.Response response = resourceService.createResource(createRequest, "admin@sliit.lk");

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Lab A101");
        assertThat(response.getType()).isEqualTo(ResourceType.LAB);
        assertThat(response.getStatus()).isEqualTo(ResourceStatus.ACTIVE);

        verify(resourceRepository).save(any(Resource.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when name already exists")
    void createResource_DuplicateName_ThrowsException() {
        when(resourceRepository.existsByNameIgnoreCase("Lab A101")).thenReturn(true);

        assertThatThrownBy(() -> resourceService.createResource(createRequest, "admin@sliit.lk"))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Lab A101");

        verify(resourceRepository, never()).save(any());
    }

    // ── Get by ID Tests ──────────────────────────────────────────────────────

    @Test
    @DisplayName("Should return resource when found by ID")
    void getResourceById_Found() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(sampleResource));

        ResourceDto.Response response = resourceService.getResourceById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Lab A101");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when ID does not exist")
    void getResourceById_NotFound_ThrowsException() {
        when(resourceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.getResourceById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── Delete Tests ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("Should delete resource successfully")
    void deleteResource_Success() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(sampleResource));

        resourceService.deleteResource(1L);

        verify(resourceRepository).delete(sampleResource);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent resource")
    void deleteResource_NotFound_ThrowsException() {
        when(resourceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.deleteResource(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(resourceRepository, never()).delete(any());
    }

    // ── Status Update Tests ──────────────────────────────────────────────────

    @Test
    @DisplayName("Should update resource status successfully")
    void updateResourceStatus_Success() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(sampleResource));
        sampleResource.setStatus(ResourceStatus.OUT_OF_SERVICE);
        when(resourceRepository.save(any())).thenReturn(sampleResource);

        ResourceDto.Response response = resourceService.updateResourceStatus(1L, ResourceStatus.OUT_OF_SERVICE);

        assertThat(response.getStatus()).isEqualTo(ResourceStatus.OUT_OF_SERVICE);
    }
}
