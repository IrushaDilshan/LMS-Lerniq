import React from 'react';
import { 
  Bell, Lock, ShieldCheck, Globe, HelpCircle, 
  ChevronRight, LogOut, User, Smartphone, 
  Moon, Mail, CreditCard, ExternalLink, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SettingsSection = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">{title}</h3>
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex flex-col divide-y divide-gray-50">
        {children}
      </div>
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, description, color, actionLabel, toggle }) => (
  <button className="w-full flex items-center justify-between p-6 hover:bg-gray-50/80 transition-all group text-left">
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-black text-[#061224]">{label}</p>
        {description && <p className="text-xs text-gray-400 font-medium mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="flex items-center gap-3">
      {actionLabel && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{actionLabel}</span>}
      {toggle !== undefined ? (
        <div className={`w-10 h-6 rounded-full transition-colors relative ${toggle ? 'bg-blue-500' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggle ? 'left-5' : 'left-1'}`} />
        </div>
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
      )}
    </div>
  </button>
);

const SettingsPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* ── Page Title & Breadcrumb ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#061224] tracking-tight">Preferences</h1>
          <p className="text-gray-500 font-medium">Control your experience and security across the UniOps ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Profile Summary Card ── */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#061224] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/10 shadow-xl mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-0 p-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-black tracking-tight">{currentUser.name}</h2>
              <p className="text-blue-300/60 text-xs font-bold uppercase tracking-widest mt-1">{currentUser.role} Portal</p>
              
              <div className="w-full h-px bg-white/10 my-6" />
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-white font-bold text-sm">12</p>
                  <p className="text-[8px] text-gray-400 uppercase font-black tracking-tighter">Active Tasks</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-white font-bold text-sm">98%</p>
                  <p className="text-[8px] text-gray-400 uppercase font-black tracking-tighter">Trust Score</p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] border border-rose-100 hover:bg-rose-100 transition-all active:scale-95 shadow-sm">
            <LogOut className="w-4 h-4" /> Sign Out from Cloud
          </button>
        </div>

        {/* ── Settings Sections ── */}
        <div className="lg:col-span-2 space-y-10">
          
          <SettingsSection title="Personal & Security">
            <SettingItem 
              icon={User} 
              label="Account Profile" 
              description="Manage your identity and public information"
              color="bg-blue-50 text-blue-600"
            />
            <SettingItem 
              icon={Mail} 
              label="Contact Methods" 
              description="Secondary email and phone verification"
              color="bg-emerald-50 text-emerald-600"
              actionLabel="Verified"
            />
            <SettingItem 
              icon={Lock} 
              label="Change Password" 
              description="Last updated 14 days ago"
              color="bg-amber-50 text-amber-600"
            />
            <SettingItem 
              icon={ShieldCheck} 
              label="Two-Factor Auth" 
              description="Extra layer of protection for your data"
              color="bg-indigo-50 text-indigo-600"
              toggle={true}
            />
          </SettingsSection>

          <SettingsSection title="System Preferences">
            <SettingItem 
              icon={Bell} 
              label="Notifications" 
              description="Global alert and push message rules"
              color="bg-rose-50 text-rose-600"
            />
            <SettingItem 
              icon={Moon} 
              label="Dark Appearance" 
              description="Switch to high-contrast night mode"
              color="bg-slate-100 text-slate-700"
              toggle={false}
            />
            <SettingItem 
              icon={Globe} 
              label="Language & Region" 
              description="English (United States), UTC+5:30"
              color="bg-cyan-50 text-cyan-600"
            />
          </SettingsSection>

          <SettingsSection title="Support & Legal">
            <SettingItem 
              icon={HelpCircle} 
              label="Help Center" 
              description="Documentation and tutorial guides"
              color="bg-gray-100 text-gray-700"
            />
            <SettingItem 
              icon={CreditCard} 
              label="License Info" 
              description="Educational Enterprise Subscription"
              color="bg-purple-50 text-purple-600"
              actionLabel="Pro"
            />
          </SettingsSection>

          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Version v2.4.0-stable</p>
            <button className="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:underline">
              Check for updates <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
