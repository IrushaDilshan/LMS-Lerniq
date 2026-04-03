package com.lms.assessment_service.repository;

import com.lms.assessment_service.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByUserId(Long userId);
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);
}
