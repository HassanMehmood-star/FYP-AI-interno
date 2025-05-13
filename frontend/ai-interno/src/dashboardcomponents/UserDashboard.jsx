import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Simplified Button component
const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded-md text-white bg-teal-500 hover:bg-teal-600 ${className}`} {...props}>
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
  const [userId, setUserId] = useState(null);
  const [testSchedule, setTestSchedule] = useState(null);
  const [tasks, setTasks] = useState([]); // State for program tasks
  const [isProgramEnrolled, setIsProgramEnrolled] = useState(false); // State for program enrollment
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get('/api/getUserDetails', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data && response.data._id) {
          setUserDetails(response.data);
          setUserId(response.data._id);
          console.log('User details:', response.data);
        } else {
          console.error("No user ID returned", response.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const fetchInternshipDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await axios.get('/api/getInternshipPreferences', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setInternshipDetails(response.data);
    } catch (error) {
      console.error('Error fetching internship details:', error);
      setInternshipDetails({});
    }
  };

  useEffect(() => {
    fetchInternshipDetails();
  }, []);

  useEffect(() => {
    const fetchTestSchedule = async () => {
      try {
        const response = await axios.get('/api/test-details', {
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
  }, []);

  // Fetch tasks for hired candidate based on userId
  useEffect(() => {
    const fetchHiredCandidateTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          console.error("Token or userId not found");
          return;
        }

        const response = await axios.get('/api/hired-candidate-tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        });

        console.log('Hired candidate tasks response:', response.data);

        if (response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
          setTasks(response.data.data);
          setIsProgramEnrolled(true);
        } else {
          setTasks([]);
          setIsProgramEnrolled(false);
        }
      } catch (error) {
        console.error('Error fetching hired candidate tasks:', error);
        setError(error.message || 'An error occurred while fetching tasks');
        setIsProgramEnrolled(false);
      }
    };

    if (userId) {
      fetchHiredCandidateTasks();
    }
  }, [userId]);

  const { name = 'User' } = userDetails || {};
  const { career = 'Not provided', startDate = 'Not provided', duration = 'Not provided', hours = 'Not provided' } = internshipDetails || {};
  const formattedStartDate = startDate && new Date(startDate).toLocaleDateString('en-US');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Main Profile Card */}
      <div className="bg-gray-50 p-1 rounded-xl">
        <Card className="mx-auto max-w-6xl overflow-hidden text-white !bg-teal-800">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white">
                  <div className="flex h-full w-full items-center justify-center bg-white text-[#0A3A3A] text-3xl font-bold">
                    {name ? name[0] : 'N/A'}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{name}</h1>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <InfoBox title="Looking for career in" content={career} />
              <InfoBox title="Available to join from" content={formattedStartDate} />
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

          {/* Schedule Test Card */}
          <Card className="bg-gray-50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A3A3A] text-white">2</div>
                  <h2 className="text-xl font-bold text-[#0A3A3A]">Schedule Test</h2>
                  {testScheduled ? (
                    <span className="rounded-full bg-teal-500 text-white px-3 py-1 text-sm font-semibold">Unlocked</span>
                  ) : (
                    <span className="rounded-full bg-red-500 text-white px-3 py-1 text-sm font-semibold">Test not scheduled</span>
                  )}
                </div>
                <button className="text-gray-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 24">
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

          {/* Your Program Card */}
          <Card className="bg-gray-50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A3A3A] text-white">3</div>
                  <h2 className="text-xl font-bold text-[#0A3A3A]">Your Program</h2>
                  {isProgramEnrolled ? (
                    <span className="rounded-full bg-teal-500 text-white px-3 py-1 text-sm font-semibold">Unlocked</span>
                  ) : (
                    <span className="rounded-full bg-red-500 text-white px-3 py-1 text-sm font-semibold">Program Not Enrolled</span>
                  )}
                </div>
                <button className="text-gray-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isProgramEnrolled && tasks.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Assigned Tasks</h3>
                  <ul className="mt-2 space-y-4">
                    {tasks.map((task) => (
                      <li key={task._id} className="border-b pb-2">
                        <p className="font-medium text-[#0A3A3A]">{task.title}</p>
                        <p className="text-gray-600">{task.description}</p>
                      </li>
                    ))}
                  </ul>
                  <Link to="/dashboard/ProgramPortal">
                    <button className="mt-4 w-full bg-teal-500 text-white px-4 py-2 rounded-full">
                      Go to Program Portal
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-gray-600">No tasks available. You are not enrolled in any program.</p>
                  <button className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-full cursor-not-allowed" disabled>
                    Program Not Enrolled
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <Card className="h-fit">
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold">Internship Start Date</h3>
              <p className="text-gray-600">{formattedStartDate}</p>
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
              <p className="text-gray-600">AI-Interno</p>
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