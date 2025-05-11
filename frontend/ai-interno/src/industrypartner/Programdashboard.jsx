import { useState, useEffect } from 'react';
import { BarChart, Search, Filter, ChevronDown, Plus } from "lucide-react";

// Stats data
const statsData = [
  {
    title: "Total Programs",
    value: "24", // Default value, will update based on API response
    icon: <BarChart className="h-4 w-4 text-gray-500" />,
  },
];

const Programdashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [totalProgramsCount, setTotalProgramsCount] = useState(0);
  const [internshipPrograms, setInternshipPrograms] = useState([]); // Store internship programs
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedProgramId, setSelectedProgramId] = useState(null); // Selected program ID
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    file: null,
  }); // Form state
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

  useEffect(() => {
    // Fetch total programs count and internship programs for the logged-in industry partner
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      
      try {
        // Fetch total programs count
        const countResponse = await fetch('/api/industrypartner/programs/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!countResponse.ok) {
          console.error('Failed to fetch program count:', countResponse.statusText);
          return;
        }
        
        const countData = await countResponse.json();
        setTotalProgramsCount(countData.totalProgramsCount); // Update the count state
        
        // Fetch internship programs created by the logged-in industry partner
        const programsResponse = await fetch('/api/industrypartner/programs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!programsResponse.ok) {
          console.error('Failed to fetch programs:', programsResponse.statusText);
          return;
        }
        
        const programsData = await programsResponse.json();
        setInternshipPrograms(programsData.programs); // Update the internship programs state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array to run once when component mounts

  // Filter programs based on search term and status filter
  const filteredPrograms = internshipPrograms.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open modal and set selected program
  const handleAddTask = (programId) => {
    setSelectedProgramId(programId);
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProgramId(null);
    setTaskForm({ title: "", description: "", file: null });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setTaskForm((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setIsSubmitting(false);
      return;
    }

    // Prepare form data for API request
    const formData = new FormData();
    formData.append('industryPartnerId', 'industry_partner_id_from_token'); // Replace with actual ID from token/user context
    formData.append('internshipId', selectedProgramId);
    formData.append('title', taskForm.title);
    formData.append('description', taskForm.description);
    if (taskForm.file) {
      formData.append('file', taskForm.file);
    }

    try {
      // Send task data to backend
      const response = await fetch('/api/industrypartner/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to save task:', response.statusText);
        setIsSubmitting(false);
        return;
      }

      // Optionally refresh programs or update UI
      console.log('Task saved successfully');
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all your programs in one place</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-screen-xl mx-auto mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-md w-full">
            <div className="flex flex-row items-center justify-between space-y-0 pb-4">
              <h3 className="text-xl font-medium text-gray-700">{stat.title}</h3>
              {stat.icon}
            </div>
            <div>
              <div className="text-4xl font-bold">
                {stat.title === 'Total Programs' ? totalProgramsCount : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <Filter className="h-4 w-4" />
            Status: {statusFilter}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
          {showStatusDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("All");
                    setShowStatusDropdown(false);
                  }}
                >
                  All
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("Active");
                    setShowStatusDropdown(false);
                  }}
                >
                  Active
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("Upcoming");
                    setShowStatusDropdown(false);
                  }}
                >
                  Upcoming
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("Completed");
                    setShowStatusDropdown(false);
                  }}
                >
                  Completed
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Programs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No programs found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr key={program._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(program.status)}`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(program.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAddTask(program._id)}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="Add Task"
                          aria-label={`Add task for ${program.title}`}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="text-xs">Add Task</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Animation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out opacity-0 scale-95"
            style={{ animation: 'fadeIn 0.3s forwards' }}
          >
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskForm.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Task Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={taskForm.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Upload File (Optional)
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS for modal animation
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Inject styles into document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Programdashboard;