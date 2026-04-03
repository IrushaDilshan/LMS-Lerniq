package com.lms.assessment_service.service;

import com.lms.assessment_service.dto.QuizAttemptSubmitDto;
import com.lms.assessment_service.dto.QuizAnswerSubmitDto;
import com.lms.assessment_service.dto.QuizCreateDto;
import com.lms.assessment_service.dto.QuizQuestionCreateDto;
import com.lms.assessment_service.exception.ResourceNotFoundException;
import com.lms.assessment_service.model.Quiz;
import com.lms.assessment_service.model.QuizAnswer;
import com.lms.assessment_service.model.QuizAttempt;
import com.lms.assessment_service.model.QuizQuestion;
import com.lms.assessment_service.repository.QuizAttemptRepository;
import com.lms.assessment_service.repository.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;

    public QuizService(QuizRepository quizRepository, QuizAttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional
    public Quiz createQuiz(QuizCreateDto dto) {
        Quiz quiz = new Quiz();
        quiz.setCourseId(dto.getCourseId());
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        
        List<QuizQuestion> questions = new ArrayList<>();
        if (dto.getQuestions() != null) {
            for (QuizQuestionCreateDto qDto : dto.getQuestions()) {
                QuizQuestion q = new QuizQuestion();
                q.setQuestionText(qDto.getQuestionText());
                q.setPoints(qDto.getPoints());
                q.setCorrectAnswer(qDto.getCorrectAnswer());
                q.setQuiz(quiz);
                questions.add(q);
            }
        }
        quiz.setQuestions(questions);
        return quizRepository.save(quiz);
    }

    @Transactional
    public QuizAttempt submitQuizAttempt(Long quizId, QuizAttemptSubmitDto dto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setUserId(dto.getUserId());
        
        int totalScore = 0;
        List<QuizAnswer> answers = new ArrayList<>();
        
        Map<Long, QuizQuestion> questionMap = quiz.getQuestions().stream()
                .collect(Collectors.toMap(QuizQuestion::getId, q -> q));

        if (dto.getAnswers() != null) {
            for (QuizAnswerSubmitDto aDto : dto.getAnswers()) {
                QuizQuestion question = questionMap.get(aDto.getQuestionId());
                if (question == null) continue;
                
                QuizAnswer answer = new QuizAnswer();
                answer.setAttempt(attempt);
                answer.setQuestion(question);
                
                String studentAnswer = aDto.getStudentAnswer() != null ? aDto.getStudentAnswer().trim() : "";
                answer.setStudentAnswer(studentAnswer);
                
                boolean isCorrect = question.getCorrectAnswer() != null && 
                                    question.getCorrectAnswer().equalsIgnoreCase(studentAnswer);
                answer.setIsCorrect(isCorrect);
                
                if (isCorrect) {
                    totalScore += question.getPoints() != null ? question.getPoints() : 0;
                }
                answers.add(answer);
            }
        }
        
        attempt.setAnswers(answers);
        attempt.setScore(totalScore);
        
        return attemptRepository.save(attempt);
    }

    public List<Quiz> getQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourseId(courseId);
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id " + id));
    }

    @Transactional
    public Quiz updateQuiz(Long id, QuizCreateDto dto) {
        Quiz quiz = getQuizById(id);
        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        // For simplicity in a basic project, we might just re-create questions or leave them.
        // We'll leave question updates out unless explicitly needed, returning the quiz.
        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = getQuizById(id);
        quizRepository.delete(quiz);
    }
} 
