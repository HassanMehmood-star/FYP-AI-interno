"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, MoreVertical } from "lucide-react";

const IndustryDashboard = () => {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [loading, setLoading] = useState(true); // ✅ Track loading state

  const categories = [
    "Business",
    "Cloud Support",
    "Computer Science & IT",
    "Creative, Design & Fashion",
    "Cyber Security",
    "Data Analytics",
    "Data Science",
    "Engineering",
    "Entrepreneurship & Startups",
    "Finance",
  ];

  useEffect(() => {
    // Simulate data fetching (e.g., API request)
    setTimeout(() => {
      setLoading(false); // ✅ Set loading to false after 1.5s
    }, 1500);
  }, []);

  // ✅ Show loading spinner if still fetching
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-medium text-gray-800">Good morning, Hassan Mehmood</h1>
          <span className="text-3xl">👋</span>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {/* Tabs */}
              <div className="flex space-x-1 border-b mb-8">
                {["Suggestions", "Shortlisted", "Interested in company"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab.toLowerCase() ? "border-b-2 border-black" : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Browse popular candidates</h2>
                <p className="text-gray-600">We're trying to find the best candidates for you.</p>

                {/* Categories */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">What type of interns are you looking for?</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Browse More Button */}
                <button className="mt-6 w-full bg-black text-white rounded-lg py-3 px-4 hover:bg-gray-800 transition-colors flex items-center justify-center">
                  Browse more candidates
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming interviews (0)</h2>
              </div>
              <p className="text-sm text-gray-600">This week (17 Feb - 23 Feb)</p>
              <p className="mt-4 text-center text-gray-600">No interviews lined up</p>
            </div>

            {/* Internship Requirements */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="mb-4 space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">Internship requirements</h2>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Publish these opportunities to get incoming candidate applications.
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Website/Application: Security...</p>
                  <button className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors">Publish</button>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-gray-600">1/2</p>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default IndustryDashboard;
