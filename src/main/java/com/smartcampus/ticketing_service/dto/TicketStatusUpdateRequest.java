package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.TicketStatus;

public class TicketStatusUpdateRequest {

    private TicketStatus status;
    private String resolutionNote;

    public TicketStatus getStatus() {
        return this.status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getResolutionNote() {
        return this.resolutionNote;
    }

    public void setResolutionNote(String resolutionNote) {
        this.resolutionNote = resolutionNote;
    }
}
