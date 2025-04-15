import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LinkedinIcon,
  CameraIcon,
  HomeIcon,
  BuildingIcon,
  GlobeIcon,
  MapPinIcon,
  UsersIcon
} from 'lucide-react';

const CompanyProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileComplete, setProfileComplete] = useState(false); // Track if profile is complete
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state

  const [about, setAbout] = useState("");
  const [logo, setLogo] = useState(null);
  const [workArrangement, setWorkArrangement] = useState("");
  const [selectedTools, setSelectedTools] = useState([]); // State for Selected Tools
  const [selectedInterns, setSelectedInterns] = useState([]);

  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [successMessage, setSuccessMessage] = useState('');


  const handleNextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleToolToggle = (tool) => {
    setSelectedTools((prevSelected) =>
      prevSelected.includes(tool)
        ? prevSelected.filter((t) => t !== tool)
        : [...prevSelected, tool]
    );
  };

  const handleInternToggle = (internType) => {
    setSelectedInterns((prevSelected) =>
      prevSelected.includes(internType)
        ? prevSelected.filter((type) => type !== internType)
        : [...prevSelected, internType]
    );
  };

  const toolsData = {
    "Sales & Marketing": ["Google Analytics", "Salesforce", "HubSpot", "Zoho CRM", "Freshdesk"],
    "Productivity": ["Google Docs", "Google Sheets", "Microsoft Word", "Microsoft PowerPoint", "Asana", "ClickUp", "Jira", "Notion"],
    "Communication": ["Slack", "Zoom", "Microsoft Teams", "Google Meet", "Discord"],
    "Product & Design": ["Adobe Photoshop", "Adobe Illustrator", "Canva", "Figma", "Sketch", "Miro"],
    "Cloud Services": ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform"],
    "Tech Stack": ["Python", "JavaScript", "React", "Next.js", "Node.js", "Ruby on Rails"],
  };

  const internTypes = [
    { title: "AI & IT Support", description: "Assist with AI model implementation and tech support" },
    { title: "Business & Operations", description: "Analyze business trends to optimize processes" },
    { title: "Website/Application: Security", description: "Monitor and secure application infrastructure" },
    { title: "Website/Application: Analytics", description: "Analyze user data and improve app performance" },
    { title: "Core Engineering", description: "Assist in mechanical design and manufacturing projects" },
    { title: "AI (Data Science)", description: "Analyze datasets to uncover trends and insights" },
    { title: "Marketing & Social Media", description: "Plan and execute social media campaigns" },
    { title: "Business Compliance", description: "Ensure company policies adhere to legal standards" },
    { title: "Finance/Accounting Support", description: "Handle budgeting, forecasting, and expense tracking" },
    { title: "PR & Communications", description: "Draft press releases and media outreach content" }
  ];

  const handleSubmitProfile = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }
  
      // Construct formData as JSON
      const formData = {
        about: about || "", 
        linkedin: linkedin || "", // Ensure lowercase
        workArrangement: workArrangement || "", 
        tools: selectedTools.length ? selectedTools : [], 
        selectedInterns: selectedInterns.length ? selectedInterns : [], 
        companyWebsite: companyWebsite || "", 
        companyLocation: companyLocation || "", 
        numberOfEmployees: numberOfEmployees ? String(numberOfEmployees).trim() : "",
        logo: logo || "", 
      };
  
      console.log("Submitting formData:", JSON.stringify(formData, null, 2)); // Debug log before sending
  
      // Send API request
      const response = await axios.post(
        "http://localhost:5000/api/industry-partner-details/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Server Response:", response.data); // Log server response
  
      if (response.status === 200) {
        setSuccessMessage('Details submitted successfully!');
        setProfileComplete(true); // Mark profile as complete after successful submission
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data);
        alert(`Error: ${error.response.data.message || "Invalid request"}`);
      } else {
        console.error("Error:", error.message);
        alert("Network error or server is down.");
      }
    }
  };

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("❌ User not authenticated.");
          setLoading(false);
          return;
        }
  
        const response = await axios.get(
          "http://localhost:5000/api/industry-partner-details/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        console.log("Full API Response:", response.data); // Log API response
  
        if (response.status === 200) {
          const data = response.data;
  
          setAbout(data.about || "");
          setLinkedin(data.linkedin || data.linkedIn || ""); // Fix LinkedIn field mapping
          setWorkArrangement(data.workArrangement || "");
          setSelectedTools(data.tools || []);
          setSelectedInterns(data.selectedInterns || []);
          setCompanyWebsite(data.companyWebsite || "");
          setCompanyLocation(data.companyLocation || "");
          setNumberOfEmployees(data.numberOfEmployees ? String(data.numberOfEmployees) : "");
          setLogo(data.logo || null);
  
          if (
            data.about &&
            (data.linkedin || data.linkedIn) && // Now LinkedIn will be considered
            data.workArrangement &&
            data.tools.length > 0 &&
            data.selectedInterns.length > 0 &&
            data.companyWebsite &&
            data.companyLocation &&
            data.numberOfEmployees
          ) {
            setProfileComplete(true);
          }
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
        setError(false); // No error, let user fill the profile
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanyProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (



    <div className="min-h-screen flex items-center justify-center bg-gray-50">



      <div className="min-h-screen bg-gray-50 rounded-2xl">

     
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between gap-2 mb-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full flex-1 transition-colors ${
                i < currentStep ? "bg-teal-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {successMessage && (
  <div className="bg-green-500 text-white text-center py-2 rounded-3xl">
    {successMessage}
  </div>
)}
        <p className="text-center text-gray-600 mb-6">Step {currentStep}/6</p>

        {/* Step 1: Company Introduction */}
        {currentStep === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Company Introduction</h1>
            <p className="text-gray-600 mb-8">
              90% of candidates check the company profile before accepting an interview request. Let&apos;s make sure yours stands out!
            </p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-teal-500 block mb-2">About Company*</label>
                <textarea
                  placeholder="Describe your company, mission, and audience."
                  className="w-full border border-teal-500 rounded p-3 min-h-[120px]"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>

              <div>
                <label className="text-teal-500 block mb-2">Company&apos;s LinkedIn</label>
                <div className="relative">
                  <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
        type="text"
        placeholder="LinkedIn Profile URL"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        className="pl-10 w-full border border-gray-300 rounded p-3"
      />
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              disabled={!about.trim()}
              className={`w-full mt-8 py-3 text-white rounded-lg ${
                about.trim() ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"
              } transition`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Upload Company Logo */}
        {currentStep === 2 && (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Company Logo</h1>
            <p className="text-gray-600 mb-8">
              Add your company logo. <span className="text-gray-500">.jpg, .jpeg, and .png formats work best.</span>
            </p>

            <label
              htmlFor="logo-upload"
              className="cursor-pointer inline-flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              {logo ? (
                <img src={logo} alt="Company Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <CameraIcon className="h-8 w-8 mb-2" />
                  <span>Upload</span>
                </div>
              )}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handleLogoUpload}
            />

            <button
              onClick={handleNextStep}
              disabled={!logo}
              className={`w-full mt-8 py-3 text-white rounded-lg ${
                logo ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"
              } transition`}
            >
              Continue
            </button>

            <button
              onClick={handleNextStep}
              className="text-teal-500 mt-4 underline hover:text-teal-600"
            >
              Skip This Step
            </button>
          </div>
        )}

        {/* Step 3: Work Arrangement */}
        {currentStep === 3 && (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              What is the primary work arrangement for your organization?
            </h1>
            <p className="text-gray-600 mb-8">
              Select the one that fits best with your company.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fully Remote */}
              <div
                onClick={() => setWorkArrangement("Fully Remote")}
                className={`p-6 border rounded-lg cursor-pointer ${
                  workArrangement === "Fully Remote" ? "border-teal-500 bg-teal-50" : "border-gray-300"
                } hover:border-teal-400 transition`}
              >
                <HomeIcon className="h-8 w-8 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fully Remote</h3>
                <p className="text-gray-600 text-sm">All employees work remotely, no physical office.</p>
              </div>

              {/* Hybrid */}
              <div
                onClick={() => setWorkArrangement("Hybrid")}
                className={`p-6 border rounded-lg cursor-pointer ${
                  workArrangement === "Hybrid" ? "border-teal-500 bg-teal-50" : "border-gray-300"
                } hover:border-teal-400 transition`}
              >
                <HomeIcon className="h-8 w-8 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Hybrid</h3>
                <p className="text-gray-600 text-sm">Employees split time between remote and on-site work.</p>
              </div>

              {/* On-site Only */}
              <div
                onClick={() => setWorkArrangement("On-site Only")}
                className={`p-6 border rounded-lg cursor-pointer ${
                  workArrangement === "On-site Only" ? "border-teal-500 bg-teal-50" : "border-gray-300"
                } hover:border-teal-400 transition`}
              >
                <BuildingIcon className="h-8 w-8 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">On-site Only</h3>
                <p className="text-gray-600 text-sm">All work is done in person at the office.</p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              disabled={!workArrangement}
              className={`w-full mt-8 py-3 text-white rounded-lg ${
                workArrangement ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"
              } transition`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 4: Company Tools */}
        {currentStep === 4 && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 text-center">Company Tools</h1>
            <p className="text-gray-600 mb-8 text-center">
              Select all of the tools, programs, and software that your company uses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(toolsData).map(([category, tools]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {tools.map((tool) => (
                      <div
                        key={tool}
                        onClick={() => handleToolToggle(tool)}
                        className={`px-4 py-2 rounded-full cursor-pointer text-sm ${
                          selectedTools.includes(tool)
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        } hover:bg-teal-400 hover:text-white transition`}
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextStep}
              disabled={selectedTools.length === 0}
              className={`w-full mt-8 py-3 text-white rounded-lg ${
                selectedTools.length > 0 ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"
              } transition`}
            >
              Continue
            </button>
          </div>
        )}



         {/* Step 5: Intern Types Selection */}
         {currentStep === 5 && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
              What type of interns are you interested in?
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              This will ensure we match you to your ideal intern. Choose at least 2 options to start with.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internTypes.map((intern) => (
                <div
                  key={intern.title}
                  onClick={() => handleInternToggle(intern.title)}
                  className={`p-5 border rounded-lg cursor-pointer select-none ${
                    selectedInterns.includes(intern.title)
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300"
                  } hover:border-teal-400 transition`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{intern.title}</h3>
                  <p className="text-gray-600 text-sm">{intern.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextStep}
              disabled={selectedInterns.length < 2}
              className={`w-full mt-8 py-3 text-white rounded-lg ${
                selectedInterns.length >= 2 ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"
              } transition`}
            >
              Continue
            </button>
          </div>
        )}



         {/* Step 6: Company Details */}
         {currentStep === 6 && (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Company Details</h1>
            <p className="text-gray-600 mb-8">
              Provide essential information about your company to complete your profile.
            </p>

            <div className="space-y-6 text-left">
              
              {/* Company Website */}
              <div>
                <label className="text-teal-500 mb-2 block">Company Website*</label>
                <div className="relative">
                  <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="e.g., www.yourcompany.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded p-3"
                  />
                </div>
              </div>

              {/* Company Location */}
              <div>
                <label className="text-teal-500 mb-2 block">Location*</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="e.g., New York, USA"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded p-3"
                  />
                </div>
              </div>

              {/* Number of Employees */}
              <div>
                <label className="text-teal-500 mb-2 block">Number of Employees*</label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
  type="text"
  value={numberOfEmployees}
  onChange={(e) => setNumberOfEmployees(e.target.value)}
  className="pl-10 w-full border border-gray-300 rounded p-3"
/>

                </div>
              </div>

            </div>

            {/* Continue Button */}
            <button
              onClick={handleSubmitProfile}
              disabled={!companyWebsite.trim() || !companyLocation.trim() || !numberOfEmployees.trim()}
              className={`w-full mt-8 py-3 text-white rounded-lg ${
                companyWebsite.trim() && companyLocation.trim() && numberOfEmployees.trim()
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "bg-gray-300 cursor-not-allowed"
              } transition`}
            >
              Submit Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompanyProfile;
