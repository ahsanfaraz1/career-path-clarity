
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Home, Briefcase, FileText } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">SmartJobTracker</Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center hover:text-blue-300">
                <Briefcase size={18} className="mr-1" />
                Dashboard
              </Link>
              <Link to="/profile" className="flex items-center hover:text-blue-300">
                <User size={18} className="mr-1" />
                Profile
              </Link>
              <Link to="/resume-feedback" className="flex items-center hover:text-blue-300">
                <FileText size={18} className="mr-1" />
                Resume Feedback
              </Link>
              <button 
                onClick={logout} 
                className="flex items-center hover:text-blue-300"
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">Login</Link>
              <Link to="/register" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 absolute left-0 right-0 z-10 p-4 border-t border-gray-700">
          <div className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center hover:text-blue-300 py-2"
                  onClick={closeMenu}
                >
                  <Briefcase size={18} className="mr-2" />
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center hover:text-blue-300 py-2"
                  onClick={closeMenu}
                >
                  <User size={18} className="mr-2" />
                  Profile
                </Link>
                <Link 
                  to="/resume-feedback" 
                  className="flex items-center hover:text-blue-300 py-2"
                  onClick={closeMenu}
                >
                  <FileText size={18} className="mr-2" />
                  Resume Feedback
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }} 
                  className="flex items-center hover:text-blue-300 py-2 text-left"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-blue-300 py-2"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-center"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
