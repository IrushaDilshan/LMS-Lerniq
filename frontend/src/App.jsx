import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, FileText, Settings, Bell, MessageSquare, Menu, Book } from 'lucide-react';
import QuizList from './components/quizzes/QuizList';
import QuizTake from './components/quizzes/QuizTake';
import InstructorQuizList from './components/quizzes/InstructorQuizList';
import QuizForm from './components/quizzes/QuizForm';
import AssignmentList from './components/assignments/AssignmentList';
import AssignmentSubmit from './components/assignments/AssignmentSubmit';
import InstructorAssignmentList from './components/assignments/InstructorAssignmentList';
import AssignmentForm from './components/assignments/AssignmentForm';
import InstructorAssignmentGrading from './components/assignments/InstructorAssignmentGrading';
import HomePage from './components/pages/HomePage';
import SettingsPage from './components/pages/SettingsPage';

function AppContent() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'My Courses', path: '/my-courses', icon: <Book className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'Assignments', path: '/assignments', icon: <FileText className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'Time Table', path: '/timetable', icon: <BookOpen className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'Forum', path: '/forum', icon: <MessageSquare className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
  ];

  const devLinks = [
    { name: 'Student Quizzes', path: '/quizzes', icon: <BookOpen className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'Manage Quizzes', path: '/instructor/quizzes', icon: <Book className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
    { name: 'Manage Assignments', path: '/instructor/assignments', icon: <FileText className="w-5 h-5 md:mr-3 mx-auto md:mx-0 flex-shrink-0" /> },
  ];

  return (
    <div className="flex h-screen bg-[#F0F4F8] font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#061224] text-white flex flex-col h-full rounded-r-3xl flex-shrink-0 shadow-2xl">
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
          <div className="border border-gray-600 rounded-2xl p-3 flex items-center space-x-3 bg-[#0a1930]">
             <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-200 border-2 border-orange-400 p-0.5">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4" alt="User Profile" className="w-full h-full rounded-full" />
             </div>
             <div>
               <p className="text-sm font-semibold">Hi, Alex</p>
               <p className="text-xs text-gray-400">E173037</p>
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

          <div className="mt-8 mb-2 px-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">Development</p>
            <div className="h-px bg-gray-700 mt-2 block md:hidden"></div>
          </div>

          {devLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center justify-center md:justify-start px-2 md:px-4 py-3.5 mt-2 rounded-xl transition-colors font-medium text-sm w-full max-w-[200px] mx-auto ${
                isActive(link.path)
                  ? 'bg-orange-500 text-white'
                  : 'text-orange-300 hover:bg-[#11233e] hover:text-orange-400'
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
        {/* Header - shown on all pages but we can customize per page if we want inline, 
            for now just top right icons */}
        <header className="absolute top-0 right-0 w-full p-8 flex justify-end items-center pointer-events-none z-10">
          <div className="flex space-x-4 pointer-events-auto">
            <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition">
              <Bell className="w-5 h-5 text-gray-800" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition">
              <MessageSquare className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* Student Routes */}
            <Route path="/quizzes" element={<QuizList courseId={1} />} />
            <Route path="/quizzes/:quizId/take" element={<QuizTake studentId={1} />} />
            
            {/* Instructor Routes */}
            <Route path="/instructor/quizzes" element={<InstructorQuizList courseId={1} />} />
            <Route path="/instructor/quizzes/new" element={<QuizForm courseId={1} />} />
            <Route path="/instructor/quizzes/:quizId/edit" element={<QuizForm courseId={1} />} />
            
            {/* Assignments Routes */}
            <Route path="/assignments" element={<AssignmentList courseId={1} />} />
            <Route path="/assignments/:assignmentId/submit" element={<AssignmentSubmit studentId={1} />} />
            
            {/* Instructor Assignment Routes */}
            <Route path="/instructor/assignments" element={<InstructorAssignmentList courseId={1} />} />
            <Route path="/instructor/assignments/new" element={<AssignmentForm courseId={1} />} />
            <Route path="/instructor/assignments/:assignmentId/edit" element={<AssignmentForm courseId={1} />} />
            <Route path="/instructor/assignments/:assignmentId/grade" element={<InstructorAssignmentGrading />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
