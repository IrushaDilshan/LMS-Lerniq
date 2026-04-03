package com.lms.assessment_service.dto;

import java.util.List;

public class QuizCreateDto {
    private Long courseId;
    private String title;
    private String description;
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
