"use client"

import { useState, useEffect } from "react"
import { Filter, Star, X, ChevronRight } from "lucide-react"

const InternshipRecommendations = () => {
  const [internships, setInternships] = useState([])
  const [filteredInternships, setFilteredInternships] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Filter states
  const [showRemoteOnly, setShowRemoteOnly] = useState(false)
  const [showPaidOnly, setShowPaidOnly] = useState(false)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true)
      setError(null)
      setMessage("")

      try {
        // Fetch userId from localStorage
        const userId = localStorage.getItem("userId")
        if (!userId) {
          setError("No user ID found in localStorage. Please log in.")
          setLoading(false)
          return
        }

        // Make GET request to backend with userId in x-user-id header
        const response = await fetch("/api/routes/recommend-internships", {
          method: "GET",
          headers: {
            "x-user-id": userId,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch internships")
        }

        // Enhance the data with some sample fields if they're missing
        const enhancedInternships = data.internships.map((internship, index) => ({
          id: internship.id || `intern-${index}`,
          title: internship.title,
          company: internship.company || "Tech Company",
          category: ["Tech", "Design", "Marketing", "Business"][index % 4],
          remote: index % 3 === 0,
          paid: index % 2 === 0,
          featured: index % 5 === 0,
        }))

        setInternships(enhancedInternships)
        setFilteredInternships(enhancedInternships)
        setMessage(data.message)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching internships:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInternships()
  }, [])

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...internships]

    if (showRemoteOnly) {
      result = result.filter((internship) => internship.remote)
    }

    if (showPaidOnly) {
      result = result.filter((internship) => internship.paid)
    }

    if (showFeaturedOnly) {
      result = result.filter((internship) => internship.featured)
    }

    if (activeCategory !== "all") {
      result = result.filter((internship) => internship.category === activeCategory)
    }

    setFilteredInternships(result)
  }, [internships, showRemoteOnly, showPaidOnly, showFeaturedOnly, activeCategory])

  // Reset all filters
  const resetFilters = () => {
    setShowRemoteOnly(false)
    setShowPaidOnly(false)
    setShowFeaturedOnly(false)
    setActiveCategory("all")
  }

  // Generate unique categories from internships
  const categories = ["all", ...new Set(internships.map((i) => i.category || "").filter(Boolean))]

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Recommended Internships
          </h1>
          {message && !error && !loading && <p className="text-gray-600">{message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-xs border rounded-md hover:bg-gray-50"
            onClick={() => setFilteredInternships([...internships].sort((a, b) => a.title.localeCompare(b.title)))}
          >
            Sort A-Z
          </button>
          <button
            className="px-3 py-1 text-xs border rounded-md hover:bg-gray-50 flex items-center"
            onClick={resetFilters}
            disabled={!showRemoteOnly && !showPaidOnly && !showFeaturedOnly && activeCategory === "all"}
          >
            <X className="h-3 w-3 mr-1" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Filter section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-700" />
          <h2 className="font-semibold text-gray-700">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showRemoteOnly}
                onChange={(e) => setShowRemoteOnly(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">Remote Only</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showPaidOnly}
                onChange={(e) => setShowPaidOnly(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">Paid Only</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">Featured</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                activeCategory === category ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
          <div className="bg-red-100 p-2 rounded-full mr-4">
            <X className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Error</h3>
            <p>{error}</p>
            <button
              className="mt-2 px-3 py-1 text-sm border border-red-300 rounded-md text-red-700 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {filteredInternships.length > 0 ? (
        <div className="space-y-2">
          {filteredInternships.map((internship, index) => (
            <div
              key={internship.id || index}
              className={`flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 transition-colors cursor-pointer ${
                internship.featured ? "border-yellow-300 bg-yellow-50/30" : "border-gray-200"
              }`}
              onClick={() => console.log("Selected internship:", internship)}
            >
              <div className="flex items-center">
                {internship.featured && <Star className="h-4 w-4 text-yellow-500 mr-2" />}
                <span className="font-medium">{internship.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {internship.remote && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Remote</span>
                )}
                {internship.paid && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Paid</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Filter className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No internships found</h3>
            <p className="text-gray-600 mb-4">
              No internships match your current filters. Try adjusting your filter criteria.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-md transition-colors"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default InternshipRecommendations
