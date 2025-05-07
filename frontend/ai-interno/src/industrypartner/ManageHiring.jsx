import { useEffect, useState } from 'react';

const ManageHiring = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
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

        if (!response.ok) {
          throw new Error("Failed to fetch assessments");
        }

        const data = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleAction = async (action, internshipId, candidateId) => {
    console.log("Internship ID:", internshipId);  // Debugging log
    console.log("Candidate ID:", candidateId);  // Debugging log
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage. Please login first.");
        return;
      }
  
      // Ensure that internshipId and candidateId are correctly passed
      const url = `/api/assessments/${internshipId}/candidates/${candidateId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to perform action");
      }
  
      alert(`Action ${action} successful`);
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm">
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
  onClick={() => handleAction('hire', assessment._id, candidate._id)}
>
  Hire
</button>
<button 
  className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
  onClick={() => handleAction('reject', assessment._id, candidate._id)}
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
