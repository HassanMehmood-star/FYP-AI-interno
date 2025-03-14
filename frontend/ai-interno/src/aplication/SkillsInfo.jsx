import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const suggestedSkills = [
  "Communication", "Problem Solving", "Leadership/Management skills",
  "Microsoft Excel, Word, PowerPoint", "Data Analysis", "Research and Analysis",
  "Programming", "Python", "Software Development", "Full Stack Development",
  "JavaScript", "React", "Node.js", "MongoDB", "Express.js", "Django", "Flask",
  "HTML", "CSS", "TypeScript", "Version Control (Git)", "SQL", "NoSQL", 
  "Cloud Computing", "AWS", "Azure", "Google Cloud", "DevOps", "Machine Learning", 
  "Deep Learning", "Artificial Intelligence", "Cybersecurity", "Web Development", 
  "Mobile Development", "Android", "iOS", "Agile Methodology", "Scrum", "Project Management", 
  "Business Analysis", "UI/UX Design", "Graphic Design", "Adobe Photoshop", 
  "Adobe Illustrator", "Digital Marketing", "SEO", "Social Media Marketing", "Content Creation",
  "Public Speaking", "Negotiation", "Critical Thinking", "Teamwork", "Time Management",
  "Sales", "Customer Relationship Management (CRM)", "Product Management", "Product Design",
  "Data Visualization", "Business Intelligence (BI)", "Big Data", "Financial Analysis", 
  "Accounting", "Human Resources", "Leadership Coaching", "Mentoring", "Strategic Planning",
  "E-commerce", "Blockchain", "Internet of Things (IoT)", "Embedded Systems", "Quality Assurance",
  "Software Testing", "Agile Testing", "Robotic Process Automation (RPA)",
  
  // Coding Languages
  "C", "C++", "Java", "C#", "Ruby", "Go", "Swift", "Kotlin", "PHP", "Rust", "Perl", "Lua", "R", 
  "Scala", "Objective-C", "SQL (Structured Query Language)", "MATLAB", "Dart", "Julia", "VHDL", 
  "Assembly Language", "TypeScript", "Haskell", "Visual Basic", "SAS", "ActionScript", "Solidity", 
  "Shell Scripting", "F#", "Turing", "Clojure", "Forth", "Erlang", "Elixir", "Fortran", "Xojo", "VBScript"
];


const SkillsInfo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false); // State for success message

  // ✅ Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-skills', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("🔹 Skills data received from backend:", JSON.stringify(data, null, 2));

        if (data.data) {
          setSelectedSkills(data.data.map(skill => ({
            name: skill.skillName // ✅ Store only skill name
          })));
        }
      } catch (error) {
        console.error('❌ Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  // ✅ Add Skill (No Proficiency)
  const handleAddSkill = (skill) => {
    if (selectedSkills.length < 3 && !selectedSkills.some(s => s.name === skill)) {
      setSelectedSkills([...selectedSkills, { name: skill }]); // ✅ Store only skill name
    }
  };

  // ✅ Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.name !== skillToRemove));
  };

  // ✅ Save Skills to Backend (Only skillName)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/save-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ skills: selectedSkills }) // ✅ Send only skill names
      });

      const result = await response.json();
      if (result.message === 'Skills saved successfully') {
        // Show success message
        setIsSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        alert('Error saving skills.');
      }
    } catch (error) {
      console.error('❌ Error saving skills:', error);
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

            <h2 className="text-lg font-medium text-gray-900">Skills and Goals</h2>
            <p className="text-sm text-gray-600">
              Sharing your skills helps us match you with the best opportunities.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Select up to 3 skills.
            </h1>

            {/* Success Message */}
            {isSuccess && (
              <div className="p-4 mb-4 bg-green-100 text-green-800 border border-green-200 rounded-lg flex items-center">
                <span className="font-medium">Skills saved successfully!</span>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Type to search your skills."
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="space-y-4">
                {selectedSkills.map((skill, index) => (
                  <div key={skill.name} className="flex items-center gap-4 rounded-lg border p-4">
                    <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{skill.name}</p>
                    </div>
                    <button onClick={() => handleRemoveSkill(skill.name)} className="text-gray-400 hover:text-gray-500">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Suggested Skills */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Suggested skills</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills
                  .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      disabled={selectedSkills.length >= 3}
                      className="rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      {skill}
                    </button>
                  ))}
              </div>
            </div>

            {/* Save Button */}
            <button onClick={handleSubmit} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsInfo;
