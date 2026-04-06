import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import { Plus, Edit2, Trash2, Calendar, BookOpen, Search } from 'lucide-react';

const InstructorQuizList = ({ courseId = 1 }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzesByCourse(courseId);
      setQuizzes(data || []);
    } catch (err) {
      setError('Failed to load quizzes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the quiz "${title}"?\nThis action cannot be undone.`)) {
      try {
        await quizService.deleteQuiz(id);
        // Remove from list UI instead of full refetch
        setQuizzes(quizzes.filter(q => q.id !== id));
      } catch (err) {
        alert("Failed to delete the quiz. It may have student attempts tied to it.");
        console.error(err);
      }
    }
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Quizzes</h1>
          <p className="text-gray-500 font-medium">Course ID: {courseId} | Instructor View</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <Link
            to="/instructor/quizzes/new"
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition duration-200 shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1" /> New Quiz
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm border border-red-100">{error}</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-gray-500 text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No quizzes found</h3>
          <p className="mb-6 max-w-md mx-auto">Get started by creating your first quiz to test your students' knowledge.</p>
          <Link
            to="/instructor/quizzes/new"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
          >
            <Plus className="w-5 h-5 mr-2" /> Create First Quiz
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-sm sm:text-base">
          <div className="overflow-x-auto">
             <table className="w-full whitespace-nowrap">
               <thead className="bg-gray-50 text-gray-600 font-semibold text-left border-b border-gray-200">
                 <tr>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs">Title & Description</th>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs text-center">Questions</th>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs text-center">Points</th>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredQuizzes.map((quiz) => (
                   <tr key={quiz.id} className="hover:bg-indigo-50/30 transition-colors">
                     <td className="py-4 px-6">
                       <span className="font-bold text-gray-900 block">{quiz.title}</span>
                       <span className="text-gray-500 text-sm truncate max-w-xs block mt-1">
                         {quiz.description || 'No description'}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-center text-gray-700 font-medium">
                       {quiz.questions?.length || 0}
                     </td>
                     <td className="py-4 px-6 text-center">
                       <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                         {quiz.questions?.reduce((acc, q) => acc + (q.points || 1), 0) || 0} pts
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right space-x-3">
                       <button
                         onClick={() => navigate(`/instructor/quizzes/${quiz.id}/edit`)}
                         className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                       >
                         <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                       </button>
                       <button
                         onClick={() => handleDelete(quiz.id, quiz.title)}
                         className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                       >
                         <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorQuizList;
