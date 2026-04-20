import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

/**
 * Navigation Bar Component
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-purple-400 transition-colors">
            <Code size={28} className="text-purple-500" />
            <span>CodeBuddy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/analyzer" className="text-gray-300 hover:text-white transition-colors">
                  Analyzer
                </Link>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors">
                  History
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">{user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analyzer"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                >
                  Analyzer
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                >
                  History
                </Link>
                <div className="px-4 py-2">
                  <p className="text-sm text-gray-400 mb-3">{user?.email}</p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="px-4 py-2 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
