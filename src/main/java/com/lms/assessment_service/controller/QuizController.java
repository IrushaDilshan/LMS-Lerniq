package com.lms.assessment_service.controller;

import com.lms.assessment_service.dto.QuizAttemptSubmitDto;
import com.lms.assessment_service.dto.QuizCreateDto;
import com.lms.assessment_service.model.Quiz;
import com.lms.assessment_service.model.QuizAttempt;
import com.lms.assessment_service.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // Instructor: Create a new Quiz
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody QuizCreateDto dto) {
        Quiz created = quizService.createQuiz(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Student: Submit a Quiz attempt
    @PostMapping("/{quizId}/attempts")
    public ResponseEntity<QuizAttempt> submitQuizAttempt(
            @PathVariable Long quizId, 
            @RequestBody QuizAttemptSubmitDto dto) {
        QuizAttempt attempt = quizService.submitQuizAttempt(quizId, dto);
        return new ResponseEntity<>(attempt, HttpStatus.CREATED);
    }
}
