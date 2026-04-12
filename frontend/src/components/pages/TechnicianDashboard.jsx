import React from 'react';
import { 
  PenTool, CheckCircle, Clock, List, AlertCircle, 
  MapPin, User, ChevronRight, Zap, Target
} from 'lucide-react';
import TicketList from '../tickets/TicketList';

const TechnicianDashboard = () => {
  const CURRENT_TECHNICIAN_ID = 10;
  const CURRENT_TECHNICIAN_NAME = "John Doe (IT Support)";

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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Current Focus / Top Task Card */}
        <div className="lg:col-span-1 space-y-6">
           <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Focus</h2>
           <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="relative z-10">
                 <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase mb-4">
                    <AlertCircle className="w-3 h-3" /> Urgent Maintenance
                 </div>
                 <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">Projector Failure in Main Lecture Hall B</h3>
                 <p className="text-gray-500 text-sm mb-6 line-clamp-2">Reported by Dr. Smith. Projector not responding to remote or manual controls. High priority for 2 PM lecture.</p>
                 
                 <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                       <MapPin className="w-4 h-4 text-blue-500" /> Hall B, Level 2
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                       <User className="w-4 h-4 text-emerald-500" /> Prof. Sarah
                    </div>
                 </div>
                 
                 <button className="w-full py-4 bg-[#061224] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                    Start Working <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
           
           {/* Secondary Stats */}
           <div className="bg-[#122b52] rounded-[2rem] p-8 text-white">
              <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4">Availability</p>
              <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-bold">Shift Progress</span>
                 <span className="text-xs font-bold">65%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-6">
                 <div className="h-full bg-blue-400 w-[65%]" />
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
