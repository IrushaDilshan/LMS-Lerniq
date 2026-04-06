import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import { Plus, Edit2, Trash2, Calendar, BookOpen, Search, ClipboardCheck } from 'lucide-react';

const InstructorAssignmentList = ({ courseId = 1 }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAssignmentsByCourse(courseId);
      setAssignments(data || []);
    } catch (err) {
      setError('Failed to load assignments. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the assignment "${title}"?\nThis action cannot be undone.`)) {
      try {
        await assignmentService.deleteAssignment(id);
        setAssignments(assignments.filter(a => a.id !== id));
      } catch (err) {
        alert("Failed to delete the assignment. It may have student submissions tied to it.");
        console.error(err);
      }
    }
  };

  const filteredAssignments = assignments.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Assignments</h1>
          <p className="text-gray-500 font-medium">Course ID: {courseId} | Instructor View</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <Link
            to="/instructor/assignments/new"
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition duration-200 shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-1" /> New Assignment
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm border border-red-100">{error}</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="text-gray-500 text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments found</h3>
          <p className="mb-6 max-w-md mx-auto">Get started by creating your first assignment for your students.</p>
          <Link
            to="/instructor/assignments/new"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
          >
            <Plus className="w-5 h-5 mr-2" /> Create First Assignment
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-sm sm:text-base">
          <div className="overflow-x-auto">
             <table className="w-full whitespace-nowrap">
               <thead className="bg-gray-50 text-gray-600 font-semibold text-left border-b border-gray-200">
                 <tr>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs">Title & Description</th>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs text-center">Due Date</th>
                   <th className="py-4 px-6 uppercase tracking-wider text-xs text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredAssignments.map((assignment) => (
                   <tr key={assignment.id} className="hover:bg-indigo-50/30 transition-colors">
                     <td className="py-4 px-6">
                       <span className="font-bold text-gray-900 block">{assignment.title}</span>
                       <span className="text-gray-500 text-sm truncate max-w-xs block mt-1">
                         {assignment.description || 'No description'}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-center text-gray-700 font-medium">
                       {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No Due Date'}
                     </td>
                     <td className="py-4 px-6 text-right space-x-3">
                       <button
                         onClick={() => navigate(`/instructor/assignments/${assignment.id}/edit`)}
                         className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                       >
                         <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                       </button>
                       <button
                         onClick={() => navigate(`/instructor/assignments/${assignment.id}/grade`)}
                         className="inline-flex items-center text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors"
                       >
                         <ClipboardCheck className="w-4 h-4 mr-1.5" /> Submissions
                       </button>
                       <button
                         onClick={() => handleDelete(assignment.id, assignment.title)}
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

export default InstructorAssignmentList;
