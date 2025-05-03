import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Simplified Button component
const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded-md text-white bg-teal-00 hover:bg-teal-600 ${className}`} {...props}>
    {children}
  </button>
);

// Simplified Card component
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [internshipDetails, setInternshipDetails] = useState(null);
  const [testScheduled, setTestScheduled] = useState(false);
  const [userId, setUserId] = useState(null); // Store the current userId
  const [testSchedule, setTestSchedule] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found");
          return;
        }

        // Fetch User Details
        const response = await axios.get('/api/getUserDetails', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Ensure user details are received correctly
        if (response.data && response.data._id) {
          setUserDetails(response.data);
          setUserId(response.data._id); // Set userId here
          console.log('User details:', response.data);
        } else {
          console.error("No user ID returned", response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []); // Empty array ensures it runs only once on mount

  const fetchInternshipDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token not found");
        return;
      }

      // Fetch Internship Preferences
      const response = await axios.get('/api/getInternshipPreferences', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setInternshipDetails(response.data); // Set internship details in state
    } catch (error) {
      console.error('Error fetching internship details:', error);
      // Allow dashboard to show even if internship details are missing
      setInternshipDetails({});
    }
  };

  useEffect(() => {
    fetchInternshipDetails();
  }, []); // Empty dependency array to run once when the component mounts

  // Fetch the test schedule once user details are available
  useEffect(() => {
    const fetchTestSchedule = async () => {
      try {
        const response = await axios.get('/api/getTestSchedule', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Test schedule response:', response.data);

        if (response.data.status === 'success' && response.data.data) {
          setTestSchedule(response.data.data);
          setTestScheduled(true);
        } else {
          setTestScheduled(false);
        }
      } catch (error) {
        console.error('Error fetching test schedule:', error);
        setError(error.message || 'An error occurred while fetching test schedule');
      }
    };

    fetchTestSchedule();
  }, []); // Run once on mount

  // Fallback when details are not available
  const { name = 'User' } = userDetails || {};
  const { career = 'Not provided', startDate = 'Not provided', duration = 'Not provided', hours = 'Not provided' } = internshipDetails || {};

  // Format startDate (if it's a valid date)
  const formattedStartDate = startDate && new Date(startDate).toLocaleDateString('en-US'); // Format MM/DD/YYYY

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Main Profile Card */}
      <div className="bg-gray-50 p-1 rounded-xl">
        <Card className="mx-auto max-w-6xl overflow-hidden text-white !bg-teal-800">
          <div className="p-6 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white">
                  <div className="flex h-full w-full items-center justify-center bg-white text-[#0A3A3A] text-3xl font-bold">
                    {name ? name[0] : 'N/A'} {/* Show first letter of name */}
                  </div>
                </div>

                {/* Name and Location */}
                <div>
                  <h1 className="text-3xl font-bold">{name}</h1>
                </div>
              </div>

              {/* View Profile Button */}
              {/* <Button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg transition">
                View Profile
              </Button> */}
            </div>

            {/* Info Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <InfoBox title="Looking for career in" content={career} />
              <InfoBox title="Available to join from" content={formattedStartDate} /> {/* Display formatted date */}
              <InfoBox title="Available for" content={`${duration} (${hours} hours/week)`} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr,300px]">
        <div className="space-y-4">
          {/* Application Progress */}
          <Link to="/dashboard/UserApplication">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A3A3A] text-white">1</div>
                    <h2 className="text-xl font-bold text-[#0A3A3A]">Application</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">You are here</span>
                  </div>
                  <button className="text-gray-500">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="bg-gray-50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A3A3A] text-white">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-[#0A3A3A]">Schedule Test</h2>
                  {testScheduled ? (
                    <span className="rounded-full bg-teal-500 text-white px-3 py-1 text-sm font-semibold">Unlocked</span>
                  ) : (
                    <span className="rounded-full bg-red-500 text-white px-3 py-1 text-sm font-semibold">Test not scheduled</span>
                  )}
                </div>
                <button className="text-gray-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {testScheduled && testSchedule && (
                <div>
                  <p>Test Date: {new Date(testSchedule.testDate).toLocaleDateString()}</p>
                  <p>Test Time: {testSchedule.testTime}</p>
                </div>
              )}

              {/* Button Inside the Card */}
              {testScheduled ? (
                <Link to="/dashboard/TestSchedule">
                  <button className="mt-4 w-full bg-teal-500 text-white px-4 py-2 rounded-full">
                    Go to Test Portal
                  </button>
                </Link>
              ) : (
                <button className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-full cursor-not-allowed" disabled>
                  Test not scheduled
                </button>
              )}
            </div>
          </Card>
          
        </div>

        {/* Sidebar */}
        <Card className="h-fit">
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold">Internship Start Date</h3>
              <p className="text-gray-600">{formattedStartDate}</p> {/* Display formatted date */}
            </div>

            <div>
              <h3 className="text-lg font-semibold">Career Field</h3>
              <p className="text-gray-600">{career}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Availability</h3>
              <p className="text-gray-600">{duration && hours ? `${duration} (${hours} hours/week)` : 'Not provided'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Partner</h3>
              <p className="text-gray-600">AI-Interno</p> {/* Static Partner */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

function InfoBox({ title, content }) {
  return (
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="mt-1 text-lg font-medium">{content}</p>
    </div>
  );
}

export default UserDashboard;
