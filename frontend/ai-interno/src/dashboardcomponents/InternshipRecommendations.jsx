import React, { useState, useEffect } from 'react';

const InternshipRecommendations = () => {
  const [internships, setInternships] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError(null);
      setMessage('');

      try {
        // Fetch userId from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No user ID found in localStorage. Please log in.');
          setLoading(false);
          return;
        }

        // Make GET request to backend with userId in x-user-id header
        const response = await fetch('/api/routes/recommend-internships', {
          method: 'GET',
          headers: {
            'x-user-id': userId,
          },
        });

        const data = await response.json();

        console.log("Shwing Data: ", data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch internships');
        }

        // Set internships and message from response
        setInternships(data.internships);
        setMessage(data.message);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching internships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Recommended Internships
      </h1>

      {loading && (
        <div className="text-center">
          <p className="text-gray-600">Loading internships...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {message && !error && !loading && (
        <p className="text-gray-600 mb-4">{message}</p>
      )}

      {internships.length > 0 ? (
        <div className="grid gap-4">
          {internships.map((internship, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {internship.title}
              </h2>
              <p className="text-gray-600">Company: {internship.company}</p>
              <p className="text-gray-600">
                Skills: {internship.skillInternWillLearn.join(', ')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && <p className="text-gray-600">No internships available.</p>
      )}
    </div>
  );
};

export default InternshipRecommendations;