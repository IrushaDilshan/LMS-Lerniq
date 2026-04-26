package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponse {
    
    private String id;
    
    private String name;
    
    private Resource.ResourceType type;
    
    private Integer capacity;
    
    private String location;
    
    private String description;
    
    private List<AvailabilityWindowDTO> availabilityWindows;
    
    private Resource.ResourceStatus status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailabilityWindowDTO {
        private List<String> daysOfWeek;
        private String date;
        private String startTime;
        private String endTime;
    }
    
    /**
     * Convert Resource entity to ResourceResponse
     */
    public static ResourceResponse fromEntity(Resource resource) {
        List<AvailabilityWindowDTO> windows = null;
        if (resource.getAvailabilityWindows() != null) {
            windows = resource.getAvailabilityWindows().stream()
                    .map(w -> AvailabilityWindowDTO.builder()
                            .daysOfWeek(w.getDaysOfWeek())
                            .date(w.getDate())
                            .startTime(w.getStartTime())
                            .endTime(w.getEndTime())
                            .build())
                    .toList();
        }
        
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .description(resource.getDescription())
                .availabilityWindows(windows)
                .status(resource.getStatus())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
