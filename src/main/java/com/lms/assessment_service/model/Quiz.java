package com.lms.assessment_service.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "quizzes")
public class Quiz {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long courseId; // Reference to external Course

    private String title;
    private String description;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestion> questions;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<QuizQuestion> getQuestions() { return questions; }
    public void setQuestions(List<QuizQuestion> questions) { this.questions = questions; }
}
