package com.smartcampus.ticketing_service.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incident_tickets")
public class IncidentTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This could also be a ManyToOne mapping to a Resource entity, depending on Component 1's implementation.
    // For now, we store the identifier or location string.
    @Column(nullable = false)
    private String resourceLocation;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Column(nullable = false)
    private String preferredContactDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    @ElementCollection
    @CollectionTable(name = "ticket_attachments", joinColumns = @JoinColumn(name = "ticket_id"))
    @Column(name = "image_url")
    private List<String> attachmentUrls = new ArrayList<>();

    @Column(nullable = false)
    private Long createdByUserId;

    private Long assignedTechnicianId;

    @Column(columnDefinition = "TEXT")
    private String resolutionNote;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public String getResolutionNote() {
        return this.resolutionNote;
    }
    
    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
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
