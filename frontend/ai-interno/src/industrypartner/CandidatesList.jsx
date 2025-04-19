import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Eye, Calendar } from 'lucide-react';

export default function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState([]); // Initialize as empty array
  const [filteredCandidates, setFilteredCandidates] = useState([]); // State to store filtered candidates
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query

  const location = useLocation();
  const navigate = useNavigate();
  const internshipId = new URLSearchParams(location.search).get('internshipId');

  useEffect(() => {
    if (internshipId) {
      const fetchCandidates = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/internships/${internshipId}/applicants`);
          setCandidates(response.data.applicants);
          setFilteredCandidates(response.data.applicants); // Initially, show all candidates
          setUserCount(response.data.applicants.length);
        } catch (err) {
          console.error('Error fetching applicants:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCandidates();
    }
  }, [internshipId]);

  // Handle the search input change and filter the candidates
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search
    setSearchQuery(query);

    // Filter the candidates based on the search query
    const filtered = candidates.filter((candidate) =>
      candidate.name.toLowerCase().includes(query) || candidate.email.toLowerCase().includes(query)
    );
    setFilteredCandidates(filtered); // Update the filtered list
  };

  const handleCheckboxChange = (candidate) => {
    setSelectedCandidates((prev) => {
      const isSelected = prev.includes(candidate.applicationId);
      if (isSelected) {
        return prev.filter(id => id !== candidate.applicationId); // Remove from selected
      } else {
        return [...prev, candidate.applicationId]; // Add to selected
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]); // Deselect all if all are selected
    } else {
      setSelectedCandidates(candidates.map((candidate) => candidate.applicationId)); // Select all
    }
  };

  const handleViewProfile = (userId) => {
    console.log('View Profile clicked for userId:', userId);
    navigate(`/industrtypartnerdashboard/ViewProfile/${userId}`);
  };

  const handleScheduleTest = () => {
    const selectedCandidatesData = candidates.filter(candidate =>
      selectedCandidates.includes(candidate.applicationId)
    );
    navigate(`/industrtypartnerdashboard/ScheduleTest/${internshipId}`, {
      state: { selectedCandidates: selectedCandidatesData, internshipId }
    });
  };

  const handleBackToInternship = () => {
    navigate('/industrtypartnerdashboard/InternshipRequirement');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <button onClick={handleBackToInternship} className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to Internship</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange} // Update the search query on input change
            />
          </div>
          <span className="text-gray-600">Interested Candidates: {userCount}</span>
        </div>

        {/* Table to display filtered candidates */}
        <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    onChange={handleSelectAllChange}
                    checked={selectedCandidates.length === filteredCandidates.length}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate.applicationId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        onChange={() => handleCheckboxChange(candidate)} 
                        checked={selectedCandidates.includes(candidate.applicationId)} 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                      <button
                        onClick={() => handleViewProfile(candidate.userId)} 
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No applicants yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Schedule Test Button */}
        <div className="mt-4">
          <button
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            disabled={selectedCandidates.length === 0}
            onClick={handleScheduleTest}
          >
            Schedule Test for Selected Candidates
          </button>
        </div>
      </div>
    </div>
  );
}
