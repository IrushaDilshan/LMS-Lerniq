package com.lms.assessment_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuizQuestionCreateDto {
    @NotBlank(message = "Question text cannot be empty")
    private String questionText;
    
    @NotNull(message = "Points must be specified")
    @Min(value = 1, message = "Points must be at least 1")
    private Integer points;
    
    @NotBlank(message = "Correct answer cannot be empty")
    private String correctAnswer;

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
