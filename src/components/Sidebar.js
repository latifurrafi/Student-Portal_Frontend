import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import diuLogo from '../assets/DIU-Logo.png';

const Sidebar = ({ isOpen, currentPath }) => {
  const navigate = useNavigate();
  
  const navigationItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/profile', icon: 'fas fa-user', label: 'Student Profile' },
    { path: '/result', icon: 'fas fa-chart-line', label: 'Result' },
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('studentId');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className={`bg-diu-dark text-white transition-all duration-300 ease-in-out ${
      isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
    } fixed md:relative z-50 min-h-screen`}>
      {/* Logo Section */}
      <div className="h-16 border-b border-gray-700 flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={diuLogo} 
            alt="DIU Logo" 
            className="w-full h-full object-contain"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 overflow-hidden">
        <ul className="space-y-1">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm hover:bg-gray-700 transition-colors duration-200 ${
                  currentPath === item.path ? 'bg-gray-700' : ''
                }`}
              >
                <i className={`${item.icon} w-5 mr-3`}></i>
                {item.label}
                {item.label === 'Certificate & Transcript' && (
                  <i className="fas fa-chevron-right ml-auto"></i>
                )}
              </Link>
            </li>
          ))}
          
          {/* Logout Button */}
          <li className="mt-4">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm hover:bg-red-600 transition-colors duration-200 w-full text-left"
            >
              <i className="fas fa-sign-out-alt w-5 mr-3"></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 