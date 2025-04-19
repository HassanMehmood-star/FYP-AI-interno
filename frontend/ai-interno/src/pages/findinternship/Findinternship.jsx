import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Calendar, Users } from "lucide-react";


const FindInternship = () => {
  const [internshipData, setInternshipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);  // Initialize user state

  useEffect(() => {
    // Fetch user data from localStorage when the component loads
    const storedUser = localStorage.getItem('user');
    console.log('Stored user:', storedUser); // Debugging log to verify what's in localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Set user data from localStorage
    }

    // Fetch internship data
  
      const fetchInternships = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/internships');
          console.log("Fetched internships:", response.data); // Check if `createdBy` exists
          setInternshipData(response.data);
        } catch (err) {
          console.error("Error fetching internship data:", err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchInternships();
    }, []);
     // Run only on initial render

     const applyToInternship = async (internshipId, industryPartnerName) => {
      if (!user) {
        alert('Please log in to apply');
        return;
      }
    
      // Log the user object to verify it contains the necessary fields
      console.log("Applying with user:", user);
      
      // Check if user object contains required fields
      if (!user.name || !user.userId) {
        alert('User data is incomplete.');
        return;
      }
    
      try {
        const applicationData = {
          userName: user.name,  // Get user name from the stored user
          userId: user.userId,  // Get userId from stored user
          internshipProgramId: internshipId,
          industryPartnerName: industryPartnerName,  // Ensure industryPartnerName is passed correctly
        };
    
        // Debugging: Log the application data before sending it
        console.log("Application data being sent:", applicationData);
    
        const response = await axios.post('http://localhost:5000/api/apply', applicationData);
    
        // Check the response data
        console.log("Response from backend:", response.data);
    
        if (response.data.success) {
          alert('Application submitted successfully!');
        } else {
          alert(response.data.message);  // Display error message from backend
        }
      } catch (err) {
        // Catch and log any errors that occur during the API request
        console.error("Error applying to internship:", err);
        alert('An error occurred while applying. Please try again later.');
      }
    };
    
    
  
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white relative">

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Internship Requirements</h1>
          <p className="text-gray-500 mt-1">Craft your internship requirements to find ideal candidates effortlessly</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <label htmlFor="search" className="text-sm text-gray-500 mb-1 block">
            Search internship by name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Search internship by name"
            />
          </div>
        </div>
      </div>

     

      {/* Display internships or "No internships at this time" message */}
      {internshipData.length === 0 && !loading && (
        <p className="text-center text-lg text-gray-500 py-4">No internships at this time</p>
      )}

{internshipData.length > 0 && !loading && internshipData.map((userData) => (
  <div key={userData._id} className="max-w-5xl mx-auto p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg mt-4 border border-gray-100">
    {/* Internship Details */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 hover:text-green-700 transition duration-200">{userData.title}</h1>
        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <span className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {userData.department}
          </span>
          <span className="mx-2">•</span>
          <span className="text-sm">{userData.careerField}</span>
        </div>
      </div>
      <div className="flex items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {userData.status}
        </span>
      </div>
    </div>

    {/* Level of Internship */}
    <div className="mb-6">
  <div className="flex items-center gap-2">
    <h2 className="text-lg font-semibold text-gray-800">Internship Level:</h2>
    <p className="text-sm text-gray-600">
      {userData.level ? userData.level.charAt(0).toUpperCase() + userData.level.slice(1) : "Not Specified"}
    </p>
  </div>
</div>


    {/* Intern Will Learn */}
    <div className="mb-6">
  <div className="flex items-center gap-2">
    <h2 className="text-lg font-semibold text-gray-800">Intern Will Learn:</h2>
    <div className="flex gap-3">
      {userData.skillInternWillLearn.map((skill, index) => (
        <span key={index} className="text-sm text-gray-600">{skill}</span>
      ))}
    </div>
  </div>
</div>


    {/* Role Description */}
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800">Role Description:</h2>
      <p className="text-sm text-gray-600">{userData.roleDescription}</p>
    </div>

    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center text-gray-600 mb-4">
        <Calendar className="h-5 w-5 mr-2" />
        <span>Created on {new Date(userData.createdAt).toLocaleDateString()} by {userData.createdBy.name}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            console.log("Debug: Internship Data ->", userData);
            console.log("Debug: Created By ->", userData.createdBy);
            console.log("Debug: Industry Partner Name ->", userData.createdBy ? userData.createdBy.name : "Not Available");

            applyToInternship(userData._id, userData.createdBy ? userData.createdBy.name : "Unknown");
          }}
          className="flex items-center text-gray-700 hover:text-gray-900 text-sm py-2 px-4 border rounded-lg transition duration-200 hover:bg-gray-100"
        >
          <Users className="h-5 w-5 mr-2" />
          Apply Here
        </button>
      </div>
    </div>
  </div>
))}



    </div>
  );
};

export default FindInternship;
