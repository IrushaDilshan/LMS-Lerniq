import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const TicketEditModal = ({ ticket, isOpen, onClose, onUpdateSuccess }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    resourceLocation: ticket.resourceLocation,
    category: ticket.category,
    description: ticket.description,
    priority: ticket.priority,
    contactEmail: ticket.contactEmail || '',
    contactPhone: ticket.contactPhone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(formData.contactEmail)) {
      errors.contactEmail = 'Invalid email format.';
    }
    if (!phoneRegex.test(formData.contactPhone)) {
      errors.contactPhone = 'Phone number must be 10 digits.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }
    setFieldErrors({});

    try {
      const response = await api.put(`/tickets/${ticket.id}?requestingUserId=${currentUser.id}`, formData);
      onUpdateSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061224]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 scale-in-center">
        {/* Header */}
        <div className="bg-[#061224] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Save className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Edit Ticket #{ticket.id}</h2>
              <p className="text-blue-300/60 text-[10px] font-bold uppercase tracking-widest">Update incident details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-start gap-3 border border-rose-100 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Resource / Location</label>
            <input 
              type="text" 
              name="resourceLocation" 
              value={formData.resourceLocation} 
              onChange={handleInputChange}
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium bg-white"
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Facility">Facility</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contact Email</label>
              <input 
                type="email" 
                name="contactEmail" 
                value={formData.contactEmail} 
                onChange={handleInputChange}
                required
                className={`w-full bg-gray-50 border ${fieldErrors.contactEmail ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-100'} rounded-2xl px-5 py-3.5 text-sm focus:ring-4 outline-none transition-all font-medium`}
              />
              {fieldErrors.contactEmail && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.contactEmail}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <input 
                type="tel" 
                name="contactPhone" 
                value={formData.contactPhone} 
                onChange={handleInputChange}
                required
                className={`w-full bg-gray-50 border ${fieldErrors.contactPhone ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-100'} rounded-2xl px-5 py-3.5 text-sm focus:ring-4 outline-none transition-all font-medium`}
              />
              {fieldErrors.contactPhone && <p className="text-[10px] text-rose-500 font-bold ml-1">{fieldErrors.contactPhone}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all border border-transparent"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] bg-[#061224] text-white hover:bg-[#0d2147] px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-900/10 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Changes...' : 'Confirm Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketEditModal;
