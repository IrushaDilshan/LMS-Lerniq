import React, { useState, useEffect } from 'react';
import { 
  PenTool, CheckCircle, Clock, List, AlertCircle, 
  MapPin, User, ChevronRight, Zap, Target, Star,
  TrendingUp, Activity, Shield, Bell, Search, Filter,
  CheckCircle2, AlertTriangle, LayoutDashboard, Settings, LogOut,
  Map as MapIcon, Calendar, Gauge
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
  const [activeTab, setActiveTab] = useState('overview');

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
  const resolvedToday = tickets.filter(t => (t.status === 'RESOLVED' || t.status === 'CLOSED') && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length;
  
  const focusTicket = [...pendingTickets].sort((a, b) => {
    const priorityMap = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  })[0];
  
  const ratedTickets = tickets.filter(t => t.rating && t.rating > 0);
  const avgRating = ratedTickets.length > 0 
    ? (ratedTickets.reduce((acc, t) => acc + t.rating, 0) / ratedTickets.length).toFixed(1)
    : "4.8"; // Default mock if no ratings

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
        </div>
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white/40 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Operational Command</h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Online • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {['Overview', 'Queue', 'Map View', 'Analytics'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                        activeTab === tab.toLowerCase() 
                        ? 'bg-[#061224] text-white shadow-xl shadow-blue-900/10' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="flex items-center gap-3">
            <button className="p-3 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors shadow-sm relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-[1px] bg-gray-200 mx-1 hidden md:block" />
            <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Technician</p>
                    <p className="text-sm font-bold text-gray-900 leading-none">{CURRENT_TECHNICIAN_NAME.split(' ')[0]}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md">
                    JD
                </div>
            </div>
        </div>
      </div>

      {/* Hero Performance Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#061224] via-[#0a1e3d] to-[#122b52] rounded-[3rem] overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full min-h-[280px]">
                <div className="space-y-4 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-[10px] font-bold tracking-[0.2em] uppercase text-blue-300">
                        <Activity className="w-3 h-3" /> Field Efficiency
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Precision <span className="text-blue-400">Response</span> <br /> 
                        <span className="text-3xl md:text-4xl opacity-80">Technician Portal</span>
                    </h1>
                    <p className="text-blue-200/60 font-medium leading-relaxed">
                        Priority queue active. You have {pendingTickets.length} pending tasks assigned for today. 
                        Target resolution time is under 45 minutes.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 flex flex-col items-center justify-center min-w-[140px] group-hover:scale-105 transition-transform duration-500">
                        <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                            <Star className="w-6 h-6 fill-amber-400" />
                            <span className="text-3xl font-black text-white">{avgRating}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/60">Satisfaction</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 flex flex-col items-center justify-center min-w-[140px] group-hover:scale-105 transition-transform duration-500 delay-75">
                        <div className="flex items-center gap-1.5 text-blue-400 mb-2">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-3xl font-black text-white">{resolvedToday}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/60">Today's Goal</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#122b52] rounded-[3rem] p-8 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-400/20 transition-all duration-700" />
            
            <div className="relative z-10">
                <p className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Gauge className="w-3 h-3" /> Shift Status
                </p>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-blue-100">Workload Completion</span>
                            <span className="text-lg font-black text-white">{tickets.length > 0 ? Math.round((resolvedCount / tickets.length) * 100) : 0}%</span>
                        </div>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(96,165,250,0.5)]" 
                                style={{ width: `${tickets.length > 0 ? (resolvedCount / tickets.length) * 100 : 0}%` }} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-[9px] font-black text-blue-300 uppercase mb-1">Active</p>
                            <p className="text-xl font-black text-white">{pendingTickets.length}</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-[9px] font-black text-blue-300 uppercase mb-1">Resolved</p>
                            <p className="text-xl font-black text-white">{resolvedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <button className="relative z-10 w-full mt-6 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95">
                Go Off-Duty
            </button>
        </div>
      </div>

      {/* Main Operational Area */}
      <div className="space-y-10">
        
        {/* Row 1: Priority Mission & Map View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 pl-1">
                    <Target className="w-3 h-3" /> Priority Mission
                </h3>
                {focusTicket ? (
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 h-[400px] flex flex-col justify-between">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${focusTicket.priority === 'CRITICAL' ? 'bg-rose-500/5' : 'bg-blue-500/5'} rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150`} />
                        
                        <div className="relative z-10">
                            <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mb-6 ${focusTicket.priority === 'CRITICAL' ? 'text-rose-600' : 'text-blue-600'}`}>
                                <span className={`w-2 h-2 rounded-full ${focusTicket.priority === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
                                {focusTicket.priority} Priority
                            </div>
                            
                            <h4 className="text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                                {focusTicket.category} Incident
                            </h4>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                {focusTicket.description}
                            </p>
                            
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-blue-50/50 transition-colors mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-extrabold text-gray-900">{focusTicket.resourceLocation}</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate(`/tickets/${focusTicket.id}`)}
                            className="relative z-10 w-full py-5 bg-[#061224] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all hover:bg-blue-600"
                        >
                            Dispatch Now <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-12 border border-dashed border-gray-300 text-center flex flex-col items-center justify-center gap-4 shadow-sm h-[400px]">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-gray-900 font-black text-lg">Clear Horizon</p>
                            <p className="text-gray-500 text-sm font-medium">All tasks resolved.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-2">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 pl-1">
                    <MapIcon className="w-3 h-3" /> Live Operations Map
                </h3>
                <div className="relative group overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/10 h-[400px]">
                    <div className="absolute top-0 left-0 w-full h-full bg-[#f8fafc] z-0">
                        <svg className="w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="none">
                            <path d="M0,50 Q100,20 200,80 T400,30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                            <path d="M0,150 Q150,180 300,120 T400,200" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                            <path d="M50,0 Q20,100 80,200 T30,300" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                            <path d="M250,0 Q280,150 220,300" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                            <circle cx="120" cy="80" r="4" fill="#3b82f6" className="animate-pulse" />
                            <circle cx="280" cy="150" r="4" fill="#ef4444" className="animate-pulse" />
                            <circle cx="200" cy="220" r="4" fill="#10b981" className="animate-pulse" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                    </div>
                    
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                                System Telemetry
                            </h3>
                            <div className="flex -space-x-2">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-lg group-hover:translate-y-[-10px] transition-transform duration-500 max-w-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                                    <MapIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Perimeter</p>
                                    <p className="text-base font-bold text-gray-900">Main Campus North Wing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Row 2: Full Width Maintenance Queue */}
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">
                        Active Maintenance Queue
                    </h3>
                    <p className="text-xs font-bold text-gray-900">Real-time Ticket Feed • Centralized Control</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Filter Logs button removed */}
                </div>
            </div>
            
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/10 overflow-hidden min-h-[600px]">
                <TicketList filterTechnicianId={CURRENT_TECHNICIAN_ID} />
            </div>

            {/* Quick Analytics Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Time', value: '38m', icon: Clock, color: 'text-blue-500' },
                    { label: 'Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-500' },
                    { label: 'Reliability', value: 'High', icon: Shield, color: 'text-indigo-500' },
                    { label: 'Messages', value: '3 New', icon: Bell, color: 'text-amber-500' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4 group hover:bg-[#061224] transition-colors duration-300">
                        <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-white/10 transition-colors`}>
                            <stat.icon className={`w-6 h-6 ${stat.color} group-hover:text-white`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-200/50">{stat.label}</p>
                            <p className="text-base font-extrabold text-gray-900 group-hover:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default TechnicianDashboard;

