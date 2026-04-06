import React from 'react';
import { 
  Bell, 
  Lock, 
  ShieldCheck, 
  Users, 
  Smartphone, 
  Globe, 
  HelpCircle, 
  ChevronRight, 
  LogOut 
} from 'lucide-react';

const SettingsPage = () => {
  const settingOptions = [
    { icon: <Bell className="w-5 h-5 text-gray-600" />, label: 'Notifications' },
    { icon: <Lock className="w-5 h-5 text-gray-600" />, label: 'Change Password' },
    { icon: <ShieldCheck className="w-5 h-5 text-gray-600" />, label: 'Security' },
    { icon: <Globe className="w-5 h-5 text-gray-600" />, label: 'Display and languages' },
    { icon: <HelpCircle className="w-5 h-5 text-gray-600" />, label: 'Help' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto font-sans animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-[#0a1b32] text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-12 max-w-lg">
        <div className="flex flex-col divide-y divide-gray-100">
          {settingOptions.map((option, idx) => (
            <button 
              key={idx} 
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer w-full text-left"
            >
              <div className="flex items-center space-x-4">
                {option.icon}
                <span className="text-gray-800 text-sm font-medium">{option.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-start max-w-lg">
        <button className="flex items-center space-x-2 text-gray-800 hover:text-black mx-auto font-medium transition-colors px-4 py-2 hover:bg-gray-100 rounded-lg">
          <LogOut className="w-5 h-5 text-gray-700" />
          <span>logout</span>
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
