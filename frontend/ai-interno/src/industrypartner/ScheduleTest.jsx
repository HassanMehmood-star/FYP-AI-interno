import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Clock, Upload } from "lucide-react";
import axios from "axios";  // Import axios to make API calls

// Define SimpleCalendar component
const SimpleCalendar = ({ onSelect }) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-3 w-64">
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
          &lt;
        </button>
        <div>{format(new Date(viewYear, viewMonth, 1), "MMMM yyyy")}</div>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} className="h-8 w-8"></div>
        ))}
        {days.map((day) => {
          const currentDate = new Date(viewYear, viewMonth, day);
          const isToday =
            today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;

          return (
            <button
              key={day}
              onClick={() => onSelect(currentDate)} // Handle date select
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                isToday ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ScheduleTest = () => {
  const location = useLocation();
  const { internshipId } = useParams();  // Get internshipId from URL
  const { selectedCandidates } = location.state || {}; // Get selected candidates from state
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [internship, setInternship] = useState(null);  // Store internship title here
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Add isCalendarOpen state for calendar visibility
  const [error, setError] = useState(null); // Track errors
  const [file, setFile] = useState(null); // State to track selected file
  const [isTestScheduled, setIsTestScheduled] = useState(false); // Track if the test is successfully scheduled
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/internships/${internshipId}`);
        console.log("Fetched internship:", response.data); // Check if `createdBy` exists
        if (response.data.success) {
          setInternship(response.data.internship); // Set internship title
        }
      } catch (error) {
        console.error("Error fetching internship:", error);
        setError(error.message); // Set error message in state for rendering
        alert("Failed to fetch internship data. Please check the console for more details.");
      }
    };

    fetchInternship();
  }, [internshipId]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate); // Update the selected date state
    setIsCalendarOpen(false); // Close calendar after selection
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update file state when a file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure 'file' is present before appending it to FormData
    if (!file) {
      alert("Please upload a test file.");
      return;
    }
  
    const formData = new FormData();
  
    // Map selected candidates to the required structure (userId, name, email)
    const candidateData = selectedCandidates.map(candidate => ({
      user: candidate.userId,
      name: candidate.name,
      email: candidate.email,
    }));
  
    // Get the industryPartnerId
    const industryPartnerId = internship?.createdBy?._id;
    if (!industryPartnerId) {
      alert("Industry Partner ID not found.");
      return;
    }
  
    // Append data to FormData
    formData.append('file', file);  // Test file
    formData.append('testDate', date);  // Test date
    formData.append('testTime', time);  // Test time
    formData.append('internshipId', internshipId);  // Original internship ID
    formData.append('candidates', JSON.stringify(candidateData));  // Pass candidates as a stringified array
    formData.append('industryPartnerId', industryPartnerId);  // Add industryPartnerId to form data
  
    try {
      // Send the POST request with form data
      const response = await axios.post('http://localhost:5000/api/schedule-test', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.data.success) {
        console.log('Test Scheduled:', response.data);
  
        // After successful test scheduling, store both internshipId and testScheduleId
        const newTestScheduleId = response.data.testScheduleId;  // Assuming testScheduleId is returned in the response
        const newInternshipId = response.data.internshipId || internshipId;  // If internshipId is also returned
  
        // Store both IDs in localStorage
        localStorage.setItem('internshipId', newInternshipId);  // Storing the internshipId
        localStorage.setItem('testScheduleId', newTestScheduleId);  // Storing the testScheduleId
  
        console.log("Internship ID stored:", newInternshipId);
        console.log("Test Schedule ID stored:", newTestScheduleId);
  
        // Update internship stats (interested and scheduled)
        setInternship(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            interested: prev.stats.interested - selectedCandidates.length,
            scheduled: prev.stats.scheduled + selectedCandidates.length,
          }
        }));
  
        // Set success message
        setSuccessMessage("Test has been successfully scheduled!");
        setIsTestScheduled(true); // Update test scheduled state
      } else {
        // If backend returns an error message, display it
        setError(response.data.message);  // Set error message from backend
      }
    } catch (error) {
      console.error('Error scheduling test:', error.response?.data || error.message);
      setError("Error scheduling test. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Error display */}
      {error && (
        <div className="bg-red-200 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Success display */}
      {isTestScheduled && successMessage && (
        <div className="bg-green-200 p-4 rounded">
          <strong>Success:</strong> {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Schedule Test for Internship {internship ? internship.title : "Loading..."}
          </h2>
          <p className="text-sm text-gray-500">Manage test schedules for selected candidates</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Internship</th>
                </tr>
              </thead>
              <tbody>
                {selectedCandidates && selectedCandidates.length > 0 ? (
                  selectedCandidates.map((candidate) => (
                    <tr key={candidate.applicationId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{candidate.name}</td>
                      <td className="py-3 px-4">{candidate.email}</td>
                      <td className="py-3 px-4">{internship ? internship.title : "Loading..."}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-3 px-4 text-center text-sm text-gray-500">
                      No candidates selected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Date, Time, and File Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Schedule Test Time</h2>
          <p className="text-sm text-gray-500">Set the date and time for the test</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="test-date" className="block text-sm font-medium text-gray-700">
                Test Date
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white text-left"
                >
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{date ? format(date, "PPP") : "Select date"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                {isCalendarOpen && (
                  <div className="absolute mt-1 z-10">
                    <SimpleCalendar onSelect={handleDateSelect} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="test-time" className="block text-sm font-medium text-gray-700">
                Test Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  id="test-time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2 mt-6">
            <label htmlFor="test-material" className="block text-sm font-medium text-gray-700">
              Upload Test Materials
            </label>
            <div className="border-2 border-dashed border-gray-300 p-10 text-center rounded-md hover:bg-gray-50 transition-colors">
              <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-medium">Drop files here or click to upload</h3>
              <p className="text-sm text-gray-500 mt-1">Support for PDF, DOCX, and other document formats</p>
              <input
                id="test-material"
                name="file"  // Add the 'name' attribute and ensure it matches the backend
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => document.getElementById("test-material")?.click()}
                className="mt-4 bg-teal-600 text-white py-2 px-4 rounded-md"
              >
                Upload Files
              </button>
            </div>
            {file && (
              <div className="mt-2 text-sm text-gray-500">
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md">
              Schedule Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTest;
