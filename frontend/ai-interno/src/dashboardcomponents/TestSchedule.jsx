"use client";

import { useState, useEffect } from "react";
import { Clock, Download, User, Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

const TestSchedule = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [testFile, setTestFile] = useState("");
  const [solutionFile, setSolutionFile] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [totalTime, setTotalTime] = useState(3600);
  const [internshipIdState, setInternshipIdState] = useState(localStorage.getItem("internshipId") || "");

  // Validate MongoDB ObjectId
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    console.log("🟢 [useEffect] Initializing TestSchedule component");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ [useEffect] No token found, redirecting to login");
      setError("Please log in to access the test.");
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    console.log("🔍 [fetchTestDetails] Starting execution...");
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 [fetchTestDetails] Token:", token);

      if (!token) {
        throw new Error("No token found! Please log in again.");
      }

      const response = await fetch("http://localhost:5000/api/test-schedule/details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("📋 [fetchTestDetails] Full response data:", data);

      if (!response.ok) {
        if (response.status === 401) {
          console.error("❌ [fetchTestDetails] Unauthorized, redirecting to login...");
          localStorage.removeItem("token");
          localStorage.removeItem("internshipId");
          window.location.href = "/login";
          return null;
        }
        throw new Error(`API Error: ${data.message || "Unknown error"}`);
      }

      if (!data.internshipId || !isValidObjectId(data.internshipId)) {
        throw new Error("Invalid or missing internshipId in response");
      }

      setInternshipIdState(data.internshipId);
      localStorage.setItem("internshipId", data.internshipId);
      console.log("✅ [fetchTestDetails] Stored internshipId:", data.internshipId);

      if (data.industryPartnerId) {
        localStorage.setItem("industryPartnerId", data.industryPartnerId);
      }
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
      }

      setUserData({ name: data.name, email: data.email });
      setTestFile(data.testFile || "");
      setMcqs(data.mcqs || []);

      const now = new Date();
      const testDateTime = new Date(data.testDate);
      let hours = 0,
        minutes = 0;
      if (data.testTime) {
        [hours, minutes] = data.testTime.split(":").map(Number);
      }
      testDateTime.setHours(hours, minutes, 0, 0);

      const nowUtc = new Date(now.toISOString());
      const testDuration = data.durationInSeconds || 3600;
      setTotalTime(testDuration);

      if (nowUtc >= testDateTime) {
        let initialTimeLeft = testDuration;
        if (!localStorage.getItem("startTime") || localStorage.getItem("internshipId") !== data.internshipId) {
          localStorage.setItem("timeLeft", testDuration);
          localStorage.setItem("startTime", Date.now());
          localStorage.setItem("internshipId", data.internshipId);
          localStorage.setItem("userId", data.userId || "temp-user-id");
        } else {
          const startTime = Number(localStorage.getItem("startTime"));
          const elapsedSinceStart = Math.floor((Date.now() - startTime) / 1000);
          if (isNaN(startTime) || elapsedSinceStart < 0 || elapsedSinceStart > testDuration) {
            initialTimeLeft = testDuration;
            localStorage.setItem("timeLeft", testDuration);
            localStorage.setItem("startTime", Date.now());
          } else {
            initialTimeLeft = Math.max(testDuration - elapsedSinceStart, 0);
            localStorage.setItem("timeLeft", initialTimeLeft);
          }
        }

        setTimeLeft(initialTimeLeft);
        setTestStarted(true);
      } else {
        setError(`Test has not yet started. It will start at ${testDateTime.toLocaleString()}`);
      }

      setLoading(false);
      return data.internshipId;
    } catch (err) {
      console.error("🚨 [fetchTestDetails] Error:", err.message);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (!testStarted || submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        const updatedTime = prev - 1;
        localStorage.setItem("timeLeft", updatedTime);
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(timer);
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
    if (file) setSolutionFile(file);
  };

  const handleAnswerChange = (mcqIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [mcqIndex]: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    let internshipId = internshipIdState;
    const industryPartnerId = localStorage.getItem("industryPartnerId");

    if (!internshipId || !isValidObjectId(internshipId)) {
      console.warn("⚠️ [handleSubmit] internshipId is missing or invalid, re-fetching...");
      internshipId = await fetchTestDetails();
      if (!internshipId || !isValidObjectId(internshipId)) {
        console.error("❌ [handleSubmit] Failed to retrieve valid internshipId");
        alert("❌ Could not retrieve a valid internshipId. Please reload the page or log in again.");
        return;
      }
      setInternshipIdState(internshipId);
    }

    if (!userId || !industryPartnerId) {
      console.error("❌ [handleSubmit] Missing required fields:", { userId, industryPartnerId });
      alert("❌ Missing required fields. Please ensure you are logged in and have selected an internship.");
      return;
    }

    if (Object.keys(selectedAnswers).length === 0) {
      alert("❌ Please answer at least one MCQ before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ [handleSubmit] No token found");
      alert("❌ No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("internshipId", internshipId);
    formData.append("industryPartnerId", industryPartnerId);
    formData.append("answers", JSON.stringify(selectedAnswers));

    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5000/api/test-schedule/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unknown error while submitting");
      }

      setSubmitted(true);
      setSubmitting(false);
      setSuccessMessage("✅ Test successfully submitted!");
      alert("✅ Answers submitted successfully");
    } catch (err) {
      console.error("🚨 [handleSubmit] Error:", err.message);
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Test Questions</h2>
            {testFile ? (
              <div className="mb-6">
                <a
                  href={testFile}
                  download
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-800"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Test File</span>
                </a>
              </div>
            ) : (
              <div className="mb-6 text-gray-500">
                <p>No test file available.</p>
              </div>
            )}

            {mcqs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Multiple Choice Questions</h3>
                <form onSubmit={handleSubmit}>
                  {mcqs.map((mcq, index) => (
                    <div key={mcq._id} className="mb-6 border-b pb-4">
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
                    disabled={submitting || error || !internshipIdState}
                    className={`mt-4 px-6 py-2 rounded-lg text-white font-medium ${
                      submitting || error || !internshipIdState
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit Test"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSchedule;