import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import quizService from '../../services/quizService';
import { Plus, Trash2, Save, X, ChevronLeft } from 'lucide-react';

const QuizForm = ({ courseId = 1 }) => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!quizId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: courseId,
    questions: [
      { questionText: '', points: 1, correctAnswer: '' }
    ]
  });

  useEffect(() => {
    if (isEditing) {
      const fetchQuiz = async () => {
        try {
          const data = await quizService.getQuizById(quizId);
          // Map backend questions to form format (QuizQuestionCreateDto) if structure differs
          // Assuming backend QuizQuestion fields mostly match CreateDto
          setFormData({
            title: data.title || '',
            description: data.description || '',
            courseId: data.courseId || courseId,
            questions: data.questions && data.questions.length > 0 ? 
              data.questions.map(q => ({
                questionText: q.text || q.questionText || '',
                points: q.points || 1,
                correctAnswer: q.correctAnswer || ''
              })) : 
              [{ questionText: '', points: 1, correctAnswer: '' }]
          });
        } catch (err) {
          setError('Failed to load quiz details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    }
  }, [quizId, isEditing, courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = field === 'points' ? parseInt(value, 10) || 1 : value;
    setFormData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { questionText: '', points: 1, correctAnswer: '' }]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, questions: newQuestions }));
    } else {
      alert("A quiz must have at least one question.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }
    
    const invalidQuestions = formData.questions.some(q => !q.questionText.trim() || !q.correctAnswer.trim());
    if (invalidQuestions) {
      alert("All questions must have text and a correct answer");
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await quizService.updateQuiz(quizId, formData);
        alert('Quiz updated successfully!');
      } else {
        await quizService.createQuiz(formData);
        alert('Quiz created successfully!');
      }
      navigate('/instructor/quizzes');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save quiz. Please check validation rules.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button
        onClick={() => navigate('/instructor/quizzes')}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Manage Quizzes
      </button>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>
          <p className="text-indigo-100 mt-1">Configure your quiz details and add questions</p>
        </div>

        {error && (
          <div className="m-6 bg-red-50 text-red-600 p-4 rounded-lg shadow-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6 mb-10 pb-8 border-b border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quiz Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Midterm Exam"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Instructions or summary for students..."
              />
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Questions</h3>
            <span className="text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
              Total: {formData.questions.length}
            </span>
          </div>

          <div className="space-y-6">
            {formData.questions.map((q, index) => (
              <div key={index} className="p-6 bg-gray-50 border border-gray-200 rounded-xl relative group">
                <div className="absolute top-4 right-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Remove Question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Question {index + 1}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Text *</label>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter question text here..."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
                      <input
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Expected answer string..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Points *</label>
                      <input
                        type="number"
                        min="1"
                        value={q.points}
                        onChange={(e) => handleQuestionChange(index, 'points', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="mt-6 flex items-center justify-center w-full py-4 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-colors font-medium cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Another Question
          </button>

          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/instructor/quizzes')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center px-8 py-2 rounded-lg font-bold shadow-md transition duration-200 ${
                saving 
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Quiz</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
