package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceUpdateRequest {
    
    private String name;
    
    private Resource.ResourceType type;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
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
        private String startTime;
        private String endTime;
    }
}
