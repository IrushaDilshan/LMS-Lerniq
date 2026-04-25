import React from 'react';
import { 
  Shield, Zap, LayoutGrid, Calendar, Wrench, ChevronRight, 
  ArrowRight, Users, Globe, BookOpen, Star, Activity, 
  Cpu, Lock, Globe2, Sparkles, MoveRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { mockLoginAs } = useAuth();
  const navigate = useNavigate();

  const handleStart = (role) => {
    mockLoginAs(role);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 selection:text-white overflow-x-hidden font-sans">
      
      {/* ── Immersive Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ── Desktop Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-3.5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">UniOps</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {['Ecosystem', 'Capabilities', 'Documentation'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-400 transition-all">
                {item}
              </a>
            ))}
          </div>

          <button 
            onClick={() => document.getElementById('access').scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-3 bg-white text-[#020617] text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">Initiate Hub <Sparkles className="w-4 h-4" /></span>
            <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-blue-500/10 transition-all duration-300" />
          </button>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase mb-12 backdrop-blur-md animate-fade-in text-blue-400">
            <Activity className="w-3.5 h-3.5" /> Next-Gen Smart Campus Infrastructure
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[9.5rem] font-black tracking-tighter leading-[0.85] mb-12 animate-fade-in-up">
            CAMPUS<br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-1 blur-2xl bg-blue-600/30 rounded-full" />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 drop-shadow-2xl">SYMPHONY.</span>
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-2xl font-medium leading-relaxed mb-16 animate-fade-in-up delay-150">
            Orchestrate facilities, assets, and service requests through a single, intelligent operations hub designed for the modern university ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-up delay-200">
            <button 
              onClick={() => handleStart('USER')}
              className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest flex items-center gap-4 hover:scale-105 transition-all shadow-3xl shadow-blue-500/20 group"
            >
              Enter Public Portal <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex items-center gap-6 py-4 px-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-11 h-11 rounded-2xl border-2 border-[#020617] overflow-hidden shadow-2xl transition-transform hover:scale-110">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=p${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-black leading-none mb-1 text-white">1.2k+</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Global Active nodes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Loop ── */}
      <div className="border-y border-white/5 bg-white/[0.02] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: 'System Uptime', value: '99.99%', icon: Cpu },
            { label: 'Active Facilities', value: '450+', icon: LayoutGrid },
            { label: 'Security Protocols', value: 'Lvl 4', icon: Lock },
            { label: 'Response Rate', value: '2.4h', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <stat.icon className="w-6 h-6 mx-auto mb-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
              <p className="text-4xl font-black mb-2 tracking-tighter">{stat.value}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Capabilities Screen ── */}
      <section id="capabilities" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-24">
            <div className="max-w-2xl">
              <p className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-4">Core Engine</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8">Integrated<br />Modules.</h2>
              <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">Three specialized pillars working in perfect synchronization to power campus operations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group relative bg-[#0a0f1e] p-12 rounded-[4rem] border border-white/5 hover:border-blue-500/30 transition-all overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BoxIcon />
              </div>
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-10 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight text-white/90">Asset Catalogue</h3>
              <p className="text-gray-500 leading-relaxed font-medium mb-10 group-hover:text-gray-300 transition-colors">Digital twin of campus assets. Real-time availability, metadata tracking, and multi-location management.</p>
              <div className="flex items-center gap-3 text-blue-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                Dive Deeper <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="group relative bg-[#0a0f1e] p-12 rounded-[4rem] border border-white/5 hover:border-amber-500/30 transition-all overflow-hidden cursor-pointer mt-0 md:mt-12">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <CalendarIcon />
              </div>
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight text-white/90">Smart Bookings</h3>
              <p className="text-gray-500 leading-relaxed font-medium mb-10 group-hover:text-gray-300 transition-colors">Conflict-free resource scheduling with intelligent time-blocking and automated approval pipelines.</p>
              <div className="flex items-center gap-3 text-amber-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                Dive Deeper <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="group relative bg-[#0a0f1e] p-12 rounded-[4rem] border border-white/5 hover:border-indigo-500/30 transition-all overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <WrenchIcon />
              </div>
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-10 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight text-white/90">Incident Engine</h3>
              <p className="text-gray-500 leading-relaxed font-medium mb-10 group-hover:text-gray-300 transition-colors">End-to-end maintenance ticketing with specialized workflows for students, admins, and technicians.</p>
              <div className="flex items-center gap-3 text-indigo-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                Dive Deeper <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ecosystem ── */}
      <section id="access" className="py-40 px-6 relative bg-white/[0.01] rounded-[6rem] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">Select your<br />entry node.</h2>
            <p className="text-gray-500 text-lg uppercase font-black tracking-[0.3em]">Bypass protocols and enter the portal</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Student Card */}
            <div onClick={() => handleStart('USER')} className="group relative bg-[#0a0f1e] p-10 rounded-[4rem] border border-white/5 hover:bg-blue-600/5 transition-all cursor-pointer">
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-[2.5rem] border-2 border-blue-500 shadow-2xl shadow-blue-500/20 overflow-hidden shrink-0 transition-transform group-hover:scale-110">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black leading-none mb-1">Student Portal</h4>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Client Instance</p>
                    </div>
                 </div>
                 <p className="text-gray-500 font-medium leading-relaxed mb-12">Report incidents, manage your bookings, and view current campus resource status in real-time.</p>
                 <button className="flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest bg-white/5 px-8 py-4 rounded-2xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    Initiate Node <MoveRight className="w-4 h-4" />
                 </button>
            </div>

            {/* Admin Card */}
            <div onClick={() => handleStart('ADMIN')} className="group relative bg-white/[0.03] p-10 rounded-[4rem] border border-blue-500/30 scale-105 shadow-[0_0_100px_rgba(37,99,235,0.1)] backdrop-blur-3xl transition-all cursor-pointer">
                 <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[4rem]" />
                 <div className="relative z-10 flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-[2.5rem] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 overflow-hidden shrink-0 transition-transform group-hover:scale-110">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black leading-none mb-1">Master Admin</h4>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Root Controller</p>
                    </div>
                 </div>
                 <p className="text-gray-400 font-medium leading-relaxed mb-12">Universal oversight of all campus modules, user management, and advanced operational analytics.</p>
                 <button className="relative z-10 flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest bg-blue-600 px-8 py-4 rounded-2xl group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
                    Initiate Node <MoveRight className="w-4 h-4" />
                 </button>
            </div>

            {/* Tech Card */}
            <div onClick={() => handleStart('TECHNICIAN')} className="group relative bg-[#0a0f1e] p-10 rounded-[4rem] border border-white/5 hover:bg-emerald-600/5 transition-all cursor-pointer">
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-[2.5rem] border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 overflow-hidden shrink-0 transition-transform group-hover:scale-110">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tech" className="w-full h-full object-cover scale-110" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black leading-none mb-1">Field Ops</h4>
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Execution Engine</p>
                    </div>
                 </div>
                 <p className="text-gray-500 font-medium leading-relaxed mb-12">Direct access to the incident resolution queue, performance metrics, and field management tools.</p>
                 <button className="flex items-center gap-3 text-white text-[11px] font-black uppercase tracking-widest bg-white/5 px-8 py-4 rounded-2xl border border-white/10 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all">
                    Initiate Node <MoveRight className="w-4 h-4" />
                 </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="py-24 px-6 relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic">UniOps</span>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-12">Modern Campus Symphony • v1.0.0 Stable</p>
          <div className="flex gap-16 mb-16">
            <Globe2 className="w-6 h-6 text-gray-700 hover:text-white transition-colors cursor-pointer" />
            <Users className="w-6 h-6 text-gray-700 hover:text-white transition-colors cursor-pointer" />
            <Shield className="w-6 h-6 text-gray-700 hover:text-white transition-colors cursor-pointer" />
          </div>
          <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em] text-center">© 2026 Developed for SLIIT IT3030 PAF Assignment • Sri Lanka</p>
      </footer>

    </div>
  );
};

/* SVG Decorative Components */
const BoxIcon = () => (
    <svg className="w-64 h-64 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-64 h-64 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const WrenchIcon = () => (
    <svg className="w-64 h-64 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

export default LandingPage;
