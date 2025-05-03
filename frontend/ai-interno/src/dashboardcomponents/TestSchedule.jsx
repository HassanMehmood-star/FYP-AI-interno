"use client";

import { useState, useEffect } from "react";
import { Clock, Download, Upload, User, Mail, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const TestSchedule = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [testFile, setTestFile] = useState("");
  const [solutionFile, setSolutionFile] = useState(null);
  const [mcqs, setMcqs] = useState([]); // State to store MCQs
  const [selectedAnswers, setSelectedAnswers] = useState({}); // State to store selected answers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [totalTime, setTotalTime] = useState(3600);

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
      const internshipId = localStorage.getItem("internshipId");
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

      localStorage.setItem('internshipId', data.internshipId);
      console.log("Stored Internship ID in localStorage:", data.internshipId);

      if (!response.ok) {
        throw new Error(`❌ API Error: ${data.message || "Unknown error"}`);
      }

      if (data.isScheduled) {
        console.log("✅ [fetchTestDetails] Test is already scheduled!");
        setSubmitted(true);
        setLoading(false);
        setError("Test is already scheduled, please wait for the result.");
        return;
      }

      setUserData({ name: data.name, email: data.email });
      setTestFile(data.testFile);
      setMcqs(data.mcqs || []); // Store MCQs from API response
      console.log("👤 [fetchTestDetails] User data:", { name: data.name, email: data.email });
      console.log("📄 [fetchTestDetails] Test file:", data.testFile);
      console.log("📝 [fetchTestDetails] MCQs:", data.mcqs);

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

  const handleAnswerChange = (mcqIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [mcqIndex]: option,
    }));
    console.log("Selected answer for MCQ", mcqIndex, ":", option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    console.log("User ID from localStorage before submit:", userId);

    if (!solutionFile && Object.keys(selectedAnswers).length === 0) {
      alert("❌ Please upload your solution or answer at least one MCQ");
      return;
    }

    const internshipId = localStorage.getItem("internshipId");
    const industryPartnerId = localStorage.getItem("industryPartnerId");

    console.log("Internship ID from localStorage:", internshipId);
    console.log("Industry Partner ID from localStorage:", industryPartnerId);

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
    if (solutionFile) {
      formData.append("solution", solutionFile);
    }
    formData.append("userId", userId);
    formData.append("internshipId", internshipId);
    formData.append("industryPartnerId", industryPartnerId);
    formData.append("answers", JSON.stringify(selectedAnswers)); // Include selected answers

    console.log("FormData being sent:", formData);

    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5000/api/test-schedule/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unknown error while submitting");
      }

      setSubmitted(true);
      setSubmitting(false);
      setSuccessMessage("✅ Test successfully submitted!");
      alert("✅ Solution and answers submitted successfully");
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
        {successMessage && (
          <div className="bg-green-200 p-4 rounded-lg text-green-800 mb-4">
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

        {/* MCQ Section */}
        {mcqs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Multiple Choice Questions</h2>
              <form onSubmit={handleSubmit}>
                {mcqs.map((mcq, index) => (
                  <div key={index} className="mb-6 border-b pb-4">
                    <p className="font-medium text-lg mb-2">{index + 1}. {mcq.question}</p>
                    <div className="space-y-2">
                      {mcq.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`mcq-${index}`}
                            value={option}
                            checked={selectedAnswers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                            className="h-4 w-4 text-teal-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`mt-4 px-6 py-2 rounded-lg text-white font-medium ${
                    submitting ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Test"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Test Submission</h2>
            {testFile && (
              <div className="mb-4">
                <a
                  href={testFile}
                  download
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Test File</span>
                </a>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Upload className="h-5 w-5" />
                  Upload Solution
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  submitting ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSchedule;