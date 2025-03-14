import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EducationInfo = () => {
  const [educationSections, setEducationSections] = useState([
    {
      id: 1,
      level: "undergraduate",
      instituteName: "",
      degreeTitle: "",
      areaOfStudy: "",
      graduationMonth: "",
      graduationYear: "",
    },
  ]);

  const [isSuccess, setIsSuccess] = useState(false); // State to track success message

  // Fetch existing education details when the component mounts
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/get-education", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();
        console.log("Fetched Education Data:", result.data);
        if (result.data) {
          setEducationSections(result.data);
        }
      } catch (error) {
        console.error("Error fetching education details:", error);
      }
    };

    fetchEducation();
  }, []);

  // Handle input changes
  const handleChange = (e, id, field) => {
    setEducationSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, [field]: e.target.value } : section
      )
    );
  };

  // Handle adding a new education section
  const handleAddEducation = () => {
    setEducationSections([
      ...educationSections,
      {
        id: educationSections.length + 1,
        level: "undergraduate",
        instituteName: "",
        degreeTitle: "",
        areaOfStudy: "",
        graduationMonth: "",
        graduationYear: "",
      },
    ]);
  };

  // Handle saving education details to the database
  const handleSaveEducation = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Check if all fields are filled
    for (let section of educationSections) {
      if (
        !section.level ||
        !section.instituteName ||
        !section.degreeTitle ||
        !section.areaOfStudy ||
        !section.graduationMonth ||
        !section.graduationYear
      ) {
        alert("Please fill in all the fields before saving.");
        return;
      }
    }

    console.log("Saving education data:", JSON.stringify(educationSections, null, 2)); // Debugging output

    try {
      const response = await fetch("http://localhost:5000/api/save-education", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ education: educationSections }), // Send the data
      });

      const result = await response.json();
      console.log("Response from backend:", result); // Debugging result
      if (result.message === "Education details saved successfully") {
        setIsSuccess(true); // Set success message visible
        // Fetch the latest education details after saving
        const fetchEducation = async () => {
          try {
            const response = await fetch("http://localhost:5000/api/get-education", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            const result = await response.json();
            if (result.data) {
              setEducationSections(result.data);
            }
          } catch (error) {
            console.error("Error fetching education details:", error);
          }
        };
        fetchEducation(); // Fetch the latest data
      } else {
        alert("❌ Error saving education details.");
      }
    } catch (error) {
      console.error("❌ Error saving education details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[350px,1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            <Link to="/dashboard/UserApplication" className="inline-flex items-center text-teal-500 hover:text-teal-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h2 className="text-lg font-medium text-gray-900">You are completing:</h2>
            <div className="space-y-2">
              <div className="font-medium text-gray-800">Education Details</div>
              <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800">
                <svg viewBox="0 0 24 24" fill="none" className="mr-1.5 h-4 w-4">
                  <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
                5-10 minutes
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Knowing your educational background enables us to provide you with the best internship matches.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Please share the details of your education</h1>

            {/* Success Message */}
            {isSuccess && (
              <div className="p-4 mb-4 bg-green-100 text-green-800 border border-green-200 rounded-lg flex items-center">
                <span className="font-medium">✅ Education details saved successfully!</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSaveEducation}>
              {educationSections.map((section, index) => (
                <div key={index} className="space-y-6">
                  <div className="space-y-4">
                    {/* Level of Study */}
                    <label className="block text-sm font-medium text-gray-700">Level of study*</label>
                    <select
                      value={section.level}
                      onChange={(e) => handleChange(e, section.id, "level")}
                      className="block w-full rounded-md border-gray-300 bg-white px-3 py-2"
                    >
                      <option value="undergraduate">Undergraduate / Bachelor's Degree</option>
                      <option value="postgraduate">Postgraduate / Master's Degree</option>
                      <option value="doctorate">Doctorate / PhD</option>
                    </select>

                    {/* Institute Name */}
                    <label className="block text-sm font-medium text-gray-700">Institute Name*</label>
                    <input
                      type="text"
                      value={section.instituteName || ""}
                      onChange={(e) => handleChange(e, section.id, "instituteName")}
                      className="block w-full rounded-md border-gray-300"
                    />

                    {/* Degree Title */}
                    <label className="block text-sm font-medium text-gray-700">Official title of the degree or major*</label>
                    <input
                      type="text"
                      value={section.degreeTitle || ""}
                      onChange={(e) => handleChange(e, section.id, "degreeTitle")}
                      className="block w-full rounded-md border-gray-300"
                    />

                    {/* Area of Study */}
                    <label className="block text-sm font-medium text-gray-700">Area of study*</label>
<select
  name="areaOfStudy"
  value={section.areaOfStudy || ""}
  onChange={(e) => handleChange(e, section.id, "areaOfStudy")}
  className="block w-full rounded-md border-gray-300 px-3 py-2"
>
  <option value="">Select Area of Study</option>
  <option value="Science">Science</option>
  <option value="Technology">Technology</option>
  <option value="Engineering">Engineering</option>
  <option value="Mathematics">Mathematics</option>
  <option value="Arts">Arts</option>
  <option value="Humanities">Humanities</option>
  <option value="Business">Business</option>
  <option value="Health Sciences">Health Sciences</option>
  <option value="Social Sciences">Social Sciences</option>
  <option value="Law">Law</option>
  <option value="Education">Education</option>
  <option value="Design">Design</option>
  <option value="Economics">Economics</option>
  <option value="Languages">Languages</option>
  <option value="Communication">Communication</option>
  <option value="Other">Other</option>
</select>


                    {/* Graduation Month */}
                    <label className="block text-sm font-medium text-gray-700">Graduation Month*</label>
<select
  name="graduationMonth"
  value={section.graduationMonth || ""}
  onChange={(e) => handleChange(e, section.id, "graduationMonth")}
  className="block w-full rounded-md border-gray-300 px-3 py-2"
>
  <option value="">Select Month</option>
  <option value="January">January</option>
  <option value="February">February</option>
  <option value="March">March</option>
  <option value="April">April</option>
  <option value="May">May</option>
  <option value="June">June</option>
  <option value="July">July</option>
  <option value="August">August</option>
  <option value="September">September</option>
  <option value="October">October</option>
  <option value="November">November</option>
  <option value="December">December</option>
</select>


                    {/* Graduation Year */}
                    <label className="block text-sm font-medium text-gray-700">Graduation Year*</label>
                    <input
                      type="text"
                      value={section.graduationYear || ""}
                      onChange={(e) => handleChange(e, section.id, "graduationYear")}
                      className="block w-full rounded-md border-gray-300"
                    />
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <div className="flex space-x-4">
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">
                  Save Education Details
                </button>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Education
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationInfo;
