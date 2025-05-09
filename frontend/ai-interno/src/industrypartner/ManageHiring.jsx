import { useEffect, useState } from 'react';

const ManageHiring = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        console.log('Fetching assessments...');
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found in localStorage. Please login first.");
          return;
        }

        const response = await fetch("/api/assessments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log('Received response:', response);
        if (!response.ok) {
          throw new Error("Failed to fetch assessments");
        }

        const data = await response.json();
        console.log('Fetched assessments data:', data);
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage('Failed to load assessments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleAction = async (action, assessment, candidate) => {
    if (action !== 'hire') return; // Only handle 'hire' for now

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please login first.');
        return;
      }

      const hiredCandidate = {
        internshipId: assessment.internshipId._id,
        candidate: {
          userId: candidate._doc.user,
          name: candidate._doc.name,
          email: candidate._doc.email,
        },
        hireDate: new Date().toISOString(),
      };

      const response = await fetch('/api/hired-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(hiredCandidate),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to hire candidate');
      }

      setMessage(result.message);
    } catch (error) {
      console.error('Error hiring candidate:', error);
      setMessage(error.message || 'Failed to hire candidate.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Hiring</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MCQ Answers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map((assessment, i) => (
                    assessment.candidates?.map((candidate, j) => (
                      <tr key={`${i}-${j}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {candidate?._doc?.name || 'No Name'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {candidate?._doc?.email || 'No Email'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {candidate.mcqAnswers?.map((answer, idx) => (
                              <div key={idx} className="text-sm text-gray-500">
                                Q{answer.questionIndex + 1}: {answer.selectedOption}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                              onClick={() => handleAction('hire', assessment, candidate)}
                            >
                              Hire
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
                              onClick={() => handleAction('reject', assessment, candidate)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHiring;