import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assignmentService from '../../services/assignmentService';
import { UploadCloud, ChevronLeft, FileText, CheckCircle2, Clock, AlertCircle, Plus, Download, LayoutGrid, List, FileText as FileIcon } from 'lucide-react';

const AssignmentSubmit = ({ studentId = 1 }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch assignment details
        const assignmentData = await assignmentService.getAssignmentById(assignmentId);
        setAssignment(assignmentData);

        // Fetch submissions and check if this student has submitted
        const submissions = await assignmentService.getSubmissionsForAssignment(assignmentId);
        const userSub = submissions.find(sub => sub.userId === studentId);
        setSubmission(userSub || null);
        
      } catch (err) {
        setError('Failed to load assignment details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [assignmentId, studentId]);

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
      setSubmission(response); // Update UI to show new submission
      setShowUploadForm(false);
      setFile(null);
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-4xl mx-auto mt-10 bg-red-50 text-red-600 p-6 rounded-lg shadow-sm flex items-center">
      <AlertCircle className="w-6 h-6 mr-3" />
      <span className="text-lg">{error}</span>
    </div>
  );

  if (!assignment) return <div className="text-center mt-10">Assignment not found</div>;

  // Calculate Time Remaining for the visual table
  const now = new Date();
  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
  
  let timeRemainingText = "No Due Date";
  let timeRemainingClass = "text-gray-700";
  
  if (dueDate) {
    const diffMs = dueDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (submission) {
      const subDate = new Date(submission.submissionDate);
      const subDiff = dueDate - subDate;
      const subDiffDays = Math.floor(subDiff / (1000 * 60 * 60 * 24));
      const subDiffHours = Math.floor((subDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (subDiff >= 0) {
        timeRemainingText = `Assignment was submitted ${subDiffDays} days ${subDiffHours} hours early`;
        timeRemainingClass = "bg-green-100 text-green-800";
      } else {
        timeRemainingText = `Assignment was submitted late`;
        timeRemainingClass = "bg-red-100 text-red-800";
      }
    } else {
       if (diffMs < 0) {
         timeRemainingText = `Assignment is overdue by ${Math.abs(diffDays)} days`;
         timeRemainingClass = "bg-red-100 text-red-800";
       } else {
         timeRemainingText = `${diffDays} days remaining`;
       }
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Top Header / Breadcrumb imitation */}
      <button
        onClick={() => navigate('/assignments')}
        className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium text-sm border hover:border-gray-300 rounded px-3 py-1.5"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
          <div className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center shadow-sm mr-4">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{assignment.title}</h1>
        </div>
        
        <div className="mx-2 mb-8 text-sm text-gray-500 space-y-1">
          <p><span className="font-semibold text-gray-700">Opened:</span> Available now</p>
          {assignment.dueDate && (
             <p><span className="font-semibold text-gray-700">Due:</span> {dueDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-gray-700 border border-gray-100 min-h-[80px] mb-8">
          {assignment.description ? assignment.description : "No description provided."}
        </div>

        {/* Action Buttons for Toggling Upload Form */}
        <div className="mb-8">
          {!showUploadForm && (
            <div className="space-x-3">
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded shadow-sm transition-colors"
              >
                {submission ? 'Edit submission' : 'Add submission'}
              </button>
            </div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Submission status</h3>
        
        {/* Status Table structured exactly like the user's request */}
        <div className="border border-gray-200 rounded overflow-hidden text-sm">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-200">
              
              <tr className="bg-white">
                <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 bg-gray-50">Submission status</th>
                <td className={`py-3 px-4 font-medium ${submission ? 'bg-green-100 text-green-800' : ''}`}>
                  {submission ? 'Submitted for grading' : 'No attempt'}
                </td>
              </tr>
              
              <tr className="bg-white">
                <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 bg-gray-50">Grading status</th>
                <td className="py-3 px-4">
                   {submission?.grade !== null && submission?.grade !== undefined ? (
                     <span className="font-bold text-green-700">Graded: {submission.grade}</span>
                   ) : (
                     'Not graded'
                   )}
                </td>
              </tr>
              
              <tr className="bg-white">
                <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 bg-gray-50">Time remaining</th>
                <td className={`py-3 px-4 font-medium ${timeRemainingClass}`}>
                  {timeRemainingText}
                </td>
              </tr>

              <tr className="bg-white">
                <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 bg-gray-50">Last modified</th>
                <td className="py-3 px-4">
                  {submission ? new Date(submission.submissionDate).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-'}
                </td>
              </tr>

              <tr className="bg-white">
                <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 bg-gray-50 align-top">File submissions</th>
                <td className="py-3 px-4">
                  {submission && submission.fileUrl ? (
                    <div className="flex items-center text-indigo-600 hover:text-indigo-800">
                      <FileText className="w-4 h-4 mr-1.5" />
                      <a href={assignmentService.getDownloadUrl(submission.id)} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {submission.fileUrl.split('/').pop() || 'Download Submitted File'}
                      </a>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>

              <tr className="bg-white">
                <th className="py-3 px-4 font-semibold text-gray-700 w-1/3 bg-gray-50 align-top">Submission comments</th>
                <td className="py-3 px-4">
                  {submission?.feedback ? (
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-gray-700 italic">
                      "{submission.feedback}"
                    </div>
                  ) : (
                    <span className="text-gray-400">Comments (0)</span>
                  )}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-down Upload Form Area */}
      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-fade-in-up">
          <div className="flex items-center mb-6">
            <h3 className="text-xl text-gray-500 flex items-center">
              <ChevronLeft className="w-5 h-5 mr-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition" onClick={() => setShowUploadForm(false)} />
              Add submission
            </h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-2 flex justify-between items-end">
              <div className="text-sm font-semibold text-gray-700">File submissions</div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-2">Maximum file size: 10 MB, maximum number of files: 20</span>
                <div className="flex space-x-1">
                  <div className="p-1 bg-gray-200 rounded cursor-pointer">
                    <LayoutGrid className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="p-1 bg-transparent hover:bg-gray-100 rounded cursor-pointer">
                    <List className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded mb-6">
              {/* Pseudo Toolbar */}
              <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center space-x-4">
                <label htmlFor="file-upload" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
                  <Plus className="w-4 h-4 mr-1 text-gray-500" /> Add...
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <div className="flex items-center text-sm font-medium text-gray-400 cursor-not-allowed">
                  <Download className="w-4 h-4 mr-1" /> Download
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="bg-white p-4">
                <label 
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 min-h-[250px] hover:bg-slate-50 transition-colors cursor-pointer w-full relative"
                >
                  {!file ? (
                     <div className="text-center">
                       <UploadCloud className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                       <div className="text-sm text-gray-600 mb-1">
                         <span className="font-medium text-slate-700">You can drag and drop files here to add them.</span>
                         <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                       </div>
                     </div>
                  ) : (
                     <div className="flex items-center justify-center w-full h-full absolute inset-0">
                       <div className="text-center group relative">
                         <div className="w-16 h-20 border-[3px] border-gray-800 rounded mx-auto mb-2 flex items-center justify-center bg-white relative">
                            <span className="absolute top-2 left-2 text-[10px] font-bold">T</span>
                            <div className="w-8 h-0.5 bg-gray-800 absolute top-6"></div>
                            <div className="w-6 h-0.5 bg-gray-800 absolute top-8"></div>
                            <div className="w-8 h-0.5 bg-gray-800 absolute top-10"></div>
                            {/* Folded corner */}
                            <div className="absolute top-[-3px] right-[-3px] border-[6px] border-transparent border-t-white border-r-white bg-gray-800 rounded-bl box-border"></div>
                         </div>
                         <p className="text-sm font-medium text-orange-400 truncate max-w-[150px]">{file.name}</p>
                         
                         {/* Hidden remove button shown on hover */}
                         <button
                           type="button"
                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearFile(); }}
                           className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           title="Remove file"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                       </div>
                     </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                type="submit"
                disabled={submitting || !file}
                className={`py-2 px-4 rounded text-sm font-medium transition-colors ${
                  submitting || !file
                    ? 'bg-amber-300 text-white cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                }`}
              >
                {submitting ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  clearFile();
                }}
                className="bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmit;
