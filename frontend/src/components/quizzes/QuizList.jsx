import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import { BookOpen, Clock, Calendar } from 'lucide-react';

const QuizList = ({ courseId = 1 }) => { // Default to courseId 1 for now
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        // Assuming we're fetching for courseId passed as prop
        const data = await quizService.getQuizzesByCourse(courseId);
        setQuizzes(data || []);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm">{error}</div>;
  }

  if (quizzes.length === 0) {
    return <div className="text-gray-500 text-center py-12 bg-white rounded-lg shadow-sm">No quizzes available for this course.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Available Quizzes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{quiz.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem] text-sm">
                {quiz.description || "No description provided."}
              </p>
              
              <div className="space-y-2 mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>Time Limit: {quiz.timeLimit ? `${quiz.timeLimit} mins` : 'No limit'}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                  <span>Questions: {quiz.questions?.length || 'Multiple'}</span>
                </div>
                {quiz.dueDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                    <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <Link 
                to={`/quizzes/${quiz.id}/take`}
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Start Quiz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
