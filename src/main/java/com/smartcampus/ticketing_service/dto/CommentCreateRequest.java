package com.smartcampus.ticketing_service.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentCreateRequest {

    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    private Long createdByUserId; // Usually sourced from token/session, mocked for now

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getCreatedByUserId() {
        return this.createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }
}
