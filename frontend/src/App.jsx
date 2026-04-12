import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Calendar, Wrench, Settings, Bell, MessageSquare, Menu, Briefcase, Shield, User } from 'lucide-react';
import HomePage from './components/pages/HomePage';
import SettingsPage from './components/pages/SettingsPage';
import ResourcesPage from './components/pages/ResourcesPage';
import TicketDashboard from './components/pages/TicketDashboard';
import TicketDetailView from './components/tickets/TicketDetailView';
import TechnicianDashboard from './components/pages/TechnicianDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const location = useLocation();
  const { currentUser, mockLoginAs } = useAuth();
  const isActive = (path) => location.pathname === path;

  // Filter links based on role mapping
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" />, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
    { name: 'Resources', path: '/resources', icon: <BookOpen className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" />, roles: ['USER', 'ADMIN'] },
    { name: 'Bookings', path: '/bookings', icon: <Calendar className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" />, roles: ['USER', 'ADMIN'] },
    { name: 'Maintenance Tickets', path: '/tickets', icon: <Wrench className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" />, roles: ['USER', 'ADMIN'] },
    { name: 'Technician Portal', path: '/technician', icon: <Briefcase className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" />, roles: ['TECHNICIAN', 'ADMIN'] },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" />, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  ].filter(link => link.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-[#F0F4F8] font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#061224] text-white flex flex-col h-full rounded-r-3xl flex-shrink-0 shadow-2xl transition-all duration-300 relative z-20">
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
               <BookOpen className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-bold tracking-wider">Lerniq</span>
          </div>
          <Menu className="w-6 h-6 text-gray-300 cursor-pointer" />
        </div>

        {/* User Profile Card */}
        <div className="px-6 mb-8 mt-2">
          <div className="border border-gray-600/50 rounded-2xl p-3 flex items-center space-x-3 bg-[#0a1930]">
             <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-200 border-2 border-orange-400 p-0.5">
               <img src={currentUser.avatar} alt="User Profile" className="w-full h-full rounded-full" />
             </div>
             <div>
               <p className="text-sm font-semibold truncate w-32">{currentUser.name}</p>
               <p className="text-xs font-bold text-blue-400">{currentUser.role}</p>
             </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center justify-center md:justify-start px-2 md:px-4 py-3.5 mt-2 rounded-xl transition-colors font-medium text-sm w-full max-w-[200px] mx-auto ${
                isActive(link.path)
                  ? 'bg-[#C4E6F1] text-[#061224]'
                  : 'text-gray-300 hover:bg-[#11233e] hover:text-white'
              }`}
            >
              {link.icon}
              <span className="hidden md:inline">{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header containing auth mockup tools */}
        <header className="absolute top-0 right-0 w-full p-6 flex justify-end items-center pointer-events-none z-10">
          <div className="flex items-center space-x-6 pointer-events-auto">
            {/* Role Switcher Tool for Testing */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3 text-sm">
               <span className="font-semibold text-gray-500">Test Role:</span>
               <button onClick={() => mockLoginAs('USER')} className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${currentUser.role==='USER' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100'}`}><User className="w-4 h-4"/><span>USER</span></button>
               <button onClick={() => mockLoginAs('ADMIN')} className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${currentUser.role==='ADMIN' ? 'bg-rose-100 text-rose-700' : 'text-gray-400 hover:bg-gray-100'}`}><Shield className="w-4 h-4"/><span>ADMIN</span></button>
               <button onClick={() => mockLoginAs('TECHNICIAN')} className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${currentUser.role==='TECHNICIAN' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:bg-gray-100'}`}><Wrench className="w-4 h-4"/><span>TECH</span></button>
            </div>

            <div className="flex space-x-3">
              <button className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition">
                <Bell className="w-5 h-5 text-gray-800" />
              </button>
              <button className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition">
                <MessageSquare className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/bookings" element={<div className="text-gray-800 text-xl text-center mt-12 font-semibold">Bookings Module Coming Soon...</div>} />
            <Route path="/tickets" element={<TicketDashboard />} />
            <Route path="/tickets/:id" element={<TicketDetailView />} />
            <Route path="/technician" element={<TechnicianDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
