package com.smartcampus.ticketing_service.dto;

import jakarta.validation.constraints.NotNull;

public class AssignTechnicianRequest {

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    public Long getTechnicianId() {
        return this.technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }
}
