package com.lms.assessment_service.dto;

import java.util.List;

public class QuizAttemptSubmitDto {
    private Long userId;
    private List<QuizAnswerSubmitDto> answers;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<QuizAnswerSubmitDto> getAnswers() { return answers; }
    public void setAnswers(List<QuizAnswerSubmitDto> answers) { this.answers = answers; }
}
