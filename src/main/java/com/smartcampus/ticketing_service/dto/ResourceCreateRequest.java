package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceCreateRequest {
    
    @NotBlank(message = "Resource name is required")
    private String name;
    
    @NotNull(message = "Resource type is required")
    private Resource.ResourceType type;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String description;
    
    private List<AvailabilityWindowDTO> availabilityWindows;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailabilityWindowDTO {
        private List<String> daysOfWeek;
        
        private String date; 
        
        @NotBlank(message = "Start time is required")
        private String startTime;
        
        @NotBlank(message = "End time is required")
        private String endTime;
    }
}
