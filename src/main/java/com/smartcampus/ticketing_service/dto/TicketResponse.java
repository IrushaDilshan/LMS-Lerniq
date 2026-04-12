package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.TicketPriority;
import com.smartcampus.ticketing_service.model.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {
    private Long id;
    private String resourceLocation;
    private String category;
    private String description;
    private String resolutionNote;
    private String rejectionReason;
    private TicketPriority priority;
    private String preferredContactDetails;
    private TicketStatus status;
    private List<String> attachmentUrls;
    private Long createdByUserId;
    private Long assignedTechnicianId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getRejectionReason() {
        return this.rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Long getId() {
        return this.id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }

    public String getResourceLocation() {
        return this.resourceLocation;
    }
    
    public void setResourceLocation(String resourceLocation) {
        this.resourceLocation = resourceLocation;
    }

    public String getCategory() {
        return this.category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public String getResolutionNote() {
        return this.resolutionNote;
    }
    
    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
    }

    public TicketPriority getPriority() {
        return this.priority;
    }
    
    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public String getPreferredContactDetails() {
        return this.preferredContactDetails;
    }
    
    public void setPreferredContactDetails(String preferredContactDetails) {
        this.preferredContactDetails = preferredContactDetails;
    }

    public TicketStatus getStatus() {
        return this.status;
    }
    
    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public List<String> getAttachmentUrls() {
        return this.attachmentUrls;
    }
    
    public void setAttachmentUrls(List<String> attachmentUrls) {
        this.attachmentUrls = attachmentUrls;
    }

    public Long getCreatedByUserId() {
        return this.createdByUserId;
    }
    
    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public Long getAssignedTechnicianId() {
        return this.assignedTechnicianId;
    }
    
    public void setAssignedTechnicianId(Long assignedTechnicianId) {
        this.assignedTechnicianId = assignedTechnicianId;
    }

    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return this.updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}
