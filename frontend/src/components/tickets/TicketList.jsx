import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, Ticket, AlertTriangle, RefreshCw, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_TABS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];

const StatusBadge = ({ status }) => {
  const map = {
    OPEN:        { label: 'Open',        cls: 'bg-yellow-100 text-yellow-800 border-yellow-200',  icon: AlertCircle },
    IN_PROGRESS: { label: 'In Progress', cls: 'bg-blue-100 text-blue-800 border-blue-200',        icon: Clock },
    RESOLVED:    { label: 'Resolved',    cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
  };
  const cfg = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
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

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load tickets. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filtered = activeFilter === 'ALL' ? tickets : tickets.filter(t => t.status === activeFilter);

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
      <div className="px-6 pt-4 pb-0 flex items-center gap-1 border-b border-gray-100">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 -mb-px
              ${activeFilter === tab
                ? 'border-[#061224] text-[#061224] bg-gray-50'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
            {tab === 'IN_PROGRESS' ? 'In Progress' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            {tab !== 'ALL' && (
              <span className="ml-1.5 bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px]">
                {tickets.filter(t => t.status === tab).length}
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
                    className="group hover:bg-gray-50/80 transition-colors cursor-pointer rounded-xl">
                    <td className="py-4 pr-4 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                      #{ticket.id}
                    </td>
                    <td className="py-4 px-4 max-w-[220px]">
                      <p className="font-semibold text-gray-800 text-sm truncate">{ticket.resourceLocation}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{ticket.description}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">{ticket.category}</td>
                    <td className="py-4 px-4"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="py-4 px-4"><StatusBadge status={ticket.status} /></td>
                    <td className="py-4 pl-4 text-right text-xs text-gray-400 whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
