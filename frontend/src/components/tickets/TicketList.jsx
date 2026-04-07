import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, Ticket, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tickets');
      setTickets(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load tickets. Please try again later.');
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Open</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3"/> In Progress</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolved</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'text-green-600 bg-green-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'CRITICAL':
        return 'text-rose-600 bg-rose-50 border-rose-200 border';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start space-x-3 border border-red-100">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-gray-100 overflow-hidden">
      <div className="bg-[#061224] p-6 text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Ticket className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold">Recent Tickets</h2>
        </div>
        <button onClick={fetchTickets} className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
          Refresh
        </button>
      </div>
      
      <div className="p-6">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-600">No tickets found</p>
            <p className="text-sm">You haven't reported any incidents yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-500 text-sm">
                  <th className="pb-3 pr-4 font-semibold">ID</th>
                  <th className="pb-3 px-4 font-semibold">Resource / Location</th>
                  <th className="pb-3 px-4 font-semibold">Category</th>
                  <th className="pb-3 px-4 font-semibold">Priority</th>
                  <th className="pb-3 px-4 font-semibold">Status</th>
                  <th className="pb-3 pl-4 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 pr-4 text-sm font-medium text-gray-900 group-hover:text-blue-600">#{ticket.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-800">{ticket.resourceLocation}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{ticket.category}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(ticket.status)}</td>
                    <td className="py-4 pl-4 text-right text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
