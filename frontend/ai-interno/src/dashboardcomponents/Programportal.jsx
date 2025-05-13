import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Simplified Card component
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const ProgramPortal = () => {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('/api/getUserDetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data._id) {
          setUserId(response.data._id);
        } else {
          throw new Error('No user ID returned');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError(error.message || 'Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchHiredCandidateTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          console.error('Token or userId not found');
          return;
        }

        const response = await axios.get('/api/hired-candidate-tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId: userId,
          },
        });

        console.log('Hired candidate tasks response:', response.data);

        if (response.data.status === 'success' && response.data.data) {
          setTasks(response.data.data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Error fetching hired candidate tasks:', error);
        setError(error.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHiredCandidateTasks();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#0A3A3A] mb-4">Program Portal</h1>
          {loading ? (
            <p className="text-gray-600">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : tasks.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">Assigned Tasks</h2>
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task._id} className="border-b pb-2">
                    <p className="font-medium text-[#0A3A3A]">{task.title}</p>
                    <p className="text-gray-600">{task.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600">No tasks available.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProgramPortal;