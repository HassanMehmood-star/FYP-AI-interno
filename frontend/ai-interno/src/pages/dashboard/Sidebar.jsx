import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";

import { ChatAltIcon } from '@heroicons/react/solid'; // Import the icon
import { faHome } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from "react-router-dom"; 
import { FaRegComments } from "react-icons/fa"; 
import {

  faComments,
  faUserFriends,
  faGauge,
  faCartShopping,
  faChartLine,
  faChalkboardTeacher ,
  faCalendarAlt,
  faUser,
  faChevronDown,
  faChevronUp,
  faTasks,
  faEdit,
  faRightFromBracket,
  faBars, // Icon for toggle button
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const navigate = useNavigate(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isFormsOpen, setIsFormsOpen] = useState(false);

  const handleLogout = () => {
  
    // Clear session data (e.g., remove token)
    console.log('hassan');  // This will print "hassan" to the console when the function is called
  
    // Clear the authentication token from localStorage (if you're using it)
    // localStorage.removeItem('token');  // Uncomment this if you're storing the token in localStorage
  
    // Optionally, clear other user-related data
    // localStorage.removeItem('userData'); // Uncomment if you're storing additional user data
  
    // Redirect to the login page or home page
    navigate('/user_login');  // Use your desired route here
  };
  

  return (

    
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden text-white bg-gray-900 p-2 fixed top-3 left-3 z-50 rounded-md shadow-md"
      >
        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 w-[200px] bg-gray-900 text-white h-screen p-3 border-r border-gray-700 shadow-xl rounded-xl fixed top-0 z-40`}
        style={{
          left: "4px", // Sidebar offset from the left
        }}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-10">
          <div className="text-white text-2xl font-semibold transform hover:scale-105 transition-transform duration-300">
            AI-interno
          </div>
        </div>

        {/* Menu */}
        <ul className="space-y-3">


        <li>
            <a
              href="/dashboard"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
         <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              <span className="text-[14px] font-normal">Dashboard</span>
            </a>
          </li>

          {/* Dashboard */}
          {/* <li>
            <a
              href="/dashboard/profile-overview"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
           <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <span className="text-[14px] font-normal">Profile Overview</span>
            </a>
          </li> */}

          {/* eCommerce */}
          {/* <li>
            <a
              href="/dashboard/profile-complete"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
             <FontAwesomeIcon icon={faUserEdit} className="w-4 h-4" />
<span className="text-[14px] font-normal">Complete Profile</span>

            </a>
          </li> */}


 <li>
            <a
              href="/dashboard/ViewProfile"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
           <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <span className="text-[14px] font-normal">View Profile</span>
            </a>
          </li>

          {/* Analytics */}
          <li>
            <a
              href="/dashboard/learning-resource"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
             <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
              <span className="text-[14px] font-normal">Learning Resources</span>
            </a>
          </li>

          {/* Calendar */}
          <li>
            <a
              href="/dashboard/find-internship"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
              <span className="text-[14px] font-normal">Find Internship</span>
            </a>
          </li>

          {/* Profile */}
          <li>
            <a
              href="/dashboard/hallofFame"
              className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <span className="text-[14px] font-normal">Hall of Fame</span>
            </a>
          </li>

          {/* Task Dropdown */}
          <li>
  <div>
    {/* Change Task to Chat with Chat Icon */}
    <button
      onClick={() => setIsTaskOpen(!isTaskOpen)}
      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105 w-full"
    >
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faComments} className="w-4 h-4" /> {/* Chat Icon */}
        <span className="text-[14px] font-normal">Chat</span>
      </div>
      <FontAwesomeIcon
        icon={isTaskOpen ? faChevronUp : faChevronDown}
        className="w-3 h-3"
      />
    </button>

    {/* Replace List and Kanban with InternChat and MentorChat */}
    <ul
      className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
        isTaskOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <li>
        <a
          href="/dashboard/internchat"
          className=" py-1 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 text-xs font-light flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faUserFriends} className="w-4 h-4" /> {/* InternChat Icon */}
          <span>InternChat</span>
        </a>
      </li>
      {/* <li>
        <a
          href="/dashboard/mentorchat"
          className=" py-1 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 text-xs font-light flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faChalkboardTeacher} className="w-4 h-4" /> 
          <span>MentorChat</span>
        </a>
      </li> */}
    </ul>
  </div>
</li>


          {/* Forms Dropdown */}
          <li>
            <div>
              <button
                onClick={() => setIsFormsOpen(!isFormsOpen)}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105 w-full"
              >
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  <span className="text-[14px] font-normal">Feedack</span>
                </div>
                <FontAwesomeIcon
                  icon={isFormsOpen ? faChevronUp : faChevronDown}
                  className="w-3 h-3"
                />
              </button>
              <ul
                className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                  isFormsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <li>
      <a
        href="/dashboard/giveFeedback"
        className="py-1 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 text-xs font-light flex items-center space-x-2"
      >
        <ChatAltIcon className="h-5 w-5 text-gray-500" /> {/* Icon for feedback */}
        <span>Give Feedback</span>
      </a>
    </li>
                {/* <li>
                  <a
                    href="#"
                    className="block py-1 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 text-xs font-light"
                  >
                    Form Layout
                  </a>
                </li> */}
                {/* <li>
                  <a
                    href="#"
                    className="block py-1 px-3 rounded-md hover:bg-gray-800 hover:text-white transition-all duration-200 text-xs font-light"
                  >
                    Form Validation
                  </a>
                </li> */}
              </ul>
            </div>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="absolute bottom-3 w-44">
          <button
            className="flex items-center space-x-2 bg-gray-800 text-white py-2 px-3 rounded-md hover:bg-red-500 transition-all duration-200 transform hover:scale-105 w-full"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
            <span className="text-[14px] font-normal">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
