import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserHeader = ({ userName, profilePicture }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Initial mode set to dark

  // Demo data fallback if no props are passed
  const demoUserName = userName || 'Jane Doe'; // Default name
  const demoProfilePicture = profilePicture || 'https://randomuser.me/api/portraits/women/44.jpg'; // Default profile picture

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 shadow-md`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Platform Name */}
        <div className="text-2xl font-semibold">
          <Link to="/" className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>AI-Interno</Link>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`${isDarkMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} p-2 rounded-full focus:outline-none`}
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>

        {/* Mobile Menu Toggle Button */}
        <button
          className="text-current md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Navigation Menu (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/user_dashboard" className={`${isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-gray-300'} px-4 py-2 rounded-md`}>Dashboard</Link>
          <Link to="/user_dashboard/my_tasks" className={`${isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-gray-300'} px-4 py-2 rounded-md`}>My Tasks</Link>
          <Link to="/user_dashboard/performance" className={`${isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-gray-300'} px-4 py-2 rounded-md`}>Performance</Link>
          <Link to="/user_dashboard/messages" className={`${isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-gray-300'} px-4 py-2 rounded-md`}>Messages</Link>

          {/* User Profile with Profile Picture and Name */}
          <div className="relative">
            <button className={`${isDarkMode ? 'hover:bg-blue-500' : 'hover:bg-gray-300'} flex items-center space-x-2 px-4 py-2 rounded-md`}>
              <img
                src={demoProfilePicture}
                alt="User Profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{demoUserName}</span>
            </button>
            {/* Dropdown Menu */}
            <div className={`absolute right-0 mt-2 w-48 ${isDarkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'} shadow-lg rounded-md hidden group-hover:block`}>
              <Link to="/user_dashboard/settings" className="block px-4 py-2">Settings</Link>
              <Link to="/logout" className="block px-4 py-2">Logout</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Visible on Mobile) */}
      {isMobileMenuOpen && (
        <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-gray-200'} md:hidden p-4 space-y-2`}>
          <Link to="/user_dashboard" className="block hover:bg-blue-500 px-4 py-2 rounded-md">Dashboard</Link>
          <Link to="/user_dashboard/my_tasks" className="block hover:bg-blue-500 px-4 py-2 rounded-md">My Tasks</Link>
          <Link to="/user_dashboard/performance" className="block hover:bg-blue-500 px-4 py-2 rounded-md">Performance</Link>
          <Link to="/user_dashboard/messages" className="block hover:bg-blue-500 px-4 py-2 rounded-md">Messages</Link>

          {/* Profile Section */}
          <div className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-blue-500">
            <img
              src={demoProfilePicture}
              alt="User Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>{demoUserName}</span>
          </div>
          <Link to="/user_dashboard/settings" className="block px-4 py-2">Settings</Link>
          <Link to="/logout" className="block px-4 py-2">Logout</Link>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
