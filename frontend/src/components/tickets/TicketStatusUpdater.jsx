import React, { useState } from 'react';
import { Settings, Save, Clock, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const TicketStatusUpdater = ({ ticketId, currentStatus, currentNote, currentRejectionReason, onUpdateSuccess }) => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState(currentStatus);
  const [resolutionNote, setResolutionNote] = useState(currentNote || '');
  const [rejectionReason, setRejectionReason] = useState(currentRejectionReason || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const quickUpdate = async (newStatus) => {
    setIsUpdating(true);
    setError('');
    try {
      const response = await api.put(`/tickets/${ticketId}/status`, {
        status: newStatus,
        resolutionNote: newStatus === 'IN_PROGRESS' ? 'STARTED_BY_TECH' : null,
      });
      if (response.status === 200) {
        onUpdateSuccess(response.data);
        setStatus(newStatus);
      }
    } catch (err) {
      setError('Failed to update ticket status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');

    try {
      const response = await api.put(`/tickets/${ticketId}/status`, {
        status: status,
        resolutionNote: status === 'RESOLVED' ? resolutionNote : null,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      });
      if (response.status === 200) {
        onUpdateSuccess(response.data);
      }
    } catch (err) {
      setError('Failed to update ticket status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border text-sm border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-bold text-gray-800">
          {currentUser.role === 'TECHNICIAN' ? 'Technician Controls' : 'Admin Controls'}
        </h3>
      </div>
      
      {error && <div className="text-rose-500 mb-4 bg-rose-50 p-2 rounded-lg text-sm">{error}</div>}

      {/* Quick Action Buttons */}
      <div className="mb-6 space-y-3">
        {((currentStatus === 'OPEN') || (currentStatus === 'IN_PROGRESS' && currentNote !== 'STARTED_BY_TECH')) && currentUser.role === 'TECHNICIAN' && (
          <button
            onClick={() => quickUpdate('IN_PROGRESS')}
            disabled={isUpdating}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all rounded-xl py-4 font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 disabled:opacity-70"
          >
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
               <Clock className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            {currentStatus === 'IN_PROGRESS' ? 'Confirm Start' : 'Start Process'}
          </button>
        )}
        
        {currentStatus === 'OPEN' && currentUser.role === 'ADMIN' && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <p className="text-amber-800 text-xs font-semibold flex items-center gap-2">
               <AlertCircle className="w-4 h-4" /> Unassigned or Awaiting Tech
            </p>
            <p className="text-[10px] text-amber-600 mt-1 uppercase tracking-tight font-bold">Assign a technician to enable the process workflow.</p>
          </div>
        )}
        
        {currentStatus === 'IN_PROGRESS' && currentNote === 'STARTED_BY_TECH' && currentUser.role === 'TECHNICIAN' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setStatus('RESOLVED'); }}
              className="bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition-all rounded-xl py-4 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" /> Resolve
            </button>
            <button
              onClick={() => { setStatus('REJECTED'); }}
              className="bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-[0.98] transition-all rounded-xl py-4 font-bold flex items-center justify-center gap-2 border border-rose-100"
            >
              <AlertTriangle className="w-4 h-4" /> Reject
            </button>
          </div>
        )}

        {currentStatus === 'IN_PROGRESS' && currentUser.role === 'ADMIN' && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
             <p className="text-amber-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Awaiting technician resolution
             </p>
             <p className="text-[10px] text-amber-600 mt-1 uppercase tracking-tight font-bold">Technicians will update the status once the physical work is complete.</p>
          </div>
        )}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="bg-white px-3 text-gray-400">Advanced Controls</span>
        </div>
      </div>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">New Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        
        {status === 'RESOLVED' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Resolution Note <span className="text-gray-400 font-normal">(Required)</span></label>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              rows="3"
              required={status === 'RESOLVED'}
              placeholder="Document actions taken..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            ></textarea>
          </div>
        )}

        {status === 'REJECTED' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rejection Reason <span className="text-gray-400 font-normal">(Required)</span></label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="3"
              required={status === 'REJECTED'}
              placeholder="Provide reason for rejection..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            ></textarea>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all rounded-lg px-4 py-2 font-semibold flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : (
              <>
                <span>Save Changes</span>
                <Save className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketStatusUpdater;
