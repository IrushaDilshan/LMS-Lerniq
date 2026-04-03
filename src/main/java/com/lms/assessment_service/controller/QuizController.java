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
@RequestMapping("/api/v1/quizzes")
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

    // --- NEW: App Retrieval & Management ---

    // Get all quizzes for a specific course
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<java.util.List<Quiz>> getQuizzesForCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizzesByCourse(courseId));
    }

    // Get a specific quiz's details
    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuizById(quizId));
    }

    // Update a quiz
    @PutMapping("/{quizId}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable Long quizId,
            @RequestBody QuizCreateDto dto) {
        return ResponseEntity.ok(quizService.updateQuiz(quizId, dto));
    }

    // Delete a quiz
    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
        return ResponseEntity.noContent().build();
    }
} 
