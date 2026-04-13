import React, { useState, useEffect } from 'react';
import { 
  FileText, Bell, MessageSquare, TrendingUp, Users, Wrench, 
  Calendar, Award, BookOpen, Clock, Activity, ShieldCheck,
  ChevronRight, LayoutGrid, Zap, Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, trend, color, bg }) => (
  <div className={`p-6 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all group cursor-pointer`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {trend && (
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
  </div>
);

const UserHome = ({ user, tickets }) => {
  const navigate = useNavigate();
  const myTicketsCount = tickets.filter(t => t.createdByUserId === user.id).length;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#061224] via-[#0d2147] to-[#1a365d] p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-20 -mt-20 shrink-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-20 -mb-20 shrink-0" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              <Zap className="w-3 h-3 text-amber-400" /> Academic Excellence
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Welcome back,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">{user.name}</span>
            </h1>
            <p className="text-blue-100/70 max-w-md text-lg leading-relaxed mb-8">
              Your learning portal is synchronized. You have {myTicketsCount} maintenance ticket{myTicketsCount !== 1 ? 's' : ''} currently in the system.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/bookings')} 
                className="px-8 py-3.5 bg-white text-[#061224] rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/40"
              >
                View Bookings <Calendar className="w-4 h-4" />
              </button>
              <button className="px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all backdrop-blur-md">
                Check Grades <Award className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-fit">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                <BookOpen className="w-8 h-8 text-blue-300 mb-3" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-blue-200/60 uppercase font-bold tracking-tighter">Active Courses</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl mt-6">
                <Clock className="w-8 h-8 text-amber-300 mb-3" />
                <p className="text-2xl font-bold">97%</p>
                <p className="text-xs text-blue-200/60 uppercase font-bold tracking-tighter">Attendance</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl -mt-6">
                <MessageSquare className="w-8 h-8 text-emerald-300 mb-3" />
                <p className="text-2xl font-bold">04</p>
                <p className="text-xs text-blue-200/60 uppercase font-bold tracking-tighter">Messages</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                <FileText className="w-8 h-8 text-rose-300 mb-3" />
                <p className="text-2xl font-bold">{myTicketsCount}</p>
                <p className="text-xs text-blue-200/60 uppercase font-bold tracking-tighter">My Tickets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => navigate('/resources')} className="bg-[#125B65] p-1 rounded-[2.5rem] shadow-lg group cursor-pointer overflow-hidden border border-white/10">
          <div className="bg-white rounded-[2.3rem] p-8 h-full transition-transform group-hover:scale-[0.98]">
            <LayoutGrid className="w-10 h-10 text-[#125B65] mb-4" />
            <h3 className="text-xl font-black text-gray-900">Module Portal</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">Manage your course modules, handouts, and submissions.</p>
            <button className="flex items-center gap-2 text-[#125B65] font-bold text-sm">
              Enter Portal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="bg-[#E6F4F1] p-1 rounded-[2.5rem] shadow-lg group cursor-pointer overflow-hidden border border-white/10">
          <div className="bg-white rounded-[2.3rem] p-8 h-full transition-transform group-hover:scale-[0.98]">
            <Zap className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-black text-gray-900">Campus Events</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">Stay updated with the latest workshops and student activities.</p>
            <button className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              View Schedule <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div onClick={() => navigate('/tickets')} className="bg-[#061224] p-1 rounded-[2.5rem] shadow-lg group cursor-pointer overflow-hidden border border-white/10">
          <div className="bg-white rounded-[2.3rem] p-8 h-full transition-transform group-hover:scale-[0.98]">
            <Wrench className="w-10 h-10 text-gray-700 mb-4" />
            <h3 className="text-xl font-black text-gray-900">Support Hub</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">Technical issues or maintenance requests? We are here to help.</p>
            <button className="flex items-center gap-2 text-[#061224] font-bold text-sm">
              Report Incident <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminHome = ({ user, tickets }) => {
  const navigate = useNavigate();
  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  
  const isTrulyNew = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 24;
  };
  
  const newToday = tickets.filter(t => isTrulyNew(t.createdAt) && t.status === 'OPEN').length;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#061224] tracking-tight">System Pulse</h1>
          <p className="text-gray-500 font-medium">Lerniq Administrative Control Center • <span className="text-emerald-500 font-bold animate-pulse">Live Dashboard</span></p>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={() => navigate('/tickets')} className="px-6 py-3 bg-[#061224] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
            Manage Tickets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Users" value="1,284" trend="+12%" color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Wrench} label="Open Tickets" value={openCount} trend={newToday > 0 ? `${newToday} New Today` : 'Stable'} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Activity} label="Active Tasks" value={inProgressCount} trend="Live" color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={TrendingUp} label="Total Requests" value={tickets.length} trend="+24%" color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-800">Critical & Recent Alerts</h3>
            <button onClick={() => navigate('/tickets')} className="text-blue-600 font-bold text-xs uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-4">
            {tickets
              .filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH' || isTrulyNew(t.createdAt))
              .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map(ticket => (
              <div key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  ticket.priority === 'CRITICAL' ? 'bg-rose-50 text-rose-500' : 
                  isTrulyNew(ticket.createdAt) ? 'bg-blue-50 text-blue-500' :
                  'bg-orange-50 text-orange-500'
                }`}>
                  {isTrulyNew(ticket.createdAt) ? <Zap className="w-5 h-5 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 text-sm truncate">{ticket.category}: {ticket.resourceLocation}</p>
                    {isTrulyNew(ticket.createdAt) && <span className="bg-blue-100 text-blue-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">New</span>}
                  </div>
                  <p className="text-xs text-gray-400 truncate opacity-70">{ticket.description}</p>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  View Case
                </button>
              </div>
            ))}
            {tickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length === 0 && (
              <p className="text-center text-gray-400 py-10 font-medium">No critical alerts at this time.</p>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <h3 className="text-xl font-bold mb-4 tracking-tight">System Status</h3>
          <p className="text-indigo-100/80 text-sm mb-8 leading-relaxed font-medium">
            System performance is optimal. {inProgressCount} tasks are currently being handled by the technician team.
          </p>
          <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-1">
                  <span>Tickets Resolved</span>
                  <span>{tickets.length > 0 ? Math.round((tickets.filter(t=>t.status==='RESOLVED').length / tickets.length) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: `${tickets.length > 0 ? (tickets.filter(t=>t.status==='RESOLVED').length / tickets.length) * 100 : 0}%` }} />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mb-1">
                  <span>Load Balancing</span>
                  <span>45%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-300 w-[45%]" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechHome = ({ user, tickets }) => {
  const navigate = useNavigate();
  const myPendingTasks = tickets.filter(t => t.assignedTechnicianId === user.id && t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const myHighPriority = myPendingTasks.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL');

  return (
    <div className="space-y-8 animate-fade-in text-[#061224]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Mission Briefing</h1>
          <p className="text-gray-500 font-medium tracking-tight">Field Technician Portal • <span className="text-indigo-600 font-bold">{user.name}</span></p>
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <Bell className="w-5 h-5 text-gray-700" />
           </button>
           <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
             <Briefcase className="w-6 h-6 text-gray-600" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] relative group cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-20 h-20 text-blue-600" />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">My Task Queue</p>
            <p className="text-3xl font-black mb-1">{myPendingTasks.length < 10 && '0'}{myPendingTasks.length}</p>
            <p className="text-sm font-bold text-gray-500">Tasks Pending</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] relative group cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-20 h-20 text-emerald-600" />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Avg Res Time</p>
            <p className="text-3xl font-black mb-1">2.4h</p>
            <p className="text-sm font-bold text-gray-500 transition-colors group-hover:text-emerald-600">Excellent Score</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] relative group cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Award className="w-20 h-20 text-amber-600" />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Efficiency</p>
            <p className="text-3xl font-black mb-1">94%</p>
            <p className="text-sm font-bold text-gray-500">Team Top 5</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
          <div className="max-w-md">
            <h2 className="text-2xl font-black mb-3">Ready to start your shift?</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              There are {myHighPriority.length} high-priority issues assigned to you. All required diagnostic tools have been logged for your account.
            </p>
            <button 
              onClick={() => navigate('/technician')} 
              className="px-8 py-3.5 bg-[#061224] text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20"
            >
              Open Technician Portal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center">
                <p className="text-2xl font-black text-blue-600 leading-none">{myHighPriority.filter(p=>p.priority==='HIGH').length}</p>
                <p className="text-[9px] font-bold text-blue-400 uppercase mt-2 tracking-widest leading-none">High</p>
            </div>
            <div className="w-24 h-24 rounded-3xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center">
                <p className="text-2xl font-black text-rose-600 leading-none">{myHighPriority.filter(p=>p.priority==='CRITICAL').length}</p>
                <p className="text-[9px] font-bold text-rose-400 uppercase mt-2 tracking-widest leading-none">Critical</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Analyzing Real-time Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {currentUser.role === 'ADMIN' && <AdminHome user={currentUser} tickets={tickets} />}
      {currentUser.role === 'TECHNICIAN' && <TechHome user={currentUser} tickets={tickets} />}
      {currentUser.role === 'USER' && <UserHome user={currentUser} tickets={tickets} />}
    </div>
  );
};

export default HomePage;
