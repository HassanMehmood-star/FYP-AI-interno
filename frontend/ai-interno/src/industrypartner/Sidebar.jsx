import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for hamburger menu


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility

  // Toggle the sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear any authentication-related data (e.g., localStorage, sessionStorage, cookies)
    localStorage.removeItem("userToken");  // Example, clear token or user data
    sessionStorage.removeItem("userToken");

    // Redirect to login page
    navigate("/industrtypartnerdashboard");  // Change "/login" to your login route
  };

  return (
    <div className="relative">
      {/* Hamburger Menu (Visible on small screens) */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button
          className="text-white text-3xl"
          onClick={toggleSidebar}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block h-[94vh] w-60 bg-[#1F2937] text-white flex flex-col rounded-l-lg rounded-r-lg shadow-lg mt-4 mb-4 ml-4 lg:static absolute z-40 transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center p-4 bg-[#111827] rounded-t-lg">
          <h2 className="text-xl font-semibold">Admin</h2>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex flex-col items-start px-3 py-4 space-y-3">
        <Link
  to=""
  className="flex items-center w-full py-2 px-4 text-lg font-medium rounded-lg text-gray-200 hover:bg-[#374151] transition duration-300"
>
  <span className="mr-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  </span>
  Dashboard
</Link>

        
<Link
  to="/industrtypartnerdashboard/Completeprofile"
  className="flex items-center w-full py-2 px-4 text-lg font-medium rounded-lg text-gray-200 hover:bg-[#374151] transition duration-300"
>
  <span className="mr-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  </span>
  Complete Profile
</Link>



<Link
  to="/industrtypartnerdashboard/ProfileReview"
  className="flex items-center w-full py-2 px-4 text-lg font-medium rounded-lg text-gray-200 hover:bg-[#374151] transition duration-300"
>
  <span className="mr-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  </span>
  Company Profile
</Link>

<Link
  to="/industrtypartnerdashboard/InternshipRequirement"
  className="flex items-center w-full py-2 px-4 text-lg font-medium rounded-lg text-gray-200 hover:bg-[#374151] transition duration-300"
>
  <span className="mr-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-4V3a1 1 0 00-1-1H9zM4 9h16M9 21v-6h6v6"
      />
    </svg>
  </span>
  Internship Requirements
</Link>




<Link
  to="/industrtypartnerdashboard/managehiring"
  className="flex items-center w-full py-2 px-4 text-lg font-medium rounded-lg text-gray-200 hover:bg-[#374151] transition duration-300"
>
  <span className="mr-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 2H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM9 2v4h6V2H9zM6 6h12v12H6V6z"
      />
    </svg>
  </span>
  Manage Hiring
</Link>




          <div className="absolute bottom-8 left-0 w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
