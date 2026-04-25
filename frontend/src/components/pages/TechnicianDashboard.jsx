import React, { useState, useEffect } from 'react';
import { 
  PenTool, CheckCircle, Clock, List, AlertCircle, 
  MapPin, User, ChevronRight, Zap, Target, Star
} from 'lucide-react';
import TicketList from '../tickets/TicketList';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const TechnicianDashboard = () => {
  const CURRENT_TECHNICIAN_ID = 10;
  const CURRENT_TECHNICIAN_NAME = "John Doe (IT Support)";
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        const myTickets = response.data.filter(t => t.assignedTechnicianId === CURRENT_TECHNICIAN_ID);
        setTickets(myTickets);
      } catch (err) {
        console.error("Failed to load technician data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const pendingTickets = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const focusTicket = [...pendingTickets].sort((a, b) => {
    const priorityMap = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  })[0];
  
  const ratedTickets = tickets.filter(t => t.rating && t.rating > 0);
  const avgRating = ratedTickets.length > 0 
    ? (ratedTickets.reduce((acc, t) => acc + t.rating, 0) / ratedTickets.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Work Queue...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* Header Profile Box */}
      <div className="bg-gradient-to-r from-[#061224] via-[#0d2147] to-[#1a365d] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl -mr-40 -mt-40" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-[10px] font-bold tracking-widest uppercase mb-4 text-blue-300">
               <Zap className="w-3 h-3" /> Field Technician
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Technician Portal</h1>
            <p className="text-blue-200/70 text-lg">Good afternoon, {CURRENT_TECHNICIAN_NAME}. Your queue is prioritized.</p>
          </div>
          <div className="flex gap-4">
             <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group hover:border-blue-400/50 transition-colors">
               <Target className="w-8 h-8 text-blue-300" />
             </div>
             <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group hover:border-emerald-400/50 transition-colors">
               <CheckCircle className="w-8 h-8 text-emerald-300" />
             </div>
             {avgRating && (
               <div className="bg-amber-400/10 backdrop-blur-md rounded-2xl px-5 py-2 border border-amber-400/30 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-amber-400">
                     <Star className="w-5 h-5 fill-amber-400" />
                     <span className="text-2xl font-black">{avgRating}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-tighter text-amber-200/60">Satisfaction</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Current Focus / Top Task Card */}
        <div className="lg:col-span-1 space-y-6">
           <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Focus</h2>
           {focusTicket ? (
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 ${focusTicket.priority === 'CRITICAL' ? 'bg-rose-500/5' : 'bg-blue-500/5'} rounded-full blur-2xl -mr-12 -mt-12`} />
                <div className="relative z-10">
                  <div className={`flex items-center gap-2 font-bold text-[10px] uppercase mb-4 ${focusTicket.priority === 'CRITICAL' ? 'text-rose-600' : 'text-blue-600'}`}>
                      <AlertCircle className="w-3 h-3" /> {focusTicket.priority} Priority
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">{focusTicket.category} Incident</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3">{focusTicket.description}</p>
                  
                  <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <MapPin className="w-4 h-4 text-blue-500" /> {focusTicket.resourceLocation}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <Clock className="w-4 h-4 text-emerald-500" /> Reported {new Date(focusTicket.createdAt).toLocaleDateString()}
                      </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/tickets/${focusTicket.id}`)}
                    className="w-full py-4 bg-[#061224] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
                  >
                      Start Working <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
           ) : (
              <div className="bg-white rounded-[2rem] p-12 border border-dashed border-gray-200 text-center">
                 <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto mb-4" />
                 <p className="text-gray-400 font-bold text-sm">All clear! No pending tasks.</p>
              </div>
           )}
           
           {/* Secondary Stats */}
           <div className="bg-[#122b52] rounded-[2rem] p-8 text-white">
              <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4">Availability</p>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-bold">Shift Progress</span>
                 <span className="text-xs font-bold">{tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-6">
                 <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${tickets.length > 0 ? (resolvedCount / tickets.length) * 100 : 0}%` }} />
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all">
                 Request Break
              </button>
           </div>
        </div>

        {/* The Full Worklist */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between ml-1">
             <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Maintenance Queue</h2>
             <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group">
                Filters <List className="w-3 h-3 group-hover:rotate-180 transition-transform" />
             </button>
           </div>
           
           <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] overflow-hidden">
              <TicketList filterTechnicianId={CURRENT_TECHNICIAN_ID} />
           </div>
        </div>

      </div>

    </div>
  );
};

export default TechnicianDashboard;
