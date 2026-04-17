import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Calendar, AlertCircle, Clock, CheckCircle, Image as ImageIcon, UserCheck, Edit3, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import TicketStatusUpdater from './TicketStatusUpdater';
import CommentSection from './CommentSection';
import TechnicianAssigner from './TechnicianAssigner';
import TicketEditModal from './TicketEditModal';
import { useAuth } from '../../context/AuthContext';

const TicketDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fallback dev base URL for images since they may be served from backend static folder
  const IMAGE_BASE_URL = 'http://localhost:8088'; 

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (err) {
      setError('Failed to load ticket details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (updatedTicket) => {
    setTicket(updatedTicket);
  };

  const handleUpdate = (updatedTicket) => {
    setTicket(updatedTicket);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/tickets/${id}?requestingUserId=${currentUser.id}`);
      navigate('/tickets', { state: { message: 'Ticket deleted successfully.' } });
    } catch (err) {
      alert('Failed to delete ticket.');
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Open</span>;
      case 'IN_PROGRESS':
        return (
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin-slow"/> 
            {ticket.resolutionNote === 'STARTED_BY_TECH' ? 'Technician Working' : 'Process Started'}
          </span>
        );
      case 'RESOLVED':
        return <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Resolved</span>;
      case 'CLOSED':
        return <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Closed</span>;
      case 'REJECTED':
        return <span className="px-3 py-1.5 bg-rose-100 text-rose-800 rounded-lg text-sm font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Rejected</span>;
      default:
        return <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-bold">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center bg-rose-50 p-8 rounded-2xl border border-rose-100">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-rose-800 mb-2">Error</h2>
        <p className="text-rose-600 mb-6">{error || 'Ticket not found.'}</p>
        <Link to="/tickets" className="text-blue-600 hover:underline inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center space-x-4 mb-2">
        <Link to="/tickets" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition border border-gray-100 text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-extrabold text-[#061224]">Ticket #{ticket.id}</h1>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          {/* ONLY the author (Student User) can edit or delete their own tickets while they are still OPEN */}
          {currentUser.id === ticket.createdByUserId && ticket.status === 'OPEN' && (
            <>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-blue-500" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
          {getStatusBadge(ticket.status)}
        </div>
      </div>

      {/* Edit Modal */}
      <TicketEditModal 
        ticket={ticket} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdateSuccess={handleUpdate} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Ticket Info Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 grid md:grid-cols-4 gap-4 bg-gray-50/50">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Location</p>
                  <p className="font-semibold text-gray-800">{ticket.resourceLocation}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Category</p>
                  <p className="font-semibold text-gray-800">{ticket.category}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Created On</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {ticket.assignedTechnicianId && (
                <div className="flex items-start space-x-2">
                  <UserCheck className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-blue-500 uppercase">Assigned Tech</p>
                    <p className="font-semibold text-gray-800">ID #{ticket.assignedTechnicianId}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>
            
            {ticket.status === 'RESOLVED' && ticket.resolutionNote && (
              <div className="p-6 bg-emerald-50 border-t border-emerald-100">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Resolution Details
                </h3>
                <p className="text-emerald-700 font-medium">{ticket.resolutionNote}</p>
              </div>
            )}

            {ticket.status === 'REJECTED' && ticket.rejectionReason && (
              <div className="p-6 bg-rose-50 border-t border-rose-100">
                <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wide mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1.5" /> Rejection Reason
                </h3>
                <p className="text-rose-700 font-medium">{ticket.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-bold text-gray-800">Evidence Images</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {ticket.attachmentUrls.map((url, index) => {
                  // Extract just the filename in case the DB has old absolute paths
                  const filename = url.split(/[\\/]/).pop();
                  const imageUrl = `${IMAGE_BASE_URL}/uploads/${filename}`;
                  return (
                    <a href={imageUrl} target="_blank" rel="noopener noreferrer" key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex flex-col group relative cursor-pointer outline-none">
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-white text-sm font-medium">View Full</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-white">
                        <img src={imageUrl} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.parentElement.innerHTML = '<div class="text-gray-400 text-xs text-center p-2">Image Not Found</div>'; }} />
                      </div>
                      <div className="bg-white px-3 py-2 text-xs truncate border-t border-gray-200 text-gray-500 relative z-10">
                        {filename}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Comments Section integrated below Main Content */}
          <CommentSection ticketId={ticket.id} />
        </div>

        {/* Sidebar Controls */}
        <div className="xl:col-span-1">
          
          {['ADMIN', 'TECHNICIAN'].includes(currentUser.role) && (
            <TicketStatusUpdater 
              ticketId={ticket.id} 
              currentStatus={ticket.status} 
              currentNote={ticket.resolutionNote}
              currentRejectionReason={ticket.rejectionReason}
              onUpdateSuccess={(updatedConfig) => setTicket({...ticket, ...updatedConfig})} 
            />
          )}

          {currentUser.role === 'ADMIN' && (
            <TechnicianAssigner
              ticketId={ticket.id}
              currentTechnicianId={ticket.assignedTechnicianId}
              onUpdateSuccess={(updatedConfig) => setTicket({...ticket, ...updatedConfig})}
            />
          )}
          
          <div className="bg-[#061224] text-white rounded-xl p-6 shadow-sm border border-gray-800">
             <h3 className="font-bold text-lg mb-4 text-[#C4E6F1]">Reporter Info</h3>
             <div className="space-y-4 text-sm">
               <div>
                 <p className="text-gray-400 font-medium">Reporter ID</p>
                 <p className="font-bold">USER-{ticket.createdByUserId}</p>
               </div>
               <div>
                 <p className="text-gray-400 font-medium">Preferred Contact</p>
                 <p className="font-bold">{ticket.preferredContactDetails}</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailView;
