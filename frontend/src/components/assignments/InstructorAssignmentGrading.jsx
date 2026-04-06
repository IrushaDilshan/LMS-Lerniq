import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import { ArrowLeft, Download, CheckCircle2, XCircle, Award, MessageSquare } from 'lucide-react';

const InstructorAssignmentGrading = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch assignment details for context
        const assignmentData = await assignmentService.getAssignmentById(assignmentId);
        setAssignment(assignmentData);

        // Fetch submissions
        const submissionsData = await assignmentService.getSubmissionsForAssignment(assignmentId);
        setSubmissions(submissionsData || []);
      } catch (err) {
        setError('Failed to load submissions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  const openGradingModal = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade != null ? submission.grade : '');
    setFeedback(submission.feedback || '');
  };

  const closeGradingModal = () => {
    setSelectedSubmission(null);
    setGrade('');
    setFeedback('');
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setSubmittingGrade(true);
    try {
      const payload = {
        grade: parseFloat(grade),
        feedback: feedback
      };
      const updatedSubmission = await assignmentService.gradeSubmission(selectedSubmission.id, payload);
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub.id === updatedSubmission.id ? updatedSubmission : sub
      ));
      
      closeGradingModal();
    } catch (err) {
      alert('Failed to submit grade. Please try again.');
      console.error(err);
    } finally {
      setSubmittingGrade(false);
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
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/instructor/assignments')}
            className="mr-4 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Grade Submissions
            </h1>
            <p className="mt-1 flex items-center text-sm text-gray-500 font-medium">
              Assignment: <span className="text-indigo-600 ml-1">{assignment?.title}</span>
            </p>
          </div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <p className="text-xs text-indigo-800 font-bold uppercase tracking-wider">Total Submissions</p>
          <p className="text-2xl font-black text-indigo-600">{submissions.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md shadow-sm mb-6">{error}</div>
      )}

      {/* Submissions Table */}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No submissions yet</h3>
          <p className="text-gray-500">Students have not submitted any files for this assignment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted On</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">File</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
                        <span className="text-indigo-700 font-bold">S{sub.userId}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Student #{sub.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.submissionDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={assignmentService.getDownloadUrl(sub.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1 text-indigo-500" />
                      View File
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sub.grade !== null ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                        Graded: {sub.grade}
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Needs Grading
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openGradingModal(sub)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {sub.grade !== null ? 'Update Grade' : 'Grade'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grading Modal Overlay */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-y-auto">
          <div 
            className="absolute inset-0" 
            onClick={closeGradingModal}
          ></div>
          
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 transform transition-all mt-10 md:mt-0">
            <form onSubmit={handleGradeSubmit}>
              <div className="px-6 pt-6 pb-6 border-b border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Grade Submission
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Student ID: <span className="text-indigo-600 font-bold">S{selectedSubmission.userId}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Score / Grade
                    </label>
                    <input
                      type="number"
                      name="grade"
                      id="grade"
                      min="0"
                      step="0.01"
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full shadow-sm text-sm border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 outline-none"
                      placeholder="e.g. 95"
                    />
                  </div>

                  <div>
                    <label htmlFor="feedback" className="flex items-center text-sm font-semibold text-gray-700 mb-1.5">
                      Feedback (Optional)
                    </label>
                    <textarea
                      name="feedback"
                      id="feedback"
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full shadow-sm text-sm border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 outline-none"
                      placeholder="Provide constructive feedback here..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  type="button"
                  onClick={closeGradingModal}
                  className="mt-3 sm:mt-0 w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
                >
                  {submittingGrade ? 'Saving Grade...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssignmentGrading;
