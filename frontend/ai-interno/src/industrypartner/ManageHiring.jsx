import { useEffect, useState } from 'react';
import { FileText, Code, Download } from 'lucide-react';

const ManageHiring = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve the token from localStorage
        console.log('Token retrieved from localStorage:', token);  // Log the token

        if (!token) {
          console.error("No token found in localStorage. Please login first.");
          return;
        }

        const response = await fetch("/api/assessments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Send the token in the Authorization header
          },
        });

        console.log('Response status:', response.status);  // Log the response status

        if (!response.ok) {
          throw new Error("Failed to fetch assessments");
        }

        const data = await response.json();
        console.log('Data fetched from API:', data);  // Log the fetched data
        setAssessments(data);  // Set assessments to state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);  // Empty dependency array means this runs once when the component mounts

  const handleDownload = (fileUrl) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop();  // Set the file name from the URL
    link.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  const handleAction = async (candidateId, assessmentId, action) => {
    try {
      const token = localStorage.getItem('token');  // Retrieve the token from localStorage
      if (!token) {
        console.error("No token found in localStorage. Please login first.");
        return;
      }
  
      const response = await fetch("/api/hire-reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessmentId,
          candidateId,
          action,  // "hire" or "reject"
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update candidate status");
      }
  
      const data = await response.json();
      console.log(data.message);
      // Optionally, re-fetch assessments to show updated status
      setAssessments(prev => prev.map(assessment => 
        assessment._id === assessmentId ? { ...assessment, candidates: assessment.candidates.map(candidate => 
          candidate._id === candidateId ? { ...candidate, status: action } : candidate
        )} : assessment
      ));
  
    } catch (error) {
      console.error("Error handling hire/reject:", error);
    }
  };
  
  

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
      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th> */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test File</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution File</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Name</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship ID</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>  */}
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {assessments.map((assessment, i) => (
      assessment.candidates.map((candidate, j) => (
        <tr key={`${i}-${j}`} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.user}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.email}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                <FileText className="h-3 w-3 mr-1" />
                {assessment.testFile}
              </span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleDownload(assessment.testFile)}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                <Code className="h-3 w-3 mr-1" />
                {assessment.solutionFile}
              </span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleDownload(assessment.solutionFile)}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {assessment.testDate ? new Date(assessment.testDate).toLocaleDateString() : 'N/A'}
          </td>
          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {assessment.internshipId ? assessment.internshipId.title : 'N/A'}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {assessment.internshipId ? assessment.internshipId._id : 'N/A'}
</td> */}
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {candidate.user ? candidate.user.name : 'N/A'}  {/* Assuming 'user' is populated */}
</td>

          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {candidate.status}
          </td> */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex space-x-2">
            <button 
  className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
  onClick={() => handleAction(candidate.user, assessment._id, 'hire')}
>
  Hire
</button>
<button 
  className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
  onClick={() => handleAction(candidate.user, assessment._id, 'reject')}
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
