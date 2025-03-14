import React, { useEffect, useState } from 'react'; 
import { FaUsers, FaIndustry } from 'react-icons/fa';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [industryPartnerCount, setIndustryPartnerCount] = useState(0);
  const [userDetails, setUserDetails] = useState([]);

  const [userPage, setUserPage] = useState(1);
  const [partnerPage, setPartnerPage] = useState(1);

  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [industryPartnerDetails, setIndustryPartnerDetails] = useState([]);
  
  const usersPerPage = 6;
  const partnersPerPage = 6;


  // Function to increment the count smoothly
  const incrementCount = (target, setter) => {
    let count = 0;
    const increment = () => {
      if (count < target) {
        count += Math.ceil(target / 1000); 
        setter(count);
      } else {
        setter(target); 
        clearInterval(interval);
      }
    };
    const interval = setInterval(increment, 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the count of users from the API
        const userResponse = await fetch('/api/user-count');
        const userData = await userResponse.json();
        const userTotal = userData.count;

        // Fetch the count of industry partners from the API
        const partnerResponse = await fetch('/api/partner-count');
        const partnerData = await partnerResponse.json();
        const partnerTotal = partnerData.count;

        // Call the increment function for user count and partner count
        incrementCount(userTotal, setUserCount);
        incrementCount(partnerTotal, setIndustryPartnerCount);

        // Fetch the actual user details
        const userDetailsResponse = await fetch('/api/user-details');
        const userDetailsData = await userDetailsResponse.json();

        if (Array.isArray(userDetailsData)) {
          // Log the entire data to check if status is correct
          console.log("Fetched user details data:", userDetailsData);
        
          const updatedUserDetails = userDetailsData.map((user) => {
            console.log(`User ID: ${user.id}, Status from DB: ${user.status}`); // Log the status
        
            return {
              ...user, // No need to change the status here, it's fetched as is
            };
          });
        
          setUserDetails(updatedUserDetails); // Set the state with the correct data
        }
        
        
        

        // Fetch the actual industry partner details
        const partnerDetailsResponse = await fetch('/api/partner-details');
        const partnerDetailsData = await partnerDetailsResponse.json();

        if (Array.isArray(partnerDetailsData)) {
          // Log the entire data to check if the status is correct
          console.log("Fetched partner details data:", partnerDetailsData);
        
          const updatedPartnerDetails = partnerDetailsData.map((partner) => {
            console.log(`Partner ID: ${partner._id}, Status from DB: ${partner.status}`); // Log the status
        
            return {
              ...partner, // No need to modify the status here, it's fetched directly from the database
            };
          });
        
          setIndustryPartnerDetails(updatedPartnerDetails); // Set the state with the fetched data
        }
        

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);




  const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
  const [userStatus, setUserStatus] = useState({});
  const [partnerStatus, setPartnerStatus] = useState({});

  const handleToggleStatus = (userId) => {
    // Toggle the status of the user on the frontend
    setUserDetails((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    );
  };
  

  const handle_ToggleStatus = (partnerId) => {
    setIndustryPartnerDetails((prevDetails) =>
      prevDetails.map((partner) =>
        partner._id === partnerId
          ? {
              ...partner,
              status: partner.status === "Active" ? "Inactive" : "Active", // Toggle status
            }
          : partner
      )
    );
  };


  const handleSave = async (userId) => {
    const updatedUser = userDetails.find((user) => user.id === userId);
  
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedUser.status }), // Send the updated status
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Status updated successfully:", result);
  
        // Update state with the saved status
        setUserDetails((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: updatedUser.status } : user
          )
        );
      } else {
        console.error("Failed to update status:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving status:", error);
    }
  };
  
  
  const handleEditClick = (userId) => {
    // Enable edit mode for the selected user
    setEditingUserId(userId);
  };
 



  const handle_EditClick = (partnerId) => {
    console.log("Editing Partner ID:", partnerId);
    setEditingPartnerId(partnerId); // Set the selected partner for editing
  };
  
  const handle_Save = async (partnerId) => {
    const partner = industryPartnerDetails.find(
      (partner) => partner._id === partnerId
    );
  
    try {
      const response = await fetch(`/api/industry-partners/${partnerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: partner.status }),
      });
  
      if (response.ok) {
        console.log("Status updated successfully");
        setEditingPartnerId(null); // Exit edit mode
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error while saving status:", error);
    }
  };
  


  // Logic to slice data for pagination
  const currentUsers = Array.isArray(userDetails)
    ? userDetails.slice((userPage - 1) * usersPerPage, userPage * usersPerPage)
    : [];
  const currentPartners = Array.isArray(industryPartnerDetails)
    ? industryPartnerDetails.slice((partnerPage - 1) * partnersPerPage, partnerPage * partnersPerPage)
    : [];

  // Function to format the date
  const formatDate = (date) => {
    try {
      if (!date) return "N/A"; // Handle missing or null dates
      const parsedDate = new Date(date); // Attempt to parse the date
      if (isNaN(parsedDate)) return "Invalid Date"; // Handle invalid dates
      return parsedDate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error); // Log any unexpected issues
      return "N/A";
    }
  };
  
  
  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      {/* Dashboard content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Registered Users Card */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg border border-gray-400 hover:bg-gray-50 transition duration-300">
          <div className="flex items-center">
            <FaUsers className="text-4xl text-blue-600 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Registered Users</h3>
              <p className="text-2xl font-bold text-gray-900">{`+${userCount}`}</p>
            </div>
          </div>
        </div>

        {/* Industry Partners Card */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg border border-gray-400 hover:bg-gray-50 transition duration-300">
          <div className="flex items-center">
            <FaIndustry className="text-4xl text-green-600 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Industry Partners</h3>
              <p className="text-2xl font-bold text-gray-900">{`+${industryPartnerCount}`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Users Details Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg border border-gray-400">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registered Users Details</h2>
        
        {/* Table for User Details */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date Registered</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              
            {currentUsers.map((user) => {
  const isEditing = user.id === editingUserId;

  return (
    <tr key={user.id} className="border-b border-gray-200">
      <td className="px-6 py-3 text-sm text-gray-900">{user.name}</td>
      {/* <p>status {user.status}</p> */}
      <td className="px-6 py-3 text-sm">
        <span
          className={`px-4 py-2 rounded-full ${
            user.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
           {user.status}
          
        </span>
      </td>
      <td className="px-6 py-3 text-sm text-gray-700">{formatDate(user.dateRegistered)}</td>
      <td>
        {editingUserId === user.id ? (
          // When editing, show toggle button
          <button
            onClick={() => handleToggleStatus(user.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-full"
          >
            {user.status === "Active"
              ? "Mark as Inactive"
              : "Mark as Active"}
          </button>
        ) : (
          // Show Edit button when not in edit mode
          <button
            onClick={() => handleEditClick(user.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            Edit
          </button>
        )}
        {editingUserId === user.id && (
          // Show Save button when editing
          <button
            onClick={() => handleSave(user.id)}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-full"
          >
            Save
          </button>
        )}
      </td>
    </tr>
  );
})}

            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setUserPage(userPage > 1 ? userPage - 1 : 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300"
          >
            Previous
          </button>
          <span>Page {userPage}</span>
          <button
            onClick={() => setUserPage(userPage < Math.ceil(userDetails.length / usersPerPage) ? userPage + 1 : userPage)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Industry Partners Details Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg border border-gray-400">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Industry Partners Details</h2>
        
        {/* Table for Industry Partners */}
       {/* Table for Industry Partners */}
<div className="overflow-x-auto">
  <table className="min-w-full table-auto">
    <thead>
      <tr className="border-b border-gray-300">
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th> {/* Add Status Column */}
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date Registered</th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
      </tr>
    </thead>
    <tbody>
    {currentPartners.map((partner) => {
      // console.log(currentPartners)
      // console.log("Partner Object:", partner);

  const currentStatus = partner.status || "Active"; // Default to "Active" if status is not defined
  const isEditing = partner._id === editingPartnerId;  // Update to use _id
  // Track which partner is being edited
// console.log(partner._id)
  return (
    <tr key={partner._id} className="border-b border-gray-200">
      <td className="px-6 py-3 text-sm text-gray-900">{partner.name}</td>
      <td className="px-6 py-3 text-sm">
      <span
                  className={`px-4 py-2 rounded-full ${
                    partner.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {partner.status}
                </span>
      </td>
      <td className="px-6 py-3 text-sm text-gray-700">{formatDate(partner.createdAt)}</td>
      <td>
                {editingPartnerId === partner._id ? (
                  // When editing, show toggle button
                  <button
                    onClick={() => handle_ToggleStatus(partner._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-full"
                  >
                    {partner.status === "Active"
                      ? "Mark as Inactive"
                      : "Mark as Active"}
                  </button>
                ) : (
                  // Show Edit button when not in edit mode
                  <button
                    onClick={() =>handle_EditClick(partner._id)
                      
                 
                    }

                    className="px-4 py-2 bg-blue-500 text-white rounded-full"
                  >
                    
                    Edit
                  </button>
                )}
                {editingPartnerId === partner._id && (
                  // Show Save button when editing
                  <button
                    onClick={() => handle_Save(partner._id)}
                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded-full"
                  >
                    Save
                  </button>
                )}
              </td>
    </tr>
  );
})}

    </tbody>
  </table>
</div>


        {/* Pagination Controls for Industry Partners */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPartnerPage(partnerPage > 1 ? partnerPage - 1 : 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300"
          >
            Previous
          </button>
          <span>Page {partnerPage}</span>
          <button
            onClick={() => setPartnerPage(partnerPage < Math.ceil(industryPartnerDetails.length / partnersPerPage) ? partnerPage + 1 : partnerPage)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
