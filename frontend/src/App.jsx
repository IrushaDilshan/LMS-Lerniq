import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, BookOpen, Calendar, Wrench, Settings, Bell, MessageSquare, Menu, Briefcase, Shield, User } from 'lucide-react';
import LandingPage from './components/pages/LandingPage';
import HomePage from './components/pages/HomePage';
import SettingsPage from './components/pages/SettingsPage';
import ResourcesPage from './components/pages/ResourcesPage';
import BookingsPage from './components/pages/BookingsPage';
import TicketDashboard from './components/pages/TicketDashboard';
import TicketDetailView from './components/tickets/TicketDetailView';
import TechnicianDashboard from './components/pages/TechnicianDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, mockLoginAs, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  // Role switching shortcuts via URL
  useEffect(() => {
    if (location.pathname === '/admin') {
      mockLoginAs('ADMIN');
      navigate('/', { replace: true });
    } else if (location.pathname === '/tech') {
      mockLoginAs('TECHNICIAN');
      navigate('/', { replace: true });
    } else if (location.pathname === '/user_role') { // Avoid conflict with potential /user page
      mockLoginAs('USER');
      navigate('/', { replace: true });
    }
  }, [location.pathname, mockLoginAs, navigate]);

  // Filter links based on role mapping
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 flex-shrink-0" />, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
    { name: 'Resources', path: '/resources', icon: <BookOpen className="w-5 h-5 flex-shrink-0" />, roles: ['USER', 'ADMIN'] },
    { name: 'Bookings', path: '/bookings', icon: <Calendar className="w-5 h-5 flex-shrink-0" />, roles: ['USER', 'ADMIN'] },
    { name: 'Maintenance Tickets', path: '/tickets', icon: <Wrench className="w-5 h-5 flex-shrink-0" />, roles: ['USER', 'ADMIN'] },
    { name: 'Technician Portal', path: '/technician', icon: <Briefcase className="w-5 h-5 flex-shrink-0" />, roles: ['TECHNICIAN'] },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 flex-shrink-0" />, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },
  ].filter(link => link.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-[84px] lg:w-[280px] bg-[#061224] text-white flex flex-col h-full flex-shrink-0 shadow-2xl transition-all duration-300 relative z-30">
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight hidden lg:block">UniOps</span>
        </Link>

        <nav className="mt-10 px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive(link.path)
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`transition-transform duration-300 group-hover:scale-110`}>{link.icon}</div>
              <span className="text-sm font-bold tracking-tight hidden lg:block">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-6 mb-4 space-y-3">
           <div className="bg-white/5 rounded-2xl p-4 hidden lg:block border border-white/10 mb-2">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-blue-400 mb-2">Pro Support</p>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">Need help with your {currentUser.role.toLowerCase()} portal?</p>
              <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Contact Dev</button>
           </div>
           
           <button 
             onClick={() => { logout(); navigate('/'); }}
             className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold text-sm"
           >
             <LogOut className="w-5 h-5" />
             <span className="hidden lg:block">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* ── Top Bar ── */}
        <header className="h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-8 relative z-20">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative group hidden md:block max-w-md w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                   <Home className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Universal Search (Resources, Tickets, Tools...)" 
                  className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
             </div>
          </div>

          <div className="flex items-center gap-10">
            {/* Role switcher was here - now handled by /admin and /tech routes */}
            <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
               <button className="p-2.5 text-gray-400 hover:text-[#061224] transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
               </button>
               <button className="p-2.5 text-gray-400 hover:text-[#061224] transition-colors">
                 <MessageSquare className="w-5 h-5" />
               </button>
            </div>

            <div className="flex items-center gap-4 group cursor-pointer">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-[#061224] leading-none mb-1">{currentUser.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{currentUser.role} Portal</p>
               </div>
               <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-gray-200 group-hover:scale-105 transition-transform">
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        {/* ── Content Viewport ── */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          <div className="p-8 pb-20">
            <Routes>
              {/* Role Switching Shortcut Routes */}
              <Route path="/admin" element={<RoleRedirect role="ADMIN" />} />
              <Route path="/tech" element={<RoleRedirect role="TECHNICIAN" />} />
              <Route path="/user" element={<RoleRedirect role="USER" />} />

              <Route path="/" element={<HomePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/tickets" element={<TicketDashboard />} />
              <Route path="/tickets/:id" element={<TicketDetailView />} />
              <Route path="/technician" element={currentUser.role === 'TECHNICIAN' ? <TechnicianDashboard /> : <div className="text-center py-20"><h1 className="text-2xl font-black text-gray-900">Access Denied</h1><p className="text-gray-500 mt-2">This portal is reserved for technicians.</p></div>} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component to handle role switching via URL
function RoleRedirect({ role }) {
  const { mockLoginAs } = useAuth();
  
  useEffect(() => {
    mockLoginAs(role);
  }, [role, mockLoginAs]);

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthWrapper />
      </Router>
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { currentUser } = useAuth();
  return currentUser ? <AppContent /> : <LandingPage />;
}

export default App;
