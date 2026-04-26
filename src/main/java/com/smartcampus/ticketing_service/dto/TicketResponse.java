package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.TicketPriority;
import com.smartcampus.ticketing_service.model.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {
    private String id;
    private String resourceLocation;
    private String category;
    private String description;
    private String resolutionNote;
    private String rejectionReason;
    private TicketPriority priority;
    private String preferredContactDetails;
    private String contactEmail;
    private String contactPhone;
    private TicketStatus status;
    private List<String> attachmentUrls;
    private String createdByUserId;
    private String assignedTechnicianId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByEmail;
    private String createdByUserName;
    private String assignedTechnicianName;
    private Integer rating;
    private String feedbackComment;

    public String getCreatedByUserName() {
        return createdByUserName;
    }

    public void setCreatedByUserName(String createdByUserName) {
        this.createdByUserName = createdByUserName;
    }

    public String getAssignedTechnicianName() {
        return assignedTechnicianName;
    }

    public void setAssignedTechnicianName(String assignedTechnicianName) {
        this.assignedTechnicianName = assignedTechnicianName;
    }

    public String getRejectionReason() {
        return this.rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getId() {
        return this.id;
    }
    
    public void setId(String id) {
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

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
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

    public String getCreatedByUserId() {
        return this.createdByUserId;
    }
    
    public void setCreatedByUserId(String createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public String getAssignedTechnicianId() {
        return this.assignedTechnicianId;
    }
    
    public void setAssignedTechnicianId(String assignedTechnicianId) {
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

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getFeedbackComment() {
        return feedbackComment;
    }

    public void setFeedbackComment(String feedbackComment) {
        this.feedbackComment = feedbackComment;
    }

}
