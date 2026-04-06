import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import { Save, ArrowLeft, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

const AssignmentForm = ({ courseId = 1 }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(assignmentId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      if (isEditing) {
        try {
          const data = await assignmentService.getAssignmentById(assignmentId);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 16) : '',
          });
        } catch (err) {
          setError('Failed to load assignment data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssignment();
  }, [assignmentId, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate dueDate
      const due = new Date(formData.dueDate);
      if (due < new Date()) {
        setError('Due date must be in the future.');
        setSubmitting(false);
        return;
      }

      const payload = {
        courseId,
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      if (isEditing) {
        await assignmentService.updateAssignment(assignmentId, payload);
      } else {
        await assignmentService.createAssignment(payload);
      }
      navigate('/instructor/assignments');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save assignment. Please check the details and try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          type="button"
          onClick={() => navigate('/instructor/assignments')}
          className="mr-4 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEditing ? 'Edit Assignment' : 'Create New Assignment'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
            Course ID: {courseId} | Instructor Portal
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start">
          <div className="flex-1 text-red-700 text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Assignment Details
            </h3>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="pl-10 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 transition duration-150 ease-in-out"
                  placeholder="e.g., Final Project Proposal"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description & Instructions
              </label>
              <textarea
                name="description"
                id="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 transition duration-150 ease-in-out"
                placeholder="Provide detailed instructions, requirements, and grading criteria here..."
              />
            </div>

            {/* Due Date */}
            <div className="w-1/2">
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  name="dueDate"
                  id="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="pl-10 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 transition duration-150 ease-in-out"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <Calendar className="w-3 h-3 mr-1" /> Required. Must be set in the future.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/instructor/assignments')}
              className="px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Save Changes' : 'Create Assignment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
