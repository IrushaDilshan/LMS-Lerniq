package com.smartcampus.ticketing_service.dto;

import com.smartcampus.ticketing_service.model.TicketPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

public class TicketUpdateRequest {
    @NotBlank(message = "Resource location is required")
    private String resourceLocation;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    private String preferredContactDetails;
    @Email(message = "Invalid email format")
    private String contactEmail;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String contactPhone;

    public String getResourceLocation() { return resourceLocation; }
    public void setResourceLocation(String resourceLocation) { this.resourceLocation = resourceLocation; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public String getPreferredContactDetails() { return preferredContactDetails; }
    public void setPreferredContactDetails(String preferredContactDetails) { this.preferredContactDetails = preferredContactDetails; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
