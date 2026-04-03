package com.lms.assessment_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    private Long userId; // Reference to external User

    private Integer score;
    private LocalDateTime attemptDate = LocalDateTime.now();

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAnswer> answers;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getAttemptDate() { return attemptDate; }
    public void setAttemptDate(LocalDateTime attemptDate) { this.attemptDate = attemptDate; }

    public List<QuizAnswer> getAnswers() { return answers; }
    public void setAnswers(List<QuizAnswer> answers) { this.answers = answers; }
}
