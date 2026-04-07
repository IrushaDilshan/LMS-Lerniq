import React from 'react';
import { FileText, Bell, MessageSquare } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto font-sans animate-fade-in-up">
      {/* Dashboard Top Header */}
      <div className="mb-8">
        <h1 className="text-[#0a1b32] text-3xl font-extrabold tracking-tight mb-1">Dashboard</h1>
        <h2 className="text-[#0a1b32] text-xl font-medium tracking-tight">Welcome Back, Alex</h2>
      </div>

      {/* Main Announcement Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 relative p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex space-x-6 mb-4">
            {/* Mock logos resembling the screenshot */}
            <div className="bg-[#4a8f3b] text-white p-3 rounded text-left">
              <p className="text-[10px] uppercase font-bold">Department of</p>
              <p className="text-xl font-bold">BIOLOGY</p>
            </div>
            <div className="bg-[#0f1f4b] text-white p-3 rounded text-center">
              <p className="text-[10px] uppercase font-bold tracking-widest">University of</p>
              <p className="text-xl font-serif">OXFORD</p>
            </div>
          </div>
          
          <div className="mb-4 text-6xl">🇬🇧</div>
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3">
            Oxford scholarships for PhD (Dphil) in Biology,<br />
            2023-24, University of Oxford, UK
          </h2>
          
          <p className="text-[#4a8f3b] font-bold text-lg mt-2">
            Application deadline: 20 January 2023
          </p>
        </div>
      </div>

      {/* Enrolled Courses / Diplomas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-[#125B65] text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition flex items-center space-x-4 cursor-pointer">
          <FileText className="w-10 h-10 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-[15px]">Diploma in English</h3>
            <p className="text-xs text-teal-100 mt-1 uppercase tracking-wider">OXF/ENG/01</p>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-[#125B65] text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition flex items-center space-x-4 cursor-pointer">
          <FileText className="w-10 h-10 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-[15px]">Diploma in IT</h3>
            <p className="text-xs text-teal-100 mt-1 uppercase tracking-wider">OXF/DIT/01</p>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-[#125B65] text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition flex items-center space-x-4 cursor-pointer">
          <FileText className="w-10 h-10 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-[15px]">HND in Computing</h3>
            <p className="text-xs text-teal-100 mt-1 uppercase tracking-wider">OXF/HND/01</p>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#051125] text-white px-6 py-5 rounded-2xl flex justify-between items-center shadow-lg">
          <span className="font-medium">Module Progress :</span>
          <span className="font-semibold text-lg">90%</span>
        </div>
        
        <div className="bg-[#051125] text-white px-6 py-5 rounded-2xl flex justify-between items-center shadow-lg">
          <span className="font-medium">Assignment Progress :</span>
          <span className="font-semibold text-lg">10%</span>
        </div>
        
        <div className="bg-[#051125] text-white px-6 py-5 rounded-2xl flex justify-between items-center shadow-lg">
          <span className="font-medium">Attendance Progress :</span>
          <span className="font-semibold text-lg">97%</span>
        </div>
        
        <div className="bg-[#051125] text-white px-6 py-5 rounded-2xl flex justify-between items-center shadow-lg">
          <span className="font-medium">Course Progress</span>
          <span className="font-semibold text-lg">50%</span>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
