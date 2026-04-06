import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuizList from './components/quizzes/QuizList';
import QuizTake from './components/quizzes/QuizTake';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold tracking-wider">
                  Lerniq LMS
                </Link>
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/quizzes" className="hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                    Quizzes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center mt-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Lerniq LMS</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Access your course assessments, complete quizzes, and manage assignments from one central location.
                </p>
                <Link to="/quizzes" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300">
                  View Quizzes
                </Link>
              </div>
            } />
            
            <Route path="/quizzes" element={<QuizList courseId={1} />} />
            <Route path="/quizzes/:quizId/take" element={<QuizTake studentId={1} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
