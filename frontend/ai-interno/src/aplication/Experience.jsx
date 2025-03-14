import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link } from 'react-router-dom';

const experienceTypes = [
  "Internship",
  "Part-time work",
  "Volunteering",
  "Academic project",
  "Society/Club involvement",
  "Personal project",
  "Work placement",
  "Research assistant",
  "Teaching assistant",
];

const Experience = () => {
  const [experiences, setExperiences] = useState([
    { experienceType: "", month: "", year: "", description: "" },
  ]);
  const [isSuccess, setIsSuccess] = useState(false); // Success message state

  // ✅ Fetch experiences from backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-experiences', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("📢 Experiences data received:", JSON.stringify(data, null, 2));

        if (data.data) {
          setExperiences(data.data.map(exp => ({
            experienceType: exp.experienceType,
            month: exp.month,
            year: exp.year,
            description: exp.description
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching experiences:', error);
      }
    };

    fetchExperiences();
  }, []);

  // ✅ Handle input changes
  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    updatedExperiences[index][name] = value;
    setExperiences(updatedExperiences);
  };

  // ✅ Add new experience
  const handleAddExperience = () => {
    setExperiences([...experiences, { experienceType: "", month: "", year: "", description: "" }]);
  };

  // ✅ Save experiences
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📢 Sending Experiences to Backend:", JSON.stringify(experiences, null, 2));

    try {
      const response = await fetch('http://localhost:5000/api/save-experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ experiences })
      });

      const result = await response.json();
      console.log("📢 Response from Backend:", result);

      if (result.message === 'Experiences saved successfully') {
        setIsSuccess(true); // Set success message visible
        setTimeout(() => setIsSuccess(false), 5000); // Hide success message after 5 seconds
      } else {
        alert('Error saving experiences.');
      }
    } catch (error) {
      console.error('❌ Error saving experiences:', error);
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

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">You are completing:</h2>
              <div className="space-y-2">
                <div className="font-medium text-gray-800">Projects & Past Experience</div>
                <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800">
                  <svg viewBox="0 0 24 24" fill="none" className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  5-10 minutes
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              This could be anything you've done so far including volunteering positions, societies/clubs, academic
              projects, internships, part-time work, and more.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              What experience relevant to your desired career field would you like to add first?
            </h1>

            {/* Success Message */}
            {isSuccess && (
              <div className="p-4 mb-4 bg-green-100 text-green-800 border border-green-200 rounded-lg flex items-center">
                <span className="font-medium">✅ Experiences saved successfully!</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {experiences.map((experience, index) => (
                <div key={index} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor={`experience-${index}`} className="block text-sm font-medium text-gray-900">
                      What was the nature of this experience?
                    </label>
                    <div className="relative">
                      <select
                        id={`experience-${index}`}
                        name="experienceType" // ✅ Fixed key
                        value={experience.experienceType}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                      >
                        <option value="">Select or search</option>
                        {experienceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Date Fields (Month, Year) */}
                  <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-900">Month</label>
  <select
    name="month"
    value={experience.month}
    onChange={(e) => handleExperienceChange(index, e)}
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
</div>


                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Year</label>
                    <input type="number" name="year" value={experience.year} onChange={(e) => handleExperienceChange(index, e)} className="block w-full rounded-md border-gray-300 px-3 py-2" />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Description of the experience</label>
                    <textarea name="description" value={experience.description} onChange={(e) => handleExperienceChange(index, e)} className="block w-full rounded-md border-gray-300 px-3 py-2" />
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <button type="button" onClick={handleAddExperience} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Add Experience</button>
                <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
