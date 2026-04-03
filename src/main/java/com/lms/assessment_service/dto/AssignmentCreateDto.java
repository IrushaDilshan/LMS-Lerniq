package com.lms.assessment_service.dto;

import java.time.LocalDateTime;

public class AssignmentCreateDto {
    private Long courseId;
    private String title;
    private String description;
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
