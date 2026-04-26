package com.smartcampus.ticketing_service.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTechnicianRequest {

    @NotBlank(message = "Technician ID is required")
    private String technicianId;

    public String getTechnicianId() {
        return this.technicianId;
    }

    public void setTechnicianId(String technicianId) {
        this.technicianId = technicianId;
    }
}

