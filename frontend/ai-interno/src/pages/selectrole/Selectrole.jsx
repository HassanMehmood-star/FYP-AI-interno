import React, { useState } from 'react';
import { FaUser, FaIndustry, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Selectrole = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      console.log("Selected Role:", selectedRole);
      // Redirect to the appropriate login page based on the selected role
      switch (selectedRole) {
        case 'User':
          window.location.href = '/user_login'; // Replace with your User login route
          break;
        case 'Industry Partner':
          window.location.href = '/industrypartner_login'; // Replace with your Industry Partner login route
          break;
        case 'Admin':
          window.location.href = '/admin_login'; // Replace with your Admin login route
          break;
        default:
          break;
      }
    } else {
      alert("Please select a role before continuing.");
    }
  };
  

  const handleBack = () => {
    navigate('/'); // Navigate back to the previous page
  };

  const renderIcon = (role) => {
    switch (role) {
      case 'User':
        return <FaUser className="w-16 h-16 mb-4 text-indigo-600" />;
      case 'Industry Partner':
        return <FaIndustry className="w-16 h-16 mb-4 text-indigo-600" />;
      case 'Admin':
        return <FaUserShield className="w-16 h-16 mb-4 text-indigo-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <h1 className="text-5xl font-bold my-4">
        Please Select a Role
      </h1>
      <p className="text-sm text-black0 mb-6 text-center">
        Choose a user role from the options below. Click on a box to select your role.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-400 px-9 py-">
        {/* User */}
        <div 
          onClick={() => handleRoleClick('User')}
          className={`flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 ${
            selectedRole === 'User' ? 'border-4 border-indigo-600' : 'border border-gray-300'
          }`}
        >
          {renderIcon('User')}
          <h2 className="font-medium text-lg">User</h2>
        </div>

        {/* Industry Partner */}
        <div 
          onClick={() => handleRoleClick('Industry Partner')}
          className={`flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 ${
            selectedRole === 'Industry Partner' ? 'border-4 border-indigo-600' : 'border border-gray-300'
          }`}
        >
          {renderIcon('Industry Partner')}
          <h2 className="font-medium text-lg">Industry Partner</h2>
        </div>

        {/* Admin */}
        <div 
          onClick={() => handleRoleClick('Admin')}
          className={`flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 ${
            selectedRole === 'Admin' ? 'border-4 border-indigo-600' : 'border border-gray-300'
          }`}
        >
          {renderIcon('Admin')}
          <h2 className="font-medium text-lg">Admin</h2>
        </div>
      </div>

      {/* Button Container */}
      <div className="mt-8 flex flex-row gap-4">
        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          className="flex items-center justify-center w-32 h-12 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Continue
        </button>
        
        {/* Back Button with Icon */}
        <button 
          onClick={handleBack}
          className="flex items-center justify-center w-32 h-12 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
    </div>
  );
};

export default Selectrole;
