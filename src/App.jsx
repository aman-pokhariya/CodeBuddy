import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages - will be created soon
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Analyzer from './pages/Analyzer';
// import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Auth Routes - to be implemented */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          
          {/* Protected Routes - to be implemented */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/analyzer" element={<Analyzer />} /> */}
          {/* <Route path="/history" element={<History />} /> */}
          
          <Route path="*" element={<div className="flex items-center justify-center h-screen text-white">Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
