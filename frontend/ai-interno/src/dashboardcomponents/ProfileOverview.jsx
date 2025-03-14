import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const ProfileOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await fetch("http://localhost:5000/api/profile/profile-overview", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Generate PDF
  const handleDownloadPDF = () => {
    if (!user) return;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255);  // Blue for the title
    doc.text("Profile Overview", 10, 10);

    // User Information Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);  // Black for content
    doc.text(`Name: ${user.user.name}`, 10, 30);
    doc.text(`Email: ${user.user.email}`, 10, 40);
    doc.text(`Phone: ${user.phone || "N/A"}`, 10, 50);
    doc.text(`Address: ${user.address || "N/A"}`, 10, 60);

    // Experience Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Experience", 10, 80);
    if (user.experience.length > 0) {
      user.experience.forEach((job, index) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${job.title}`, 10, 90 + (index * 30));
        doc.text(`${job.duration}`, 10, 100 + (index * 30));
        doc.text(`${job.description}`, 10, 110 + (index * 30));
      });
    } else {
      doc.text("No experience information stored.", 10, 90);
    }

    // Education Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Education", 10, 150);
    if (user.education.length > 0) {
      user.education.forEach((edu, index) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${edu.degree}`, 10, 160 + (index * 30));
        doc.text(`${edu.institute}`, 10, 170 + (index * 30));
        doc.text(`${edu.year}`, 10, 180 + (index * 30));
      });
    } else {
      doc.text("No education information stored.", 10, 160);
    }

    // Interests Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Interests", 10, 220);
    if (user.interests.length > 0) {
      user.interests.forEach((interest, index) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(interest, 10, 230 + (index * 10));
      });
    } else {
      doc.text("No interests information stored.", 10, 230);
    }

    // Skills Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Skills", 10, 270);
    if (user.skills.technical.length > 0) {
      user.skills.technical.forEach((skill, index) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(skill, 10, 280 + (index * 10));
      });
    } else {
      doc.text("No skills information stored.", 10, 280);
    }

    // Save the PDF
    doc.save("profile-overview.pdf");
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state if user is null
  if (!user) {
    return <div>Failed to load profile.</div>;
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-screen">
      <div className="bg-white w-full max-w-5xl flex flex-col md:flex-row shadow-lg mb-10">
        {/* Left Sidebar */}
        <div className="bg-gray-900 text-white w-full md:w-1/3 p-6">
          <div className="flex justify-center mb-6">
            <img
              src={user.photo || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-yellow-400"
            />
          </div>
          <h2 className="text-lg font-bold mb-4 text-center md:text-left">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <i className="fas fa-phone-alt mr-2"></i> {user.phone || "No information stored"}
            </li>
            <li>
              <i className="fas fa-envelope mr-2"></i> {user.user.email}
            </li>
            <li>
              <i className="fas fa-map-marker-alt mr-2"></i> {user.address || "No information stored"}
            </li>
          </ul>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-2/3 p-6">
          {/* Name and Title */}
          <div className="border-b-2 border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center md:text-left">
              {user.user.name}
            </h1>
          </div>

          {/* Job Experience */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Experience</h2>
            {user.experience.length > 0 ? (
              user.experience.map((job, index) => (
                <div className="mb-4" key={index}>
                  <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-gray-600 text-sm">{job.duration}</p>
                  <p className="text-gray-700 text-sm">{job.description}</p>
                </div>
              ))
            ) : (
              <p>No experience information stored.</p>
            )}
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
            {user.education.length > 0 ? (
              user.education.map((edu, index) => (
                <div className="mb-4" key={index}>
                  <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600 text-sm">{edu.institute}</p>
                  <p className="text-gray-600 text-sm">{edu.year}</p>
                </div>
              ))
            ) : (
              <p>No education information stored.</p>
            )}
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Interests</h2>
            {user.interests.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700 text-sm">
                {user.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p>No interests information stored.</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            {user.skills.technical.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {user.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 text-xs py-2 px-4 mr-2 mb-2 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No skills information stored.</p>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-4 mb-4 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ProfileOverview;
