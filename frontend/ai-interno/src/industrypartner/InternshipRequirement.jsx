import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Plus, X, Info, Users, Calendar, Briefcase, CheckCircle } from "lucide-react";

export default function InternshipRequirements() {
  const [applicants, setApplicants] = useState([]);  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [isCandidatesPageOpen, setIsCandidatesPageOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    careerField: "",
    skills: ["", "", ""], // Changed to an array with 3 empty skills
    roleDescription: "",
  });
  const [activeRequirement, setActiveRequirement] = useState(null);

  const navigate = useNavigate();

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const handleInputChange = (e, index) => {
    if (typeof index === "number") {
      // Handle skill changes
      const newSkills = [...formData.skills];
      newSkills[index] = e.target.value;
      setFormData((prev) => ({ ...prev, skills: newSkills }));
    } else {
      // Handle other inputs
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const addSkill = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (index) => {
    if (formData.skills.length > 3) {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, skills: newSkills }));
    }
  };

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get('/api/industry-partner/internships', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRequirements(response.data);
      } catch (err) {
        console.error('Error fetching internships', err);
      }
    };
    fetchInternships();
  }, []);

  const handleManageCandidates = (internshipId) => {
    navigate(`/industrtypartnerdashboard/CandidatesList?internshipId=${internshipId}`);
  };

  const handleSubmit = async () => {
    const filledSkills = formData.skills.filter((skill) => skill !== "");
    if (
      !formData.title ||
      !formData.department ||
      !formData.careerField ||
      filledSkills.length < 3 || // Ensure at least 3 skills
      !formData.roleDescription
    ) {
      alert("Please fill all required fields, including at least 3 skills.");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/industry-partner/internships', {
        ...formData,
        skillInternWillLearn: formData.skills, // Send skills array as skillInternWillLearn
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const newInternship = response.data;
      setRequirements((prev) => [...prev, newInternship]);
      setActiveRequirement(newInternship.id);
  
      // Store the internshipId in localStorage
      localStorage.setItem('internshipId', newInternship.id);
      
      closeForm();
    } catch (err) {
      console.error("Error creating internship:", err);
      alert("Failed to create internship. Check the console for details.");
    }
  };
  
  const selectRequirement = (id) => {
    setActiveRequirement(id);
  };

  const closeCandidatesPage = () => {
    setIsCandidatesPageOpen(false);
    setSelectedInternship(null);
    setApplicants([]);
  };

  const skillOptions = [
    "Web Development",
    "AI",
    "Mobile Development",
    "CI/CD",              // DevOps: Continuous Integration/Continuous Deployment
    "Containerization",   // DevOps: Docker, Podman
    "Kubernetes",         // DevOps: Container orchestration
    "Terraform",          // DevOps: Infrastructure as Code
    "AWS",                // DevOps: Cloud platform
    "Azure",              // DevOps: Cloud platform
    "Git",                // DevOps: Version control
    "Monitoring",         // DevOps: Prometheus, Grafana, etc.
    "Linux",              // DevOps: System administration
    "Data Science",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing (NLP)",
    "Computer Vision",
    "Big Data",
    "Data Engineering",
    "Data Visualization",
    "Statistical Analysis",
    "Predictive Analytics",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Database Management",
    "Software Testing",
    "Blockchain",
    "React",
    "JavaScript",
    "Ruby on Rails",
    "Node.js",
    "MongoDB",
    "MySQL",
    "Django",
    "Next.js",
    "Flask",
    "Vue.js",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "C++",
    "C#",
    "ReactNative"
];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Internship Requirements</h1>
          <p className="text-gray-500 mt-1">Craft your internship requirements to find ideal candidates effortlessly</p>
        </div>
        <button onClick={openForm} className="bg-black text-white rounded-lg px-4 py-2 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create New
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <label htmlFor="search" className="text-sm text-gray-500 mb-1 block">
            Search internship by name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Search internship by name"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap border border-gray-200 rounded-lg">
        <div className="flex-1 min-w-[120px] border-r border-gray-200">
          <button className="w-full h-full px-3 py-2 text-left flex items-center justify-between text-sm">
            <span className="text-gray-700">Department</span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 min-w-[120px] border-r border-gray-200">
          <button className="w-full h-full px-3 py-2 text-left flex items-center justify-between text-sm">
            <span className="text-gray-700">Career fields</span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 min-w-[150px] border-r border-gray-200">
          <button className="w-full h-full px-3 py-2 text-left flex items-center justify-between text-sm">
            <span className="text-gray-700">Preferred start months</span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 min-w-[120px] border-r border-gray-200">
          <button className="w-full h-full px-3 py-2 text-left flex items-center justify-between text-sm">
            <span className="text-gray-700">Created by</span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 min-w-[120px]">
          <button className="w-full h-full px-3 py-2 text-left flex items-center justify-between text-sm">
            <span className="text-gray-700">Status</span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      </div>

      {requirements.length > 0 && (
        <div className="mt-6 space-y-6">
          {requirements.map((req) => (
            <div
              key={req._id}
              className={`border rounded-lg overflow-hidden ${activeRequirement === req._id ? "border-black" : "border-gray-200"}`}
              onClick={() => selectRequirement(req._id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{req.title}</h2>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span className="mr-3">{req.department}</span>
                      <span className="mr-3">•</span>
                      <span>{req.careerField}</span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {req.status}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="bg-pink-50 rounded-lg p-4 flex-1 min-w-[120px]">
                    <p className="text-3xl font-bold text-pink-500">{req.stats?.interested || 0}</p>
                    <p className="text-sm text-gray-600">Interested</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 flex-1 min-w-[120px]">
                    <p className="text-3xl font-bold text-purple-500">{req.stats?.scheduled || 0}</p>
                    <p className="text-sm text-gray-600">Scheduled Test</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 flex-1 min-w-[120px]">
                    <p className="text-3xl font-bold text-blue-500">{req.stats?.inOffer || 0}</p>
                    <p className="text-sm text-gray-600">In Offer</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 flex-1 min-w-[120px]">
                    <p className="text-3xl font-bold text-green-500">{req.stats?.hired || 0}</p>
                    <p className="text-sm text-gray-600">Hired</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    Created on {new Date(req.createdAt).toLocaleDateString()} by {req.createdBy?.name}
                  </span>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="flex items-center text-sm text-gray-600 hover:text-black">
                    <Users className="w-4 h-4 mr-1" />
                    Browse suitable candidates
                  </button>
                  <button
                    onClick={() => handleManageCandidates(req._id)}
                    className="flex items-center text-sm text-gray-600 hover:text-black"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Manage Candidates
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in Form Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isFormOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">New Internship Requirement</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-gray-50 p-3 rounded-lg mb-4 flex items-start">
              <Info className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
              <p className="text-xs text-gray-600">
                This will be shared with the candidates along with the interview request.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-xs font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                  >
                    <option value="" disabled>Select</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="product">Product</option>
                    <option value="sales">Sales</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="it">Information Technology</option>
                    <option value="operations">Operations</option>
                    <option value="customer_support">Customer Support</option>
                    <option value="research">Research & Development</option>
                    <option value="legal">Legal</option>
                    <option value="data">Data Science</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="careerField" className="block text-xs font-medium text-gray-700 mb-1">
                  Career Field <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="careerField"
                    value={formData.careerField}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                  >
                    <option value="" disabled>Select</option>
                    <option value="software">Software Development</option>
                    <option value="data">Data Analytics</option>
                    <option value="design">UI/UX Design</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="ai">Artificial Intelligence</option>
                    <option value="cloud">Cloud Computing</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="devops">DevOps</option>
                    <option value="finance">Financial Analysis</option>
                    <option value="product">Product Management</option>
                    <option value="hr">Human Resources</option>
                    <option value="blockchain">Blockchain Development</option>
                    <option value="sales">Sales</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Skills intern will learn <span className="text-red-500">*</span> (At least 3 required)
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="relative mb-2">
                    <select
                      id={`skillInternWillLearn-${index}`}
                      value={skill}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                    >
                      <option value="" disabled>
                        Select Skill {index + 1}
                      </option>
                      {skillOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                    {formData.skills.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="mt-1 text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Add Another Skill
                </button>
              </div>

              <div>
                <label htmlFor="roleDescription" className="block text-xs font-medium text-gray-700 mb-1">
                  Role description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="roleDescription"
                  value={formData.roleDescription}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                  placeholder="Describe the role and responsibilities for the candidate (minimum 200 characters)"
                  rows="4"
                ></textarea>
                <p className="text-xs text-gray-600 mt-1">
                  {3000 - (formData.roleDescription?.length || 0)} characters remaining
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end space-x-4">
            <button
              onClick={closeForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
              Save
            </button>
          </div>
        </div>
      </div>

      {isFormOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={closeForm}></div>}
    </div>
  );
}