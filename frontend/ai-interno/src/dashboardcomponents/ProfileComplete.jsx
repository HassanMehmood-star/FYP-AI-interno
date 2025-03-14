import React, { useState, useEffect } from "react";
import axios from "axios";
// import pic from '../../../../mern-server/uploads/sample.jpeg'
const ProfileForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
  const [page, setPage] = useState(1); // Track the current page
  const [profile, setProfile] = useState({
    photo: "",
    phone: "",
    address: "",
    education: [{ degree: "", institute: "", year: "" }],
    skills: { technical: [], soft: [] },
    experience: [{ title: "", duration: "", description: "" }],
    interests: [],
  });

  const [filePath, setFilePath] = useState(""); 

    // Fetch the user's profile data
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
      
          // Fetch the profile
          const response = await axios.get("http://localhost:5000/api/profile/get-profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.data.success) {
            setProfile(response.data.profile); // Populate the form with fetched data
          }
        } catch (err) {
          console.error("Error fetching profile:", err.response?.data || err.message);
          setError("Failed to fetch profile data.");
        } finally {
          setLoading(false);
        }
      };
      
  
      fetchProfile();
    }, []);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFilePath(file.name); // Display the selected file name
      }
    };


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleInputChange = (e, section, index, key) => {
    if (section === "education" || section === "experience") {
      const updatedSection = [...profile[section]];
      updatedSection[index][key] = e.target.value;
      setProfile({ ...profile, [section]: updatedSection });
    } else if (section === "skills") {
      setProfile({ ...profile, skills: { ...profile.skills, [key]: e.target.value.split(",") } });
    } else if (section === "interests") {
      const updatedInterests = [...profile.interests];
      updatedInterests[index] = e.target.value;
      setProfile({ ...profile, interests: updatedInterests });
    } else {
      setProfile({ ...profile, [section]: e.target.value });
    }
  };

  // Add new section for education, experience, or interests
  const addSection = (section) => {
    if (section === "education") {
      setProfile({ ...profile, education: [...profile.education, { degree: "", institute: "", year: "" }] });
    } else if (section === "experience") {
      setProfile({ ...profile, experience: [...profile.experience, { title: "", duration: "", description: "" }] });
    } else if (section === "interests") {
      setProfile({ ...profile, interests: [...profile.interests, ""] });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/profile/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.success) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          photo: response.data.fileUrl, // Set the full file URL
        }));
        alert("Photo uploaded successfully!");
      }
    } catch (err) {
      console.error("Error uploading photo:", err.response?.data || err.message);
      alert("Failed to upload photo. Please try again.");
    }
  };
  
  

  // Save the current section's data
  const saveSection = async (section) => {
    try {
      const token = localStorage.getItem("token");
  
      let data;
      switch (section) {
        case "profile":
          data = {
            photo: profile.photo,
            phone: profile.phone,
            address: profile.address,
          };
          break;
        case "education":
          data = profile.education;
          break;
        case "skills":
          data = profile.skills;
          break;
        case "experience":
          data = profile.experience;
          break;
        case "interests":
          data = profile.interests;
          break;
        default:
          alert("Invalid section specified.");
          return;
      }
  
      const response = await axios.post(
        "http://localhost:5000/api/profile/save",
        { section, data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success && response.data.message === "Information is already stored.") {
        alert("The information is already stored in the database.");
      } else if (!response.data.success) {
        alert(response.data.message); // "Please update the profile with the new values."
      } else {
        alert("Profile section saved successfully.");
      }
    } catch (err) {
      console.error("Error saving section:", err.response?.data || err.message);
      alert(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };
  
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save the current section's data
  const handleDeletePicture = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Send request to the server to delete the picture
      const response = await axios.delete("http://localhost:5000/api/profile/delete-picture", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        // Clear the photo from local state after successful deletion
        setProfile((prevProfile) => ({
          ...prevProfile,
          photo: "", // Clear photo from the profile state
        }));
        alert("Profile picture deleted successfully");
      } else {
        // Show the error message sent by the backend (if any)
        alert(response.data.message || "Failed to delete picture");
      }
    } catch (err) {
      // If there is a network or server error
      console.error("Error deleting picture:", err);
  
      // Check if the error message is specifically "Profile picture file not found on the server"
      if (err.response && err.response.data && err.response.data.message === "Profile picture file not found on the server") {
        alert("Profile picture not found on the server.");
      } else {
        alert("Error deleting picture. Please try again.");
      }
    }
  };
  
  const handleNextClick = () => {
    console.log('hello');
  
    // Check if the required fields are filled
    if (!profile.phone || !profile.address) {
      setSuccessMessage("Please fill out all the details before proceeding."); // Show warning
      return;
    }
  
    // If all fields are valid, set success message and navigate to the next page
    setSuccessMessage("Details successfully submitted! Proceeding to the next step.");
    
    // Add a delay for better user experience (optional)
    setTimeout(() => {
      handleNext(); // Function to navigate to the next section
    }, 1000); // 1 second delay
  };
  const handleNext = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
  };


  const handleNextClick1 = () => {
  
    // Check if the education fields are filled
    const hasIncompleteEducation = profile.education.some(
      (edu) => !edu.degree || !edu.institute || !edu.year
    );
  
    if (hasIncompleteEducation) {
  
      setSuccessMessage("Please complete all education details before proceeding.");
      return; // Prevent navigating to the next page if any education field is missing
    }
  
    // If all education fields are valid, set success message and proceed
    setSuccessMessage("Education details successfully submitted! Proceeding to the next step.");
  
    // Add a delay for better user experience (optional)
    setTimeout(() => {
      handleNext(); // Function to navigate to the next section
    }, 1000); // 1 second delay
  };
  
  const handleNext1 = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number to navigate to the next section
  };
  
  
  const handleNextClick2 = () => {
    // Check if the skills fields are filled
    const hasIncompleteSkills = !profile.skills.technical.length || !profile.skills.soft.length;
  
    if (hasIncompleteSkills) {
      setSuccessMessage("Please complete all skills details before proceeding.");
      return; // Prevent navigating to the next page if any skills field is missing
    }
  
    // If all skills fields are valid, set success message and proceed
    setSuccessMessage("Skills details successfully submitted! Proceeding to the next step.");
  
    // Add a delay for better user experience (optional)
    setTimeout(() => {
      handleNext(); // Function to navigate to the next section
    }, 1000); // 1 second delay
  };
  

  const handleNextClick3 = () => {
    console.log('3')
    // Check if the experience fields are filled
    const hasIncompleteExperience = profile.experience.some(
      (exp) => !exp.title || !exp.duration || !exp.description
    );
  
    if (hasIncompleteExperience) {
      setSuccessMessage("Please complete all experience details before proceeding.");
      return; // Prevent navigating to the next page if any experience field is missing
    }
  
    // If all experience fields are valid, set success message and proceed
    setSuccessMessage("Experience details successfully submitted! Proceeding to the next step.");
  
    // Add a delay for better user experience (optional)
    setTimeout(() => {
      handleNext(); // Function to navigate to the next section
    }, 1000); // 1 second delay
  };
  
  const toggleEducationEdit = () => {
    setIsEditingEducation(!isEditingEducation); // Toggle edit mode
  };
  
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Page Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-6">
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className={`py-2 px-5 rounded-md text-white transition duration-300 ease-in-out ${
      page === 1
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    Previous
  </button>
  
  <span className="text-lg font-semibold text-gray-700">Page {page}</span>
  
  <button
    onClick={() => setPage(page + 1)}
    disabled={page === 5} // Replace 5 with the max page number if necessary
    className={`py-2 px-5 rounded-md text-white transition duration-300 ease-in-out ${
      page === 5
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    Next
  </button>
</div>


      {/* Profile Information */}
      {page === 1 && (
  <div>
    <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
    {successMessage && (
        <div
          className={`${
            successMessage.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } p-3 rounded-md mb-4`}
        >
          {successMessage}
        </div>
      )}

    {/* Profile Picture */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Profile Picture</label>
      {profile.photo ? (
        <div className="mb-4">
          <button
            onClick={handleDeletePicture}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Delete Picture
          </button>
        </div>
      ) : (
        <p>No profile picture uploaded</p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={!isEditing}
        className="block w-full border-gray-300 rounded-md"
      />
    </div>

    {/* Phone Number */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Phone Number</label>
      <input
        type="text"
        value={profile.phone}
        onChange={(e) => handleInputChange(e, "phone")}
        className="block w-full border-gray-300 rounded-md"
        disabled={!isEditing}
      />
    </div>

    {/* Address */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Address</label>
      <textarea
        value={profile.address}
        onChange={(e) => handleInputChange(e, "address")}
        className="block w-full border-gray-300 rounded-md"
        disabled={!isEditing}
      />
    </div>

    {/* Buttons */}
    <div className="flex justify-between items-center mt-4">
      {/* Left Buttons */}
      <div className="flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={() => saveSection("profile")}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              onClick={toggleEditMode}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditMode}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Right-Aligned Next Button */}
      <div>
       <button
  onClick={handleNextClick} // This passes the function correctly
  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
>
  Next
</button>

      </div>
    </div>
  </div>
)}


      {/* Education Section */}
      {page === 2 && (
  <div className="relative">
    <h2 className="text-2xl font-bold mb-4">Education</h2>

    {successMessage && (
        <div
          className={`${
            successMessage.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } p-3 rounded-md mb-4`}
        >
          {successMessage}
        </div>
      )}
    {profile.education.map((edu, index) => (
      <div key={index} className="mb-6">
        {/* Degree Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Degree</label>
          <input
            type="text"
            value={edu.degree}
            onChange={(e) => handleInputChange(e, "education", index, "degree")}
            className="block w-full border-gray-300 rounded-md"
          />
        </div>

        {/* Institute Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Institute Name</label>
          <input
            type="text"
            value={edu.institute}
            onChange={(e) => handleInputChange(e, "education", index, "institute")}
            className="block w-full border-gray-300 rounded-md"
          />
        </div>

        {/* Year of Graduation Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Year of Graduation</label>
          <input
            type="text"
            value={edu.year}
            onChange={(e) => handleInputChange(e, "education", index, "year")}
            className="block w-full border-gray-300 rounded-md"
          />
        </div>
      </div>
    ))}

    {/* Add Education Button */}
    <button
      onClick={() =>
        setProfile((prevProfile) => ({
          ...prevProfile,
          education: [...prevProfile.education, { degree: "", institute: "", year: "" }],
        }))
      }
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
    >
      Add Education
    </button>

    {/* Gap between buttons */}
    <div className="mt-6"></div>

    {/* Edit Button */}
    <button
      onClick={toggleEdit}
      className={`bg-${isEditing ? "red" : "green"}-500 text-white py-2 px-4 rounded-md hover:bg-${isEditing ? "red" : "green"}-600 mt-4 mr-4`}
    >
      {isEditing ? "Cancel Edit" : "Edit Education"}
    </button>

    {/* Save Button */}
    {isEditing && (
      <button
        onClick={() => saveSection("education")}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-4"
      >
        Save Changes
      </button>
    )}

    {/* Next Button - Positioned to the bottom-right */}
    <button   onClick={handleNextClick1} 
     
      className="absolute bottom-0 right-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4 mr-4"
    >
      Next
    </button>
  </div>
)}


      {/* Skills Section */}
      {page === 3 && (
  <div className="relative">
    <h2 className="text-2xl font-bold mb-4">Skills</h2>
    {successMessage && (
        <div
          className={`${
            successMessage.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } p-3 rounded-md mb-4`}
        >
          {successMessage}
        </div>
      )}
    {/* Technical Skills Input */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Technical Skills</label>
      <input
        type="text"
        value={profile.skills.technical.join(",")}
        onChange={(e) => handleInputChange(e, "skills", null, "technical")}
        className="block w-full border-gray-300 rounded-md"
        placeholder="E.g., React, JavaScript, Tailwind CSS"
        disabled={!isEditing}
      />
    </div>
    
    {/* Soft Skills Input */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Soft Skills</label>
      <input
        type="text"
        value={profile.skills.soft.join(",")}
        onChange={(e) => handleInputChange(e, "skills", null, "soft")}
        className="block w-full border-gray-300 rounded-md"
        placeholder="E.g., Communication, Teamwork"
        disabled={!isEditing}
      />
    </div>

    {/* Edit Button */}
    <button
      onClick={toggleEdit}
      className={`bg-${isEditing ? 'red' : 'green'}-500 text-white py-2 px-4 rounded-md hover:bg-${isEditing ? 'red' : 'green'}-600 mb-4 mr-4`}
    >
      {isEditing ? "Cancel Edit" : "Edit Skills"}
    </button>

    {/* Save Button */}
    {isEditing && (
      <button
        onClick={() => saveSection("skills")}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-4"
      >
        Save Skills
      </button>
    )}

    {/* Next Button */}
    <button
      onClick={handleNextClick2}
      className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
    >
      Next
    </button>
  </div>
)}


      {/* Experience Section */}
      {page === 4 && (
  <div className="relative">
    <h2 className="text-2xl font-bold mb-4">Experience</h2>

    {successMessage && (
      <div
        className={`${
          successMessage.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        } p-3 rounded-md mb-4`}
      >
        {successMessage}
      </div>
    )}

    {/* Mapping through experience */}
    {profile.experience.map((exp, index) => (
      <div key={index} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={exp.title}
            onChange={(e) => handleInputChange(e, "experience", index, "title")}
            className="block w-full border-gray-300 rounded-md"
            disabled={!isEditing} // Disable input when not in edit mode
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Duration</label>
          <input
            type="text"
            value={exp.duration}
            onChange={(e) => handleInputChange(e, "experience", index, "duration")}
            className="block w-full border-gray-300 rounded-md"
            disabled={!isEditing} // Disable input when not in edit mode
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={exp.description}
            onChange={(e) => handleInputChange(e, "experience", index, "description")}
            className="block w-full border-gray-300 rounded-md"
            disabled={!isEditing} // Disable textarea when not in edit mode
          />
        </div>
      </div>
    ))}

    <div className="flex space-x-4">
      {/* Add New Experience Button */}
      <button
        onClick={() => {
          addSection("experience"); // Add a new experience
          setIsEditing(true); // Enable edit mode immediately after adding
        }}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Add New Experience
      </button>

      {/* Toggle Edit Button */}
      <button
        onClick={toggleEdit}
        className={`bg-${isEditing ? "red" : "green"}-500 text-white py-2 px-6 rounded-md hover:bg-${isEditing ? "red" : "green"}-600`}
      >
        {isEditing ? "Cancel Edit" : "Edit Experience"}
      </button>

      {/* Save Changes Button */}
      {isEditing && (
        <button
          onClick={() => saveSection("experience")}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600"
        >
          Save Changes
        </button>
      )}
    </div>

    {/* Next Button at the bottom right */}
    <button
      onClick={handleNextClick3}
      className="absolute bottom-0 right-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
    >
      Next
    </button>
  </div>
)}



      {/* Interests Section */}
      {page === 5 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Interests</h2>
          {profile.interests.map((interest, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium mb-2">Interest</label>
              <input
                type="text"
                value={interest}
                onChange={(e) => handleInputChange(e, "interests", index)}
                className="block w-full border-gray-300 rounded-md"
                placeholder="E.g., Reading, Traveling"
              />
            </div>
          ))}
          <button
            onClick={() => addSection("interests")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            + Add More Interests
          </button>
          <button
            onClick={() => saveSection("interests")}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 ml-4"
          >
            Save Interests
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
