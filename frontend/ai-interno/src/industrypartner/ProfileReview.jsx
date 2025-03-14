import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";

export default function ProfileReview() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(null); // ✅ Error state


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found in localStorage");
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }
  
      try {
        console.log("✅ Fetching profile with token:", token);
        const response = await axios.get("http://localhost:5000/api/industry-partner/profilee", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ API Response from Backend:", response.data);
        setProfile(response.data);
      } catch (error) {
        console.error("❌ Error fetching profile:", error.response?.data || error.message);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false); // ✅ Stop loading after API call
      }
    };

    fetchProfile();
  }, []);
  


 
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // ✅ Show error message if any
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 text-center text-red-600">
        <h2 className="text-2xl font-semibold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Company Profile</h1>
        <p className="text-gray-600 text-lg">
          Your company profile is the first look about your company that a prospective intern sees. Let's make sure it is complete and exciting!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Overview</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit Overview</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Company LinkedIn</h3>
              <p className="text-gray-500">{profile.linkedIn || "Not Provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">About</h3>
              <p className="text-gray-500">{profile.about || "Not Provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Company Name</h3>
              <p>{profile.name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Company Website</h3>
              <a href={profile.companyWebsite} className="text-blue-600 hover:underline">
                {profile.companyWebsite || "Not Provided"}
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Country</h3>
              <p>{profile.companyLocation || "Not Provided"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Number Of Employees</h3>
              <p className="text-gray-500">{profile.numberOfEmployees || "Not Provided"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">About</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit About</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-1">Primary Work Arrangement</h3>
            <p className="text-gray-500">{profile.workArrangement}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Company Tools</h3>
            <p className="text-gray-500">{profile.tools.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Types Of Interns You Are Interested In</h3>
            <p>{profile.selectedInterns.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Company Email</h3>
            <p className="text-gray-500">{profile.email}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Workplace Model</h3>
            <p>{profile.workArrangement}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
