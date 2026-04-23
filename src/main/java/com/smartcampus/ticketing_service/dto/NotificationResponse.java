package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {
    private String id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private String relatedTicketId;
    private boolean read;
    private LocalDateTime createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getRelatedTicketId() {
        return relatedTicketId;
    }

    public void setRelatedTicketId(String relatedTicketId) {
        this.relatedTicketId = relatedTicketId;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
