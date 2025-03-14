import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { motion } from 'framer-motion';
const AdminNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("userPartner"); // Default tab
  const [notes, setNotes] = useState([]); // Sticky notes state
  const [newNote, setNewNote] = useState(""); // New note input field

  // Notification Categories
  const notifications = {
    userPartner: [
      "New user John Doe registered.",
      "Industry Partner TechCorp joined the platform.",
      "User Alice added to Hall of Fame.",
    ],
    internshipUpdates: [
      "Internship 'Web Development Basics' added by Innovate Inc.",
      "Internship 'Data Science 101' completed.",
      "AI detected high demand for Machine Learning internships.",
    ],
    performanceEngagement: [
      "Mentor feedback received for intern Mark.",
      "Entry test scores available for review.",
      "Certificate issued to Jane for 'UI/UX Design Internship'.",
    ],
  };

  // Add a new sticky note
  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote(""); // Clear the input field after adding the note
    }
  };

  // Delete a sticky note
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="relative p-4 flex">

      
      {/* Left Half: Sticky Notes Section */}
      <div className="w-1/2 p-4 bg-gray">
        <h3 className="text-lg font-semibold mb-2">Sticky Notes</h3>

        {/* Add Note Input */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none"
            placeholder="Write a sticky note..."
          />
          <button
            onClick={addNote}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Display Notes */}
        <div className="space-y-2">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-yellow-100 p-3 rounded-lg"
              >
                <p className="text-gray-700">{note}</p>
                <button
                  onClick={() => deleteNote(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No sticky notes available.</p>
          )}
        </div>
      </div>

      {/* Right Half: Notifications Section */}
      <div className="w-1/2 p-4 bg-gray border-l">
        {/* Notification Icon with Count */}
        <div
  className="cursor-pointer flex items-center justify-center bg-gray-500 text-white p-3 rounded-full hover:scale-105 transform transition-transform duration-300 ease-in-out mt-8"  // Added margin-top
  onClick={() => setShowNotifications(!showNotifications)}
>
  <FaBell className="text-2xl animate-pulse" />
  <div className="bg-red-500 text-white text-xs font-semibold rounded-full absolute top-0 right-0 -mr-2 -mt-2 px-2 py-1">
    {/* Total Notification Count */}
    {Object.values(notifications).reduce((acc, curr) => acc + curr.length, 0)}
  </div>
</div>


        {/* Notifications Dropdown */}
        {showNotifications && (
          <div
            className="absolute right-0 mt-5 w-90 bg-white shadow-lg rounded-lg p-4 z-10 transform transition-all duration-500 ease-out scale-100 opacity-100"
            style={{
              transform: showNotifications ? "translateY(10px)" : "translateY(-10px)",
              opacity: showNotifications ? 1 : 0,
              top: "60px", // Increase this value to shift the notification dropdown lower
            }}
          >
            {/* Tabs for Notification Categories */}
            <div className="flex space-x-4 mb-4 border-b pb-2">
              <button
                className={`text-sm px-4 py-2 transition-colors duration-300 ease-in-out ${
                  activeTab === "userPartner"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-blue-400"
                }`}
                onClick={() => setActiveTab("userPartner")}
              >
                User & Partner Activity
              </button>
              <button
                className={`text-sm px-4 py-2 transition-colors duration-300 ease-in-out ${
                  activeTab === "internshipUpdates"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-blue-400"
                }`}
                onClick={() => setActiveTab("internshipUpdates")}
              >
                Internship Updates
              </button>
              <button
                className={`text-sm px-4 py-2 transition-colors duration-300 ease-in-out ${
                  activeTab === "performanceEngagement"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-blue-400"
                }`}
                onClick={() => setActiveTab("performanceEngagement")}
              >
                Performance & Engagement
              </button>
            </div>

            {/* Notifications for Active Tab */}
            <div
              className="space-y-2 text-sm text-gray-700"
              style={{
                animation: "fade-in 0.5s ease-in-out",
              }}
            >
              {notifications[activeTab].length > 0 ? (
                notifications[activeTab].map((notif, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
                  >
                    <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 animate-bounce"></span>
                    <p>{notif}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No notifications available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
