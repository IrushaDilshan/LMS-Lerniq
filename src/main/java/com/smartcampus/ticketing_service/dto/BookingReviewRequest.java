package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.BookingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingReviewRequest {

    @NotNull(message = "Decision status is required")
    private BookingStatus decision;

    private String reason;

    @NotNull(message = "Admin user id is required")
    private Long adminUserId;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    public BookingStatus getDecision() {
        return decision;
    }

    public void setDecision(BookingStatus decision) {
        this.decision = decision;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Long getAdminUserId() {
        return adminUserId;
    }

    public void setAdminUserId(Long adminUserId) {
        this.adminUserId = adminUserId;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }
}
