import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
// import pic from '../../../../../mern-server/uploads/sample.jpeg'

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Fetch user details from the API
  useEffect(() => {
    const fetchUserDetails = async () => {
    
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/profile/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setUserName(response.data.user.name || "User");
         
          setUserRole(response.data.user.role || "Role");
          console.log("Profile Pic URL:", response.data.user.profilePic); // Debugging
          setProfilePic(response.data.user.profilePic); // Set the profile picture
        }
      } catch (err) {
        console.error("Error fetching user details:", err.response?.data || err.message);
      }
    };
  
    fetchUserDetails();
  }, []);
  
  return (
    <div className="flex justify-between items-center bg-white shadow-xl py-3 px-3">
      {/* Left Section (Icons) */}
      <div className="flex items-center space-x-4"></div>

      {/* Right Section (User Profile with Bell Icon) */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <h3 className="text-xs font-semibold">{userName}</h3>
          <p className="text-[10px] text-gray-500">UX Designer</p>
        </div>
        <div className="relative">
          {/* Bell Icon on Left */}
          <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-gray-100 rounded-full p-1">
            <BellIcon className="h-3 w-3 text-gray-500" />
          </div>
          {/* Profile Picture */}
          <img
  src={profilePic} // Fallback to default pic
  alt="User"
  className="rounded-full w-8 h-8"
/>

        </div>
        {/* Dropdown Icon */}
        <button className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faCircleChevronDown} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
