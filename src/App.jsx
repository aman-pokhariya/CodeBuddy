import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Analyzer from './pages/Analyzer';
// import History from './pages/History';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes - to be implemented */}
        {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
        {/* <Route path="/analyzer" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} /> */}
        {/* <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} /> */}
        
        <Route path="*" element={<div className="flex items-center justify-center h-screen text-white">Page not found</div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
