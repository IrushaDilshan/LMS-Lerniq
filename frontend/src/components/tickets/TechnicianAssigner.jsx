import React, { useState } from 'react';
import { UserCheck, Save } from 'lucide-react';
import api from '../../api/axios';

const TechnicianAssigner = ({ ticketId, currentTechnicianId, onUpdateSuccess }) => {
  const [technicianId, setTechnicianId] = useState(currentTechnicianId || '');
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // In a real app, you would fetch the list of available technicians from the backend.
  // For this assignment, we use a hardcoded list of dummy technicians for presentation.
  const dummyTechnicians = [
    { id: 10, name: 'John Doe (IT Support)' },
    { id: 11, name: 'Jane Smith (Electrician)' },
    { id: 12, name: 'Bob Wilson (Plumber)' },
    { id: 13, name: 'Alice Brown (Facilities)' }
  ];

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!technicianId) return;
    
    setIsAssigning(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.put(`/tickets/${ticketId}/assign`, {
        technicianId: parseInt(technicianId)
      });
      if (response.status === 200) {
        setSuccess(true);
        // Automatically hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
        onUpdateSuccess(response.data);
      }
    } catch (err) {
      setError('Failed to assign technician. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="bg-white border text-sm border-gray-200 rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserCheck className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-bold text-gray-800">Assign Technician</h3>
      </div>
      
      {error && <div className="text-rose-500 mb-4 bg-rose-50 p-2 rounded-lg text-sm">{error}</div>}
      {success && <div className="text-emerald-600 mb-4 bg-emerald-50 p-2 rounded-lg text-sm font-semibold flex items-center"><UserCheck className="w-4 h-4 mr-1.5"/> Assigned successfully!</div>}
      
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Technician</label>
          <select
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            required
          >
            <option value="" disabled>-- Select a technician --</option>
            {dummyTechnicians.map(tech => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAssigning || !technicianId || parseInt(technicianId) === currentTechnicianId}
            className="bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all rounded-lg px-4 py-2 font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAssigning ? 'Assigning...' : (
              <>
                <span>Assign</span>
                <Save className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechnicianAssigner;
