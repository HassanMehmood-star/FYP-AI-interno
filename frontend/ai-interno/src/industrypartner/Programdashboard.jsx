import { useState, useEffect } from 'react';
import { BarChart, Users, Search, Filter, ChevronDown, MoreHorizontal, Plus } from "lucide-react";

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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => {}}
                        >
                          <MoreHorizontal className="h-5 w-5" />
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
    </div>
  );
}

export default Programdashboard;
