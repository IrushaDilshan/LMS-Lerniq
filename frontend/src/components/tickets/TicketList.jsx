import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, Ticket, AlertTriangle, RefreshCw, ChevronRight, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const STATUS_TABS = [
  { key: 'ALL',         label: 'All' },
  { key: 'OPEN',        label: 'Open' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED',    label: 'Resolved' },
  { key: 'CLOSED',      label: 'Closed' },
  { key: 'REJECTED',    label: 'Rejected' },
];

const StatusBadge = ({ ticket }) => {
  const status = ticket.status;
  const map = {
    OPEN:        { label: 'Open',        cls: 'bg-amber-100 text-amber-800 border-amber-200 font-black', icon: AlertCircle, pulse: true },
    IN_PROGRESS: { label: ticket.resolutionNote === 'STARTED_BY_TECH' ? 'Technician Working' : 'Process Started', cls: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
    RESOLVED:    { label: 'Resolved',    cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    CLOSED:      { label: 'Closed',      cls: 'bg-gray-100 text-gray-600 border-gray-200',          icon: CheckCircle },
    REJECTED:    { label: 'Rejected',    cls: 'bg-rose-100 text-rose-700 border-rose-200',          icon: AlertCircle },
  };
  const cfg = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls} relative overflow-hidden`}>
      {cfg.pulse && <span className="absolute inset-0 bg-amber-400/20 animate-pulse" />}
      <Icon className={`w-3 h-3 relative z-10 ${cfg.pulse ? 'animate-bounce-subtle' : ''}`} /> 
      <span className="relative z-10">{cfg.label}</span>
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const map = {
    LOW:      { label: 'Low',      cls: 'text-green-700 bg-green-50',  dot: 'bg-green-400' },
    MEDIUM:   { label: 'Medium',   cls: 'text-yellow-700 bg-yellow-50', dot: 'bg-yellow-400' },
    HIGH:     { label: 'High',     cls: 'text-orange-700 bg-orange-50', dot: 'bg-orange-400' },
    CRITICAL: { label: 'Critical', cls: 'text-rose-700 bg-rose-50',    dot: 'bg-rose-500' },
  };
  const cfg = map[priority] || { label: priority, cls: 'text-gray-600 bg-gray-50', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const TicketList = ({ filterTechnicianId, highlightTicketId }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);       // currently displayed (filtered)
  const [allTickets, setAllTickets] = useState([]); // full list for tab counts
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const newTicketIdFromState = location.state?.newTicketId;
  const effectiveNewTicketId = highlightTicketId || newTicketIdFromState;

  const isTrulyNew = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 24; 
  };

  // Fetch full list once for tab counts, then fetch filtered list
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
    } catch (_) { /* non-critical */ }
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
      setError('Failed to load tickets. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    fetchTickets(false, filterKey);
  };

  const filtered = tickets; // already filtered by backend

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading tickets…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 text-rose-700 p-5 rounded-2xl flex items-start gap-3 border border-rose-100">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">{error}</p>
          <button onClick={() => fetchTickets()} className="text-sm underline mt-1 hover:no-underline">Try again</button>
        </div>
      </div>
    );
  }

  const calculateTimer = (createdAt, updatedAt, status) => {
    const start = new Date(createdAt);
    let end = new Date();
    if (status === 'RESOLVED' || status === 'CLOSED' || status === 'REJECTED') {
      end = new Date(updatedAt || createdAt);
    }
    
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (status === 'RESOLVED' || status === 'CLOSED' || status === 'REJECTED') {
      if (diffDays > 0) return `Ended in ${diffDays}d`;
      if (diffHours > 0) return `Ended in ${diffHours}h`;
      return 'Ended in <1h';
    } else {
      if (diffDays > 0) return `Open for ${diffDays}d`;
      if (diffHours > 0) return `Open for ${diffHours}h`;
      return 'Just opened';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#061224] rounded-xl flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#061224]">Recent Tickets</h2>
            <p className="text-xs text-gray-400">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>
        <button onClick={() => fetchTickets(true)}
          className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#061224] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 ${isRefreshing ? 'opacity-60 pointer-events-none' : ''}`}>
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 pt-4 pb-0 flex items-center gap-1 flex-wrap border-b border-gray-100">
        {STATUS_TABS.map(tab => (
          <button key={tab.key} onClick={() => handleFilterChange(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 -mb-px
              ${activeFilter === tab.key
                ? 'border-[#061224] text-[#061224] bg-gray-50'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
            {tab.label}
            {tab.key !== 'ALL' && (
              <span className="ml-1.5 bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px]">
                {allTickets.filter(t => t.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table / Empty State */}
      <div className="p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-bold text-gray-600">No tickets found</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeFilter === 'ALL' ? "You haven't reported any incidents yet." : `No ${activeFilter.replace('_', ' ').toLowerCase()} tickets.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 px-4">Location / Description</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Priority</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Date</th>
                  <th className="pb-3 pl-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((ticket) => (
                  <tr key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className={`group hover:bg-gray-50/80 transition-all cursor-pointer rounded-xl relative border-l-4 ${
                      ticket.id === effectiveNewTicketId ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                      (ticket.status === 'OPEN' && isTrulyNew(ticket.createdAt)) ? 'border-amber-400 bg-amber-50/20 shadow-[inset_1px_0_0_rgba(251,191,36,0.3)]' : 
                      ticket.status === 'OPEN' ? 'border-amber-200 bg-amber-50/5' :
                      ticket.status === 'IN_PROGRESS' ? 'border-blue-400' :
                      'border-transparent'
                    }`}>
                    <td className="py-5 pr-4 pl-4 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>#{ticket.id}</span>
                        {ticket.id === effectiveNewTicketId && (
                           <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-widest font-black animate-bounce shadow-md">JUST SUBMITTED</span>
                        )}
                        {ticket.status === 'OPEN' && isTrulyNew(ticket.createdAt) && ticket.id !== effectiveNewTicketId && (
                          <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-tighter animate-pulse shadow-sm font-black">NEW</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4 max-w-[220px]">
                      <p className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{ticket.resourceLocation}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{ticket.description}</p>
                    </td>
                    <td className="py-5 px-4 text-sm text-gray-600 whitespace-nowrap font-medium">{ticket.category}</td>
                    <td className="py-5 px-4"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="py-5 px-4"><StatusBadge ticket={ticket} /></td>
                    <td className="py-5 pl-4 text-right whitespace-nowrap pr-2">
                      <div className="text-xs text-gray-800 font-bold">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className={`text-[11px] mt-0.5 font-medium ${ticket.status === 'OPEN' ? 'text-amber-600' : 'text-gray-400'}`}>
                        {calculateTimer(ticket.createdAt, ticket.updatedAt, ticket.status)}
                      </div>
                    </td>
                    <td className="py-4 pl-2 pr-1">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
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
