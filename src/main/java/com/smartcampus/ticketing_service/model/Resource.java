package com.smartcampus.ticketing_service.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {
    
    @Id
    private String id;
    
    private String name;
    
    private ResourceType type;
    
    private Integer capacity;
    
    private String location;
    
    private String description;
    
    private List<AvailabilityWindow> availabilityWindows;
    
    private ResourceStatus status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Getter
    public enum ResourceType {
        LECTURE_HALL("Lecture Hall"),
        LAB("Lab"),
        MEETING_ROOM("Meeting Room"),
        EQUIPMENT("Equipment");
        
        private final String displayName;
        
        ResourceType(String displayName) {
            this.displayName = displayName;
        }
    }
    
    @Getter
    public enum ResourceStatus {
        ACTIVE("Active"),
        OUT_OF_SERVICE("Out of Service");
        
        private final String displayName;
        
        ResourceStatus(String displayName) {
            this.displayName = displayName;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailabilityWindow {
        private List<String> daysOfWeek; // Monday, Tuesday, etc.
        private String date; // Specific date if applicable (YYYY-MM-DD)
        private String startTime; // HH:mm format
        private String endTime; // HH:mm format
    }
}
