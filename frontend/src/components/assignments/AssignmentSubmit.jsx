import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import { UploadCloud, CheckCircle2, ChevronLeft, AlertCircle, FileText } from 'lucide-react';

const AssignmentSubmit = ({ studentId = 1 }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAssignmentById(assignmentId);
        setAssignment(data);
      } catch (err) {
        setError('Failed to load assignment details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignment();
  }, [assignmentId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => setFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to submit");
      return;
    }

    try {
      setSubmitting(true);
      const response = await assignmentService.submitAssignment(assignmentId, studentId, file);
      setSubmissionResult(response);
    } catch (err) {
      console.error('Submit error:', err);
      // Common issue: backend file upload configs limit file size, user tries to upload large file
      alert(err.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto mt-10 bg-red-50 text-red-600 p-6 rounded-lg shadow-sm flex items-center">
      <AlertCircle className="w-6 h-6 mr-3" />
      <span className="text-lg">{error}</span>
    </div>
  );

  if (!assignment) return <div className="text-center mt-10">Assignment not found</div>;

  // View shown after a successful submission
  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-8 text-center text-white">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-4 text-green-200" />
          <h2 className="text-3xl font-bold mb-2">Assignment Submitted!</h2>
          <p className="text-green-100">Your work has been successfully uploaded.</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex items-center">
            <FileText className="text-gray-500 w-8 h-8 mr-4" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Submitted File</p>
              <p className="text-gray-900 font-semibold">{submissionResult.fileName || file.name}</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/assignments')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition duration-200"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  // File Upload / Assignment Details View
  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/assignments')}
        className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-colors font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to List
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{assignment.title}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Points: {assignment.maxScore || 100}
          </span>
          {assignment.dueDate && (
             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
               Due: {new Date(assignment.dueDate).toLocaleString()}
             </span>
          )}
        </div>
        
        <div className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100 min-h-[100px]">
          {assignment.description ? assignment.description : "No description provided for this assignment."}
        </div>
      </div>

      {/* Submission Form Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Your Work</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="mt-2 text-center">
            {/* Custom File Drop/Upload Zone */}
            {!file ? (
              <div className="flex justify-center border-2 border-dashed border-gray-300 rounded-xl px-6 py-10 hover:bg-green-50 hover:border-green-400 transition-colors">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, ZIP up to 50MB</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                <div className="flex items-center">
                   <FileText className="w-8 h-8 text-green-600 mr-3" />
                   <div className="text-left">
                     <p className="text-sm font-medium text-gray-900">{file.name}</p>
                     <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                   </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !file}
              className={`flex items-center px-8 py-3 rounded-xl font-bold shadow-md transition duration-200 ${
                submitting || !file
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {submitting ? 'Uploading...' : 'Hand In Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmit;
