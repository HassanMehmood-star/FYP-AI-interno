import axios from "axios";
import { useState, useEffect } from "react";
import {
  User,
  Badge,
  Briefcase,
  GraduationCap,
  Code,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react";

// Mock data based on the provided schemas

const ProfileView = () => {
  // Assuming you store the logged-in user's ID in localStorage or a global state
// Or use context/redux for global state
  const loggedInUserId = localStorage.getItem('userId');
  console.log('Logged In User ID:', loggedInUserId);  // Log the userId for debugging
  
  if (!loggedInUserId) {
    console.error('User ID is undefined or missing');
    return;  // Handle this case (e.g., redirect to login)
  }
  

  const [userData, setUserData] = useState(null);
  const [userDetailsData, setUserDetailsData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedEducation, setExpandedEducation] = useState(null);
  const [expandedExperience, setExpandedExperience] = useState(null);

  // Fetch user data
  useEffect(() => {
    if (!loggedInUserId) {
      // If no userId found in localStorage, handle this scenario (e.g., redirect to login page)
      console.error("No user logged in");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`/api/user/${loggedInUserId}`);
        
        const userDetailsResponse = await axios.get(`/api/user-details/${loggedInUserId}`);
        setUserData(userResponse.data);
        setUserDetailsData(userDetailsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [loggedInUserId]); // Runs again if loggedInUserId changes

  if (!userData || !userDetailsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const toggleEducation = (index) => {
    setExpandedEducation(expandedEducation === index ? null : index);
  };

  const toggleExperience = (index) => {
    setExpandedExperience(expandedExperience === index ? null : index);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with profile summary */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-teal-800 to-teal-800 rounded-lg shadow-lg p-6 sm:p-10 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center">
                <User className="h-12 w-12 text-gray-500" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className="text-lg opacity-90 mt-1">{userData.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                    {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${userData.status === "Active" ? "bg-gray-500/20" : "bg-gray-500/20"} text-sm`}
                  >
                    {userData.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                    Member since {formatDate(userData.createdAt)}
                  </span>
                </div>
              </div>
              {/* <button className="ml-auto hidden md:flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </button> */}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2">
            {["overview", "education", "skills", "experience"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-center rounded-lg font-medium transition-colors
                  ${activeTab === tab ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <User className="mr-2 h-5 w-5 text-teal-600" />
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{userDetailsData.personalInfo.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{userDetailsData.personalInfo.gender}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{userDetailsData.personalInfo.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{userDetailsData.personalInfo.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">{formatDate(userData.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Education Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="mr-2 h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-semibold">Education</h3>
                  </div>
                  <p className="text-2xl font-bold">{userDetailsData.education.length}</p>
                  <p className="text-gray-500">Educational qualifications</p>
                  <button
                    onClick={() => setActiveTab("education")}
                    className="mt-4 w-full py-2 text-teal-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>

                {/* Skills Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <Code className="mr-2 h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-semibold">Skills</h3>
                  </div>
                  <p className="text-2xl font-bold">{userDetailsData.skills.length}</p>
                  <p className="text-gray-500">Professional skills</p>
                  <button
                    onClick={() => setActiveTab("skills")}
                    className="mt-4 w-full py-2 text-teal-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>

                {/* Experience Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-semibold">Experience</h3>
                  </div>
                  <p className="text-2xl font-bold">{userDetailsData.experiences.length}</p>
                  <p className="text-gray-500">Work experiences</p>
                  <button
                    onClick={() => setActiveTab("experience")}
                    className="mt-4 w-full py-2 text-teal-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-teal-600" />
                    <h2 className="text-lg font-semibold">Education</h2>
                  </div>
                  {/* <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Add Education
                  </button> */}
                </div>
                <div className="space-y-6">
                  {userDetailsData.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onClick={() => toggleEducation(index)}
                      >
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-2 rounded-full mr-4">
                            <GraduationCap className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {edu.degreeTitle} in {edu.areaOfStudy}
                            </h3>
                            <p className="text-sm text-gray-500">{edu.instituteName}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {edu.graduationMonth} {edu.graduationYear}
                          </span>
                          {expandedEducation === index ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      {expandedEducation === index && (
                        <div className="p-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Level of Study</p>
                              <p className="font-medium">{edu.levelOfStudy}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Area of Study</p>
                              <p className="font-medium">{edu.areaOfStudy}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Degree Title</p>
                              <p className="font-medium">{edu.degreeTitle}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Graduation Date</p>
                              <p className="font-medium">
                                {edu.graduationMonth} {edu.graduationYear}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Code className="mr-2 h-5 w-5 text-teal-600" />
                    <h2 className="text-lg font-semibold">Skills</h2>
                  </div>
                  {/* <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Add Skill
                  </button> */}
                </div>
                <div className="flex flex-wrap gap-2">
                  {userDetailsData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 transition-colors"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
                    <h2 className="text-lg font-semibold">Experience</h2>
                  </div>
                  {/* <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                    Add Experience
                  </button> */}
                </div>
                <div className="space-y-6">
                  {userDetailsData.experiences.map((exp, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onClick={() => toggleExperience(index)}
                      >
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-2 rounded-full mr-4">
                            <Briefcase className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            {/* <h3 className="font-medium">
                              {exp.description.split("at")[1]
                                ? `at ${exp.description.split("at")[1].split(".")[0]}`
                                : exp.description.substring(0, 30)}
                            </h3> */}
                            <p className="text-sm text-gray-500">{exp.experienceType}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {exp.month} {exp.year}
                          </span>
                          {expandedExperience === index ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      {expandedExperience === index && (
                        <div className="p-4 border-t">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-500">Type</p>
                              <p className="font-medium">{exp.experienceType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="font-medium">
                                {exp.month} {exp.year}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Description</p>
                              <p className="font-medium">{exp.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileView

