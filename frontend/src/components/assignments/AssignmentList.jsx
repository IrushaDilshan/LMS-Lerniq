import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import { Calendar, FileText } from 'lucide-react';

const AssignmentList = ({ courseId = 1 }) => { // Default to courseId 1 for now
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchAssignments();
  }, [courseId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm">{error}</div>;
  }

  if (assignments.length === 0) {
    return <div className="text-gray-500 text-center py-12 bg-white rounded-lg shadow-sm">No assignments available for this course.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Course Assignments</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{assignment.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem] text-sm">
                {assignment.description || "No description provided."}
              </p>
              
              <div className="space-y-2 mb-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  <span>Max Score: {assignment.maxScore || '100'}</span>
                </div>
                {assignment.dueDate && (
                  <div className="flex items-center font-medium text-red-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <Link 
                to={`/assignments/${assignment.id}/submit`}
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                View & Submit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
