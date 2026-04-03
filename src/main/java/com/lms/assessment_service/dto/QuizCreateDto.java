package com.lms.assessment_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class QuizCreateDto {
    @NotNull(message = "Course ID is mandatory")
    private Long courseId;
    
    @NotBlank(message = "Quiz title must not be blank")
    private String title;
    
    private String description;
    
    @NotEmpty(message = "Quiz must contain at least one question")
    @Valid
    private List<QuizQuestionCreateDto> questions;

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<QuizQuestionCreateDto> getQuestions() { return questions; }
    public void setQuestions(List<QuizQuestionCreateDto> questions) { this.questions = questions; }
}
