import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const userInfo = authService.getUserInfo();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-30 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar}
            className="text-gray-500 hover:text-gray-700 mr-4 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {userInfo ? `Student ID: ${userInfo.studentId}` : 'Student'}
            </p>
            <p className="text-xs text-gray-500">Welcome back!</p>
          </div>
          <div className="relative group">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
              <i className="fas fa-user text-gray-600"></i>
            </div>
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 