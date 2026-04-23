import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Send, AlertCircle, CheckCircle, Ticket } from 'lucide-react';
import api from '../../api/axios';

const TicketSubmissionForm = () => {
  const [formData, setFormData] = useState({
    resourceLocation: '',
    category: '',
    description: '',
    priority: 'LOW',
    preferredContactDetails: '',
    createdByEmail: '',
  });
  
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > 3) {
      setErrorMessage('You can only upload a maximum of 3 images.');
      return;
    }
    
    setErrorMessage('');
    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 3));
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const payload = new FormData();
      
      // The backend expects the TicketCreateRequest as a JSON blob
      const ticketBlob = new Blob([JSON.stringify({
        resourceLocation: formData.resourceLocation || 'Unknown',
        category: formData.category,
        description: formData.description,
        priority: formData.priority,
        preferredContactDetails: formData.preferredContactDetails || 'N/A',
        createdByEmail: formData.createdByEmail,
        createdByUserId: 1 // Stubbed User ID for now
      })], { type: 'application/json' });
      
      payload.append('ticket', ticketBlob);
      
      // Append files
      files.forEach((file) => {
        payload.append('files', file);
      });

      const response = await api.post('/tickets', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          resourceLocation: '',
          category: '',
          description: '',
          priority: 'LOW',
          preferredContactDetails: '',
          createdByEmail: '',
        });
        setFiles([]);
        
        // Wait 2 seconds then navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard', { state: { newTicketId: response.data.id, justSubmitted: true } });
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || error.response?.data || 'Failed to submit the ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl justify-center mx-auto mt-6 bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-gray-100">
      
      {/* Header section with gradient */}
      <div className="bg-gradient-to-r from-[#061224] to-[#1a365d] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-orange-500 rounded-full opacity-10 blur-xl"></div>
        
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <Ticket className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Report an Incident</h2>
            <p className="text-blue-200 text-sm mt-1">Submit a maintenance request for campus facilities or equipment.</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {submitStatus === 'success' && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-start space-x-3 border border-emerald-100 animate-fade-in">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-emerald-800">Ticket Submitted Successfully!</h4>
              <p className="text-sm mt-1">The maintenance team has been notified and will review your request shortly.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-start space-x-3 border border-rose-100 animate-fade-in">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-rose-800">Submission Failed</h4>
              <p className="text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="" disabled>Select an issue category</option>
              <option value="Hardware">Hardware / Equipment</option>
              <option value="Software">Software / Network</option>
              <option value="Facility">Facility / Room Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Priority Level</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            >
              <option value="LOW">Low - Not urgent</option>
              <option value="MEDIUM">Medium - Needs attention soon</option>
              <option value="HIGH">High - Affecting active work</option>
              <option value="CRITICAL">Critical - Complete halt</option>
            </select>
          </div>
          
          {/* Email Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              name="createdByEmail"
              value={formData.createdByEmail}
              onChange={handleInputChange}
              placeholder="Enter your email to receive updates"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          {/* Resource Location */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Resource or Location</label>
            <input
              type="text"
              name="resourceLocation"
              value={formData.resourceLocation}
              onChange={handleInputChange}
              placeholder="e.g. Hall A, Projector in Lab B"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          {/* Contact Details */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Preferred Contact Details</label>
            <input
              type="text"
              name="preferredContactDetails"
              value={formData.preferredContactDetails}
              onChange={handleInputChange}
              placeholder="e.g. your_email@student.sliit.lk or Phone Number"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Detailed Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Please describe the issue in detail..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* File Upload Zone */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Evidence Images <span className="text-gray-400 font-normal">(Max 3)</span>
          </label>
          
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-400 transition-colors bg-gray-50/50 group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={files.length >= 3}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
            </div>
          </div>

          {/* Attached Files Preview Grid */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative group bg-white border border-gray-200 rounded-xl p-3 flex items-center space-x-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-white text-rose-500 hover:bg-rose-50 rounded-full shadow-sm p-1 border border-rose-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#061224] text-white hover:bg-[#1a365d] active:scale-[0.99] transition-all rounded-xl py-4 font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Submitting...
            </span>
          ) : (
            <>
              <span>Submit Ticket</span>
              <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TicketSubmissionForm;
