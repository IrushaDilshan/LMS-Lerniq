import React, { useEffect, useState } from 'react';
import { 
  Shield, Zap, LayoutGrid, Calendar, Wrench, ChevronRight, 
  ArrowRight, Users, Globe, BookOpen, Star, Activity, 
  Cpu, Lock, Globe2, Sparkles, MoveRight, Scan, Fingerprint,
  Command, Terminal, Eye, Radio, Network
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { mockLoginAs } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = (role) => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 selection:text-white overflow-x-hidden font-sans">
      
      {/* ── Immersive Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse delay-1000" />
        
        {/* Particle/Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Moving Light Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-50" />
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className={`max-w-7xl mx-auto flex items-center justify-between px-8 py-3.5 transition-all duration-500 rounded-[2rem] border ${scrolled ? 'bg-[#020617]/80 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-[10deg]">
              <Command className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">UniOps</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Ecosystem', 'Capabilities', 'Nexus'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={() => document.getElementById('access').scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-7 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
            >
                Connect Terminal
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-black tracking-[0.4em] uppercase mb-10 backdrop-blur-md animate-fade-in text-blue-400 shadow-inner">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Operational Hub v1.0.0
          </div>
          
          <h1 className="text-7xl md:text-[9rem] lg:text-[12rem] font-black tracking-tighter leading-[0.8] mb-12 animate-fade-in-up">
            CAMPUS<br />
            <span className="relative inline-block mt-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
              SYMPHONY
              <span className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed mb-16 animate-fade-in-up delay-150">
            A high-fidelity orchestration engine for modern university ecosystems. <span className="text-gray-300">Synchronize assets, facilities, and service protocols</span> through a single unified interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-fade-in-up delay-200">
            <button 
              onClick={() => handleStart('USER')}
              className="group relative px-12 py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-white/10 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">Initialize Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></span>
              <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
            
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network Status</p>
                    <p className="text-sm font-bold text-white uppercase">All Systems Optimal</p>
                </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 animate-bounce">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] vertical-rl">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── Tech Stack / Stats ── */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
                {[
                    { label: 'Neural Link Speed', value: '4.2ms', icon: Zap },
                    { label: 'Facility Coverage', value: '100%', icon: Network },
                    { label: 'Security Layer', value: 'AES-256', icon: Lock },
                    { label: 'Active Sessions', value: '2.8k', icon: Users }
                ].map((stat, i) => (
                    <div key={i} className="group cursor-default">
                        <div className="flex items-center gap-3 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            <stat.icon className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</span>
                        </div>
                        <p className="text-5xl font-black tracking-tighter text-white/90 group-hover:text-white transition-colors">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section id="capabilities" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] uppercase text-blue-400 mb-6">
                <LayoutGrid className="w-3 h-3" /> System Modules
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">Integrated<br />Nexus.</h2>
            <p className="max-w-xl text-gray-500 text-lg font-medium leading-relaxed">A multi-layered infrastructure designed to handle the complexities of modern campus life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'Asset Matrix', 
                desc: 'Deep tracking and inventory of every campus resource. Real-time telemetry and availability.',
                icon: LayoutGrid,
                color: 'blue'
              },
              { 
                title: 'Booking Engine', 
                desc: 'Conflict-resolution scheduling with automated approval flows and smart occupancy tracking.',
                icon: Calendar,
                color: 'indigo'
              },
              { 
                title: 'Mission Log', 
                desc: 'High-priority maintenance ticketing with direct technician uplinks and real-time status.',
                icon: Wrench,
                color: 'emerald'
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 transition-opacity group-hover:opacity-10">
                    <feature.icon className="w-32 h-32" />
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-10 group-hover:text-gray-400 transition-colors">{feature.desc}</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Explore Node <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Access Nodes ── */}
      <section id="access" className="py-40 px-6 relative bg-white/[0.01] rounded-[6rem] border-y border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 italic">INITIALIZE</h2>
            <p className="text-gray-500 text-xs uppercase font-black tracking-[0.5em] flex items-center justify-center gap-4">
                <span className="w-12 h-[1px] bg-gray-800" />
                Select Authentication Node
                <span className="w-12 h-[1px] bg-gray-800" />
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Student Card */}
            <div onClick={() => handleStart('USER')} className="group relative bg-[#0a0f1e]/40 p-12 rounded-[3.5rem] border border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer">
                 <div className="flex items-center justify-between mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-all duration-500">
                      <Eye className="w-8 h-8 text-blue-500 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">Public Access</span>
                 </div>
                 <h4 className="text-4xl font-black mb-4 tracking-tighter">Student<br />Portal</h4>
                 <p className="text-gray-500 font-medium leading-relaxed mb-12">Universal access node for campus reporting and resource scheduling.</p>
                 <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <MoveRight className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Link</span>
                 </div>
            </div>

            {/* Admin Card */}
            <div onClick={() => handleStart('ADMIN')} className="group relative bg-white text-black p-12 rounded-[3.5rem] scale-105 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all cursor-pointer">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Shield className="w-24 h-24" />
                 </div>
                 <div className="flex items-center justify-between mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
                      <Fingerprint className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-black/40 uppercase tracking-widest px-3 py-1 rounded-full border border-black/10 font-black">Level 0: Root</span>
                 </div>
                 <h4 className="text-4xl font-black mb-4 tracking-tighter">Campus<br />Admin</h4>
                 <p className="text-black/60 font-medium leading-relaxed mb-12">Master orchestration node with global override and analytical oversight.</p>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                        <MoveRight className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authorize Root</span>
                 </div>
            </div>

            {/* Tech Card */}
            <div onClick={() => handleStart('TECHNICIAN')} className="group relative bg-[#0a0f1e]/40 p-12 rounded-[3.5rem] border border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer">
                 <div className="flex items-center justify-between mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-500">
                      <Scan className="w-8 h-8 text-emerald-500 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">Field Command</span>
                 </div>
                 <h4 className="text-4xl font-black mb-4 tracking-tighter">Technician<br />Log</h4>
                 <p className="text-gray-500 font-medium leading-relaxed mb-12">Dedicated execution interface for facility maintenance and incident response.</p>
                 <div className="flex items-center gap-4 group-hover:translate-x-2 transition-transform">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <MoveRight className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Establish Uplink</span>
                 </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Command className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black tracking-tighter uppercase italic">UniOps</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 mb-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Security Layer</a>
                <a href="#" className="hover:text-white transition-colors">System status</a>
                <a href="#" className="hover:text-white transition-colors">API Docs</a>
            </div>

            <div className="w-full h-[1px] bg-white/5 mb-16" />

            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">Developed for SLIIT IT3030 PAF Assignment • 2026</p>
                <div className="flex items-center gap-10">
                    <Globe2 className="w-5 h-5 text-gray-700 hover:text-white transition-colors cursor-pointer" />
                    <Users className="w-5 h-5 text-gray-700 hover:text-white transition-colors cursor-pointer" />
                    <Shield className="w-5 h-5 text-gray-700 hover:text-white transition-colors cursor-pointer" />
                </div>
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">Operational Stability: 100%</p>
            </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;

