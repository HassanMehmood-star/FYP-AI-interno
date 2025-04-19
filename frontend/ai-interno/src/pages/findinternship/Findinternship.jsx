import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Calendar, Users } from "lucide-react";

const FindInternship = () => {
  const [internshipData, setInternshipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");  // Initialize user state
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    // Fetch user data from localStorage when the component loads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Set user data from localStorage
    }

    const fetchInternships = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/internships');
        setInternshipData(response.data);
        setFilteredInternships(response.data); // Initially, display all internships
      } catch (err) {
        console.error("Error fetching internship data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    const filtered = internshipData.filter((internship) =>
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
    );
    setFilteredInternships(filtered);
  }, [searchQuery, internshipData]);

  const applyToInternship = async (internshipId, industryPartnerName) => {
    if (!user) {
      alert('Please log in to apply');
      return;
    }

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

      const response = await axios.post('http://localhost:5000/api/apply', applicationData);

      if (response.data.success) {
        setSuccessMessage("Application submitted successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        alert(response.data.message);  // Display error message from backend
      }
    } catch (err) {
      console.error("Error applying to internship:", err);
      alert('An error occurred while applying. Please try again later.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white relative">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 mb-4 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Internship Requirements</h1>
          <p className="text-gray-500 mt-1">Craft your internship requirements to find ideal candidates effortlessly</p>
        </div>
      </div>

      {/* Search Box */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
          </div>
        </div>
      </div>

      {/* Display internships or "No internships at this time" message */}
      {internshipData.length === 0 && !loading && (
        <p className="text-center text-lg text-gray-500 py-4">No internships at this time</p>
      )}

      {/* Render internships */}
      {filteredInternships.length > 0 ? (
        <div className="space-y-6">
          {filteredInternships.map((internship) => (
            <div key={internship._id} className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm mt-4 border border-gray-100">
              {/* Internship Details */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-xl font-bold">{internship.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {internship.department}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{internship.careerField}</span>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {internship.status}
                </div>
              </div>

              {/* Intern Will Learn */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Intern Will Learn:</h2>
                <div className="space-x-3">
                  {internship.skillInternWillLearn.map((skill, index) => (
                    <span key={index} className="text-sm text-gray-600">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Internship Level */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Internship Level:</h2>
                <p className="text-sm text-gray-600">{internship.level ? internship.level.charAt(0).toUpperCase() + internship.level.slice(1) : "Not Specified"}</p>
              </div>

              {/* Role Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Role Description:</h2>
                <p className="text-sm text-gray-600">{internship.roleDescription}</p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center text-gray-600 mb-4">
                  <span>Created on {new Date(internship.createdAt).toLocaleDateString()} by {internship.createdBy.name}</span>
                </div>

                <button
                  onClick={() => applyToInternship(internship._id, internship.createdBy ? internship.createdBy.name : "Unknown")}
                  className="flex items-center text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-sm py-3 px-6 border rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 transform group-hover:scale-110 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Apply Here
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-gray-500">No internships found.</div>
      )}
    </div>
  );
};

export default FindInternship;
