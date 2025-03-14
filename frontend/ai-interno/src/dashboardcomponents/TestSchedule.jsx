"use client";

import { useState, useEffect } from "react";
import { Clock, Download, Upload, User, Mail, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const TestSchedule = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [testFile, setTestFile] = useState("");
  const [solutionFile, setSolutionFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Primary state for submission status
  const [successMessage, setSuccessMessage] = useState(""); 
  const [totalTime, setTotalTime] = useState(3600); // Default to 1 hour

  useEffect(() => {
    const internshipId = localStorage.getItem("internshipId");
    console.log("🟢 Internship ID on mount:", internshipId);
    if (internshipId) {
      fetchTestDetails();
    } else {
      console.log("❌ Internship ID not found");
    }
  }, []);
  
  
  

  const fetchTestDetails = async () => {
    console.log("🔍 [fetchTestDetails] Starting execution...");
    try {
      const token = localStorage.getItem("token");
    const internshipId = localStorage.getItem("internshipId"); // Get internshipId from localStorage
    console.log("🛑 Token:", token);
    console.log("🛑 Internship ID:", internshipId);
    if (!token || !internshipId) {
      throw new Error("❌ No token or internshipId found!");
    }

    const response = await fetch(`/api/test-schedule/details?internshipId=${internshipId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("📋 [fetchTestDetails] Response data:", data);

    // Update the internshipId in localStorage to the correct value after fetching
    localStorage.setItem('internshipId', data.internshipId); // This ensures the latest internshipId is saved

    // Now, data.internshipId contains the most recent internshipId, which will be used for submission
    console.log("Stored Internship ID in localStorage:", data.internshipId);
  
     
  
      
  
      if (!response.ok) {
        throw new Error(`❌ API Error: ${data.message || "Unknown error"}`);
      }
  
      // Check if test is already scheduled
      if (data.isScheduled) {
        console.log("✅ [fetchTestDetails] Test is already scheduled!");
        setSubmitted(true); // Set the submitted state to true
        setLoading(false); // Stop loading state
        setError("Test is already scheduled, please wait for the result.");
        return; // Exit the function early to prevent further logic
      }
  
      // Proceed with other logic if the test is not scheduled
      setUserData({ name: data.name, email: data.email });
      setTestFile(data.testFile);
      console.log("👤 [fetchTestDetails] User data:", { name: data.name, email: data.email });
      console.log("📄 [fetchTestDetails] Test file:", data.testFile);

      // Save industryPartnerId if present in the API response
      if (data.industryPartnerId) {
        localStorage.setItem("industryPartnerId", data.industryPartnerId);
      }
      console.log("📋 [fetchTestDetails] Industry Partner ID stored:", data.industryPartnerId);
  
      const now = new Date();
      const testDateTime = new Date(data.testDate);
      let hours = 0, minutes = 0;
      if (data.testTime) {
        [hours, minutes] = data.testTime.split(":").map(Number);
      } else {
        console.warn("⚠️ [fetchTestDetails] testTime is null, defaulting to 00:00");
      }
      testDateTime.setHours(hours, minutes, 0, 0);
  
      const nowUtc = new Date(now.toISOString());
      const testDuration = data.durationInSeconds || 3600;
      setTotalTime(testDuration);
  
      console.log("⏰ [fetchTestDetails] Current time (UTC):", nowUtc);
      console.log("🕒 [fetchTestDetails] Test start time:", testDateTime);
      console.log("⏳ [fetchTestDetails] Test duration (seconds):", testDuration);
  
      if (nowUtc >= testDateTime) {
        console.log("✅ [fetchTestDetails] Test has started or is ongoing...");
        const storedInternshipId = localStorage.getItem("internshipId");
        let initialTimeLeft = testDuration;
  
        if (!storedInternshipId || storedInternshipId !== internshipId) {
          console.log("🆕 [fetchTestDetails] New session detected, setting full duration");
          initialTimeLeft = testDuration;
          localStorage.setItem("timeLeft", testDuration);
          localStorage.setItem("startTime", Date.now());
          localStorage.setItem("internshipId", internshipId);
          localStorage.setItem("userId", data.userId || "temp-user-id");
        } else {
          const startTime = Number(localStorage.getItem("startTime"));
          const elapsedSinceStart = Math.floor((Date.now() - startTime) / 1000);
  
          console.log("🕒 [fetchTestDetails] Stored startTime:", startTime);
          console.log("⏱️ [fetchTestDetails] Elapsed since start (seconds):", elapsedSinceStart);
  
          if (isNaN(startTime) || elapsedSinceStart < 0 || elapsedSinceStart > testDuration) {
            console.log("⚠️ [fetchTestDetails] Invalid startTime or elapsed time, resetting...");
            initialTimeLeft = testDuration;
            localStorage.setItem("timeLeft", testDuration);
            localStorage.setItem("startTime", Date.now());
          } else {
            initialTimeLeft = Math.max(testDuration - elapsedSinceStart, 0);
            console.log("⏲️ [fetchTestDetails] Calculated remaining time:", initialTimeLeft);
            localStorage.setItem("timeLeft", initialTimeLeft);
          }
        }
  
        console.log("⏳ [fetchTestDetails] Initial time left set to:", initialTimeLeft);
        setTimeLeft(initialTimeLeft);
        setTestStarted(true);
        console.log("🚀 [fetchTestDetails] Test started!");
      } else {
        const errorMsg = `⏳ Test has not yet started. It will start at ${testDateTime.toLocaleString()}`;
        console.log("⏳ [fetchTestDetails] ", errorMsg);
        setError(errorMsg);
      }
  
      console.log("🏁 [fetchTestDetails] Completed successfully");
      setLoading(false);
    } catch (err) {
      console.error("🚨 [fetchTestDetails] Error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!testStarted || submitted || timeLeft <= 0) {
      console.log("Timer not starting due to:", { testStarted, submitted, timeLeft });
      return;
    }

    console.log("⏲️ Starting timer with timeLeft:", timeLeft);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          console.log("⏰ Timer reached zero");
          return 0;
        }
        const updatedTime = prev - 1;
        localStorage.setItem("timeLeft", updatedTime);
        return updatedTime;
      });
    }, 1000);

    return () => {
      console.log("🧹 Cleaning up timer");
      clearInterval(timer);
    };
  }, [testStarted, submitted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimePercentage = () => {
    return (timeLeft / totalTime) * 100;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      setSolutionFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Retrieve userId from localStorage
    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage before submit:", userId);  // Debugging line
  
    if (!solutionFile) {
      alert("❌ Please upload your solution first");
      return;
    }
  
    // Retrieve other data from localStorage
    const internshipId = localStorage.getItem("internshipId");
    const industryPartnerId = localStorage.getItem("industryPartnerId");
  
    console.log("Internship ID from localStorage:", internshipId);
    console.log("Industry Partner ID from localStorage:", industryPartnerId);
  
    // Check if essential data is available
    if (!internshipId || !userId || !industryPartnerId) {
      alert("❌ Missing internshipId, userId, or industryPartnerId. Please log in again.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ No token found. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("solution", solutionFile);
    formData.append("userId", userId);  // Debugging line: Ensure userId is appended
    formData.append("internshipId", internshipId);
    formData.append("industryPartnerId", industryPartnerId);
  
    console.log("FormData being sent:", formData);  // Log the FormData to verify it's correct
  
    try {
      const response = await fetch("http://localhost:5000/api/test-schedule/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log("API Response:", data);  // Log the API response to verify the submission
  
      if (!response.ok) {
        throw new Error(data.message || "Unknown error while submitting");
      }
  
      setSubmitted(true);
      setSubmitting(false);
      setSuccessMessage("✅ Test successfully submitted!");
      alert("✅ Solution submitted successfully");
    } catch (err) {
      setSubmitting(false);
      alert(`❌ Error: ${err.message}`);
    }
  };
  
  


  

  
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-medium">Loading test details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 flex items-center justify-center p-4">

 {/* Success Message */}
 {successMessage && (
          <div className="bg-green-200 p-4 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h2>Test Not Available</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
              <p className="text-base">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h2>Test Status</h2>
            </div>
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              <p className="text-base">Test is submitted, please wait for the result.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Timer */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-600 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Online Test Portal</h1>
                <p className="text-blue-100 mt-1">Complete your test within the allocated time</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <Clock className="h-6 w-6" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <div className="w-full mt-2 bg-white/30 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      timeLeft < 300 ? "bg-red-400" : timeLeft < 900 ? "bg-amber-300" : "bg-green-400"
                    }`}
                    style={{ width: `${getTimePercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Candidate Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Paper Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xl font-bold">
                <FileText className="h-5 w-5 text-teal-600" />
                <h2>Test Paper</h2>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded border border-blue-200">
                PDF Document
              </span>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={`http://localhost:5000/${testFile}`}
                title="Test Paper"
                className="w-full h-[450px] border-0"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={`http://localhost:5000/${testFile}`}
                download="test-paper.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Test Paper
              </a>
            </div>
          </div>
        </div>

        {/* Submission Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <Upload className="h-5 w-5 text-blue-600" />
              <h2>Submit Your Solution</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Upload your completed solution as a PDF file (Submit anytime before time runs out)
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full cursor-pointer"
                    disabled={timeLeft === 0 || submitted}
                  />
                  {solutionFile && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{solutionFile.name}</span>
                      <span className="text-gray-500">({Math.round(solutionFile.size / 1024)} KB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={timeLeft === 0 || !solutionFile || submitting || submitted}
                  className={`px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 ${
                    timeLeft === 0 || !solutionFile || submitting || submitted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submitted
                    </>
                  ) : timeLeft === 0 ? (
                    "Time Up"
                  ) : (
                    "Submit Test"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Time Warning */}
        {timeLeft < 300 && timeLeft > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
            <p>Less than 5 minutes remaining! Please submit your test soon.</p>
          </div>
        )}

        {timeLeft === 0 && !submitted && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>Time is up! You can no longer submit your test.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSchedule;