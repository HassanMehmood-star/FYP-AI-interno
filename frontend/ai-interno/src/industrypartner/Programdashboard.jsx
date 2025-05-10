"use client"

import { useState } from "react"
import { BarChart, Calendar, Clock, Filter, MoreHorizontal, Plus, Search, Users, ChevronDown } from "lucide-react"

// Mock data for programs
const programsData = [
  {
    id: 1,
    name: "Summer Coding Bootcamp",
    category: "Technology",
    status: "Active",
    participants: 45,
    startDate: "2023-06-15",
    endDate: "2023-08-30",
  },
  {
    id: 2,
    name: "Leadership Development",
    category: "Professional Skills",
    status: "Upcoming",
    participants: 20,
    startDate: "2023-07-10",
    endDate: "2023-09-15",
  },
  {
    id: 3,
    name: "Data Science Fundamentals",
    category: "Technology",
    status: "Active",
    participants: 32,
    startDate: "2023-05-20",
    endDate: "2023-07-25",
  },
  {
    id: 4,
    name: "Digital Marketing Masterclass",
    category: "Marketing",
    status: "Completed",
    participants: 28,
    startDate: "2023-03-10",
    endDate: "2023-05-12",
  },
  {
    id: 5,
    name: "Financial Literacy Workshop",
    category: "Finance",
    status: "Upcoming",
    participants: 15,
    startDate: "2023-08-05",
    endDate: "2023-08-26",
  },
]

// Stats data
const statsData = [
  {
    title: "Total Programs",
    value: "24",
    icon: <BarChart className="h-4 w-4 text-gray-500" />,
    change: "+12% from last month",
    trend: "up",
  },
  {
    title: "Active Participants",
    value: "1,429",
    icon: <Users className="h-4 w-4 text-gray-500" />,
    change: "+8% from last month",
    trend: "up",
  },
  {
    title: "Upcoming Programs",
    value: "7",
    icon: <Calendar className="h-4 w-4 text-gray-500" />,
    change: "2 starting this week",
    trend: "neutral",
  },
  {
    title: "Avg. Completion Rate",
    value: "92%",
    icon: <Clock className="h-4 w-4 text-gray-500" />,
    change: "+3% from last quarter",
    trend: "up",
  },
]

const Programdashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showActionDropdown, setShowActionDropdown] = useState(null)

  // Filter programs based on search term and status filter
  const filteredPrograms = programsData.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || program.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Upcoming":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all your programs in one place</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Create New Program
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"
                }`}
              >
                {stat.change}
              </p>
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
                <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-gray-200">
                  Filter by Status
                </div>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("All")
                    setShowStatusDropdown(false)
                  }}
                >
                  All
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("Active")
                    setShowStatusDropdown(false)
                  }}
                >
                  Active
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("Upcoming")
                    setShowStatusDropdown(false)
                  }}
                >
                  Upcoming
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setStatusFilter("Completed")
                    setShowStatusDropdown(false)
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
          <p className="text-sm text-gray-500">
            {filteredPrograms.length} {filteredPrograms.length === 1 ? "program" : "programs"} found
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
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
                  <tr key={program.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{program.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(program.status)}`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.participants}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(program.startDate)} - {formatDate(program.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => setShowActionDropdown(showActionDropdown === program.id ? null : program.id)}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {showActionDropdown === program.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => setShowActionDropdown(null)}
                              >
                                View Details
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => setShowActionDropdown(null)}
                              >
                                Edit Program
                              </button>
                              <div className="border-t border-gray-200"></div>
                              <button
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                onClick={() => setShowActionDropdown(null)}
                              >
                                Delete Program
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-sm text-gray-500">Latest updates from your programs</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 border-l-2 border-blue-500 pl-4 py-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="font-medium">New participants joined Summer Coding Bootcamp</p>
                <p className="text-sm text-gray-500">5 new participants registered</p>
                <p className="text-xs text-gray-400 mt-1">Today, 10:30 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-l-2 border-green-500 pl-4 py-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Calendar className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="font-medium">Leadership Development program started</p>
                <p className="text-sm text-gray-500">Program launched with 20 participants</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday, 9:15 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-4 border-l-2 border-gray-500 pl-4 py-2">
              <div className="bg-gray-100 p-2 rounded-full">
                <Clock className="h-4 w-4 text-gray-700" />
              </div>
              <div>
                <p className="font-medium">Digital Marketing Masterclass completed</p>
                <p className="text-sm text-gray-500">28 participants completed the program</p>
                <p className="text-xs text-gray-400 mt-1">May 12, 2023</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <button className="w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  )
}

export default Programdashboard
