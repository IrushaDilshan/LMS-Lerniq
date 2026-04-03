package com.lms.assessment_service.dto;

public class AssignmentGradeDto {
    private Double grade;
    private String feedback;

    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
