import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

const QuizTake = ({ studentId = 1 }) => { // Default studentId for now
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track selected answers: { questionId: selectedOptionContent }
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuizById(quizId);
        setQuiz(data);
      } catch (err) {
        setError('Failed to load quiz details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (questionId, optionContent) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionContent
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit your quiz?")) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Format answers for API requirement: List<QuizAnswerSubmitDto>
      // DTO structure: { questionId: Long, answerContent: String, isCorrect: boolean }
      // The backend probably checks correctness, so we just send the content.
      const submittedAnswers = Object.entries(answers).map(([questionId, content]) => ({
        questionId: parseInt(questionId, 10),
        studentAnswer: content
      }));
      
      const payload = {
        userId: studentId,
        answers: submittedAnswers
      };
      
      const response = await quizService.submitAttempt(quizId, payload);
      setResult(response);
    } catch (err) {
      console.error('Submit error:', err);
      // Even if it fails validation, some APIs return 400 with message. We can handle generic error for now.
      alert('Failed to submit quiz. Please check if you answered all required questions.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto mt-10 bg-red-50 text-red-600 p-6 rounded-lg shadow-sm flex items-center">
      <AlertCircle className="w-6 h-6 mr-3" />
      <span className="text-lg">{error}</span>
    </div>
  );

  if (!quiz) return <div className="text-center mt-10">Quiz not found</div>;

  // Show Result view if submitted
  if (result) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center text-white">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-green-300" />
          <h2 className="text-3xl font-bold mb-2">Quiz Submitted!</h2>
          <p className="text-indigo-100">Your attempt has been recorded successfully.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Final Score</span>
            <span className="text-3xl font-bold text-indigo-600">{result.score || 0}</span>
          </div>
          
          <button 
            onClick={() => navigate('/quizzes')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Quiz Taking view
  const currentQuestion = quiz.questions ? quiz.questions[currentQuestionIndex] : null;
  const isLastQuestion = quiz.questions && currentQuestionIndex === quiz.questions.length - 1;
  const totalQuestions = quiz.questions ? quiz.questions.length : 0;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-gray-600">{quiz.description}</p>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">
            <span className="text-indigo-600 mr-2">{currentQuestionIndex + 1}.</span>
            {currentQuestion.questionText || currentQuestion.text || currentQuestion.content}
          </h2>
          
          <div className="space-y-4">
            {/* Options display setup for basic Multiple Choice strings/JSON arrays if implemented */}
            {currentQuestion.options ? (
               // If backend returns a list of options (List<String>)
               currentQuestion.options.map((option, idx) => (
                <label 
                  key={idx} 
                  className={`
                    flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${answers[currentQuestion.id] === option 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleOptionSelect(currentQuestion.id, option)}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700 font-medium">{option}</span>
                </label>
              ))
            ) : (
               // Simple fallback for free text if options are not pre-defined
               <textarea
                 className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-0 transition-colors"
                 rows="4"
                 placeholder="Type your answer here..."
                 value={answers[currentQuestion.id] || ''}
                 onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
               ></textarea>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-2xl shadow">No questions found for this quiz.</div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition duration-200 ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Previous
        </button>

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition duration-200"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex items-center px-8 py-3 rounded-xl font-bold shadow-md transition duration-200 ${
              submitting 
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTake;
