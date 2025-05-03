import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Reusable Button component
const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md text-white bg-teal-600 hover:bg-teal-700 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Reusable Card component
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [internshipDetails, setInternshipDetails] = useState({});
  const [testSchedule, setTestSchedule] = useState(null);
  const [error, setError] = useState(null);

  // Combined fetch effect
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return console.error("Token not found");

        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, internshipRes, testRes] = await Promise.all([
          axios.get('/api/getUserDetails', { headers }),
          axios.get('/api/getInternshipPreferences', { headers }),
          axios.get('/api/getTestSchedule', { headers }),
        ]);

        // User details
        if (userRes.data && userRes.data._id) setUserDetails(userRes.data);

        // Internship details
        if (internshipRes.data) setInternshipDetails(internshipRes.data);

        // Test schedule
        if (testRes.data?.status === 'success' && testRes.data.data) {
          setTestSchedule(testRes.data.data);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred');
      }
    };

    fetchAll();
  }, []);

  const name = userDetails?.name || 'User';
  const career = internshipDetails.career || 'Not provided';
  const startDate = internshipDetails.startDate
    ? new Date(internshipDetails.startDate).toLocaleDateString('en-US')
    : 'Not provided';
  const duration = internshipDetails.duration || 'Not provided';
  const hours = internshipDetails.hours || 'Not provided';
  const testScheduled = Boolean(testSchedule);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-gray-50 p-1 rounded-xl">
        <Card className="mx-auto max-w-6xl text-white !bg-teal-800">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white text-[#0A3A3A] text-3xl font-bold flex items-center justify-center">
                  {name[0]}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{name}</h1>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <InfoBox title="Looking for career in" content={career} />
              <InfoBox title="Available to join from" content={startDate} />
              <InfoBox title="Available for" content={`${duration} (${hours} hours/week)`} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr,300px]">
        <div className="space-y-4">
          <Link to="/dashboard/UserApplication">
            <Card>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#0A3A3A] text-white">1</div>
                  <h2 className="text-xl font-bold text-[#0A3A3A]">Application</h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">You are here</span>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="bg-gray-50">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#0A3A3A] text-white">2</div>
                  <h2 className="text-xl font-bold text-[#0A3A3A]">Schedule Test</h2>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${testScheduled ? 'bg-teal-500' : 'bg-red-500'}`}>
                    {testScheduled ? 'Unlocked' : 'Test not scheduled'}
                  </span>
                </div>
              </div>

              {testScheduled && (
                <div className="mt-2 text-gray-700">
                  <p>Test Date: {new Date(testSchedule.testDate).toLocaleDateString()}</p>
                  <p>Test Time: {testSchedule.testTime}</p>
                </div>
              )}

              {testScheduled ? (
                <Link to="/dashboard/TestSchedule">
                  <Button className="w-full mt-4 rounded-full">Go to Test Portal</Button>
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
            <SidebarItem title="Internship Start Date" content={startDate} />
            <SidebarItem title="Career Field" content={career} />
            <SidebarItem title="Availability" content={`${duration} (${hours} hours/week)`} />
            <SidebarItem title="Partner" content="AI-Interno" />
          </div>
        </Card>
      </div>
    </div>
  );
};

const InfoBox = ({ title, content }) => (
  <div>
    <p className="text-sm text-gray-300">{title}</p>
    <p className="mt-1 text-lg font-medium">{content}</p>
  </div>
);

const SidebarItem = ({ title, content }) => (
  <div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default UserDashboard;
