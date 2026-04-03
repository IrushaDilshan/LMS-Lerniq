package com.lms.assessment_service.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AssignmentCreateDto {
    @NotNull(message = "Course ID is mandatory")
    private Long courseId;
    
    @NotBlank(message = "Title must not be blank")
    private String title;
    
    private String description;
    
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}
