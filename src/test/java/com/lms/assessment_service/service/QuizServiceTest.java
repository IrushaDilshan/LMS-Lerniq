package com.lms.assessment_service.service;

import com.lms.assessment_service.dto.QuizAnswerSubmitDto;
import com.lms.assessment_service.dto.QuizAttemptSubmitDto;
import com.lms.assessment_service.model.Quiz;
import com.lms.assessment_service.model.QuizAttempt;
import com.lms.assessment_service.model.QuizQuestion;
import com.lms.assessment_service.repository.QuizAttemptRepository;
import com.lms.assessment_service.repository.QuizRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuizAttemptRepository attemptRepository;

    @InjectMocks
    private QuizService quizService;

    private Quiz mockQuiz;

    @BeforeEach
    void setUp() {
        mockQuiz = new Quiz();
        mockQuiz.setId(1L);
        
        List<QuizQuestion> questions = new ArrayList<>();
        
        QuizQuestion q1 = new QuizQuestion();
        q1.setId(101L);
        q1.setPoints(5);
        q1.setCorrectAnswer("A");
        
        QuizQuestion q2 = new QuizQuestion();
        q2.setId(102L);
        q2.setPoints(10);
        q2.setCorrectAnswer("B");
        
        questions.add(q1);
        questions.add(q2);
        
        mockQuiz.setQuestions(questions);
    }

    @Test
    void testSubmitQuizAttempt_CalculatesScoreCorrectly() {
        // Arrange
        when(quizRepository.findById(1L)).thenReturn(Optional.of(mockQuiz));
        when(attemptRepository.save(any(QuizAttempt.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuizAttemptSubmitDto submitDto = new QuizAttemptSubmitDto();
        submitDto.setUserId(1L);
        
        List<QuizAnswerSubmitDto> answers = new ArrayList<>();
        
        // Correct answer for Q1
        QuizAnswerSubmitDto a1 = new QuizAnswerSubmitDto();
        a1.setQuestionId(101L);
        a1.setStudentAnswer("A");
        
        // Incorrect answer for Q2
        QuizAnswerSubmitDto a2 = new QuizAnswerSubmitDto();
        a2.setQuestionId(102L);
        a2.setStudentAnswer("C"); // Correct is "B"
        
        answers.add(a1);
        answers.add(a2);
        submitDto.setAnswers(answers);

        // Act
        QuizAttempt resultAttempt = quizService.submitQuizAttempt(1L, submitDto);

        // Assert
        assertNotNull(resultAttempt);
        // User should get 5 points for Q1, 0 points for Q2
        assertEquals(5, resultAttempt.getScore());
        assertEquals(2, resultAttempt.getAnswers().size());
        
        // Check individual correctness
        assertEquals(true, resultAttempt.getAnswers().get(0).getIsCorrect());
        assertEquals(false, resultAttempt.getAnswers().get(1).getIsCorrect());
    }
}
