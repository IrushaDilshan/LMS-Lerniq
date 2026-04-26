import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Clock, CheckCircle, Ticket, AlertTriangle, 
  RefreshCw, ChevronRight, Filter, Star, Search, 
  MoreVertical, MoreHorizontal, LayoutList, Grid, ArrowUpDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const STATUS_TABS = [
  { key: 'ALL',         label: 'All Missions' },
  { key: 'OPEN',        label: 'Unassigned' },
  { key: 'IN_PROGRESS', label: 'Active' },
  { key: 'RESOLVED',    label: 'Completed' },
  { key: 'CLOSED',      label: 'Archived' },
  { key: 'REJECTED',    label: 'Canceled' },
];

const StatusBadge = ({ ticket }) => {
  const status = ticket.status;
  const map = {
    OPEN:        { label: 'OPEN',        cls: 'bg-amber-500/10 text-amber-600 border-amber-200/50', icon: AlertCircle, dot: 'bg-amber-500' },
    IN_PROGRESS: { label: 'ACTIVE',      cls: 'bg-blue-500/10 text-blue-600 border-blue-200/50', icon: Clock, dot: 'bg-blue-500' },
    RESOLVED:    { label: 'RESOLVED',    cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50', icon: CheckCircle, dot: 'bg-emerald-500' },
    CLOSED:      { label: 'CLOSED',      cls: 'bg-slate-500/10 text-slate-600 border-slate-200/50', icon: CheckCircle, dot: 'bg-slate-500' },
    REJECTED:    { label: 'REJECTED',    cls: 'bg-rose-500/10 text-rose-600 border-rose-200/50', icon: AlertCircle, dot: 'bg-rose-500' },
  };
  const cfg = map[status] || { label: status, cls: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' };
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border transition-all ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'OPEN' || status === 'IN_PROGRESS' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const map = {
    LOW:      { label: 'LOW',      cls: 'text-gray-500 bg-gray-50',  dot: 'bg-gray-400' },
    MEDIUM:   { label: 'MEDIUM',   cls: 'text-blue-500 bg-blue-50', dot: 'bg-blue-400' },
    HIGH:     { label: 'HIGH',     cls: 'text-orange-500 bg-orange-50', dot: 'bg-orange-400' },
    CRITICAL: { label: 'CRITICAL', cls: 'text-rose-600 bg-rose-50',    dot: 'bg-rose-500' },
  };
  const cfg = map[priority] || { label: priority, cls: 'text-gray-500 bg-gray-50', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black tracking-tighter ${cfg.cls} border border-transparent`}>
       {cfg.label}
    </span>
  );
};

const TicketList = ({ filterTechnicianId, highlightTicketId }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const navigate = useNavigate();
  const location = useLocation();
  const effectiveNewTicketId = highlightTicketId || location.state?.newTicketId;

  useEffect(() => {
    fetchAllForCounts();
    fetchTickets(false, 'ALL');
  }, [currentUser.role, currentUser.id]);

  const fetchAllForCounts = async () => {
    try {
      const isUser = currentUser.role === 'USER';
      const params = isUser ? { userId: currentUser.id } : {};
      const res = await api.get('/tickets', { params });
      const filtered = filterTechnicianId 
        ? res.data.filter(t => t.assignedTechnicianId === filterTechnicianId) 
        : res.data;
      setAllTickets(filtered);
    } catch (_) {}
  };

  const fetchTickets = async (silent = false, filter = activeFilter) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const isUser = currentUser.role === 'USER';
      const params = isUser ? { userId: currentUser.id } : {};
      if (filter !== 'ALL') params.status = filter;
      
      const res = await api.get('/tickets', { params });
      const sorted = (filterTechnicianId 
        ? res.data.filter(t => t.assignedTechnicianId === filterTechnicianId) 
        : res.data).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
      setTickets(sorted);
      setError('');
    } catch (err) {
      setError('System communication error. Check uplink.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-[3px] border-blue-500/10 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">Synchronizing Logs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white group/list">
      {/* List Header Toolbar */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between gap-6 flex-wrap bg-gray-50/30">
        <div className="flex items-center gap-5">
           <div className="flex items-center gap-2">
             {STATUS_TABS.map(tab => (
               <button 
                 key={tab.key} 
                 onClick={() => { setActiveFilter(tab.key); fetchTickets(false, tab.key); }}
                 className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border
                   ${activeFilter === tab.key
                     ? 'bg-[#061224] border-[#061224] text-white shadow-lg shadow-blue-900/10'
                     : 'bg-white border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'}`}
               >
                 {tab.label}
                 <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {tab.key === 'ALL' ? allTickets.length : allTickets.filter(t => t.status === tab.key).length}
                 </span>
               </button>
             ))}
           </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <LayoutList className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Grid className="w-4 h-4" />
                </button>
            </div>
            <button 
              onClick={() => fetchTickets(true)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {tickets.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-gray-200">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-black text-gray-900 tracking-tight">No Matching Records</p>
            <p className="text-sm text-gray-400 font-medium mt-1">Adjust filters or standby for new reports.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3 mt-[-12px]">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <th className="pb-4 pl-6">Mission ID</th>
                  <th className="pb-4 px-4">Location / Intel</th>
                  <th className="pb-4 px-4">Category</th>
                  <th className="pb-4 px-4">Priority</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4">Response Time</th>
                  <th className="pb-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className={`group hover:bg-[#061224] transition-all cursor-pointer rounded-[1.5rem] relative
                      ${ticket.id === effectiveNewTicketId ? 'bg-blue-50/50 ring-2 ring-blue-500 ring-offset-2' : 'bg-white border border-gray-100 shadow-sm'}`}
                  >
                    <td className="py-6 pl-6 rounded-l-[1.5rem] border-y border-l border-transparent group-hover:border-[#061224]">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-black text-gray-400 group-hover:text-blue-400 transition-colors">#{ticket.id}</span>
                        {ticket.id === effectiveNewTicketId && (
                           <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black animate-pulse">NEW</span>
                        )}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="max-w-[280px]">
                        <p className="font-black text-gray-900 text-sm group-hover:text-white transition-colors">{ticket.resourceLocation}</p>
                        <p className="text-xs text-gray-500 font-medium truncate mt-1 group-hover:text-gray-400 transition-colors">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                        <span className="text-xs font-extrabold text-gray-600 group-hover:text-blue-100 transition-colors">{ticket.category}</span>
                    </td>
                    <td className="py-6 px-4">
                        <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="py-6 px-4">
                        <StatusBadge ticket={ticket} />
                    </td>
                    <td className="py-6 px-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 group-hover:text-white">
                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-300/60 mt-0.5">
                                {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </td>
                    <td className="py-6 pr-6 text-right rounded-r-[1.5rem] border-y border-r border-transparent group-hover:border-[#061224]">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white/10 transition-all">
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </div>
                      </div>
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

