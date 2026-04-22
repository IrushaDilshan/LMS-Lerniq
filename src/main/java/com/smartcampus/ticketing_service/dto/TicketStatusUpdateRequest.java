package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.TicketStatus;

public class TicketStatusUpdateRequest {

    private TicketStatus status;
    private String resolutionNote;
    private String rejectionReason;

    public TicketStatus getStatus() {
        return this.status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return this.rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getResolutionNote() {
        return this.resolutionNote;
    }

    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
    }
}
