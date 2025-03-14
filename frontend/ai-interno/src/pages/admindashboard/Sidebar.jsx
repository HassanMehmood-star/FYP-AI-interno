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
    navigate("/Admin_login");  // Change "/login" to your login route
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
            to="/admindashboard"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </span>
            Dashboard
          </Link>

          <Link
            to="/admindashboard/notifications"
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
                  d="M12 8v4m0 0v4m0-4H8m4 0h4"
                />
              </svg>
            </span>
            Notifications
          </Link>

          <Link
  to="/admindashboard/feedback"
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
        d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2M9 12h6m-6 4h3"
      />
    </svg>
  </span>
  Feedback 
</Link>

<Link
  to="/admindashboard/hallofFame"
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
        d="M8 21h8m-4-8v8M7 4h10l1.38 7.61A2 2 0 0 1 16.41 14H7.59a2 2 0 0 1-1.97-2.39L7 4z"
      />
    </svg>
  </span>
  Hall of Fame
</Link>


<Link
  to="/admindashboard/dataanalytics"
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
        d="M3 13l4 4L16 7l5 5M5 12l4 4L18 8l4 4M3 4h18M3 4l2 16h12l2-16"
      />
    </svg>
  </span>
  Data Analytics
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
