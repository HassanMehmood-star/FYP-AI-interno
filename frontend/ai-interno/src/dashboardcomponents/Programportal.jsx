"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, CheckCircle, Clock, FileText, User, AlertCircle, ChevronRight, Upload, File } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility function to convert 24-hour time to AM/PM format
const formatTimeToAmPm = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  let hoursNum = parseInt(hours, 10);
  const ampm = hoursNum >= 12 ? "PM" : "AM";
  hoursNum = hoursNum % 12 || 12;
  return `${hoursNum}:${minutes} ${ampm}`;
};

// Utility function to format date (e.g., "May 14, 2025")
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Utility function to check if task should be displayed
const shouldDisplayTask = (task) => {
  if (!task.startDate || !task.startTime) {
    console.warn("Task missing startDate or startTime:", task);
    return false;
  }
  const currentTime = new Date();
  const [hours, minutes] = task.startTime.split(":").map(Number);
  const taskStart = new Date(task.startDate);
  taskStart.setHours(hours, minutes, 0, 0);
  return currentTime >= taskStart;
};

// Utility function to check if submission is allowed
const isSubmissionAllowed = (task) => {
  if (!task.endDate || !task.endTime) {
    console.warn("Task missing endDate or endTime:", task);
    return false;
  }
  const currentTime = new Date();
  const [hours, minutes] = task.endTime.split(":").map(Number);
  const taskEnd = new Date(task.endDate);
  taskEnd.setHours(hours, minutes, 0, 0);
  return currentTime <= taskEnd;
};

// Simplified Card component with animation
const Card = ({ children, className, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

// Task status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-amber-100 text-amber-800 border border-amber-200", icon: <Clock className="w-3 h-3 mr-1" /> },
    active: { color: "bg-blue-100 text-blue-800 border border-blue-200", icon: <FileText className="w-3 h-3 mr-1" /> },
    completed: {
      color: "bg-green-100 text-green-800 border border-green-200",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color} shadow-sm`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// File upload section component
const FileUploadSection = ({ task, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const canSubmit = isSubmissionAllowed(task) && task.status !== "completed";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setSelectedFile(file);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(`/api/tasks/${task._id}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        setUploadStatus({ success: true, fileName: selectedFile.name });
        onFileUpload(task._id, response.data.fileUrl || selectedFile.name);
        toast.success("File uploaded successfully");
      } else {
        throw new Error(response.data.message || "Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus({ success: false, message: error.response?.data?.message || error.message || "Failed to upload file" });
      toast.error(error.response?.data?.message || error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-[#0A3A3A]/10 pt-4 mt-4"
    >
      <div className="flex items-center text-sm text-[#0A3A3A] mb-3">
        <Upload className="w-4 h-4 mr-1" />
        <span className="font-medium">Submit Your Work</span>
      </div>
      {canSubmit ? (
        <div className="flex items-center space-x-4">
          <label className="flex-1">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex items-center justify-between bg-gray-50 border border-[#0A3A3A]/20 rounded-md p-2 cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-600 truncate">
                {selectedFile ? selectedFile.name : "Choose a file (PDF, DOC, JPG, PNG)"}
              </span>
              <File className="w-4 h-4 text-[#0A3A3A]" />
            </div>
          </label>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow-sm transition-all ${
              uploading || !selectedFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0A3A3A] hover:bg-[#0c4747] hover:shadow"
            }`}
          >
            {uploading ? (
              <span className="flex items-center">
                <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {task.status === "completed"
            ? "Task is already completed"
            : "Submission deadline has passed"}
        </div>
      )}
      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-3 p-2 rounded-md text-sm flex items-center ${
            uploadStatus.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {uploadStatus.success ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          {uploadStatus.success
            ? `Uploaded: ${uploadStatus.fileName}`
            : `Upload failed: ${uploadStatus.message}`}
        </motion.div>
      )}
    </motion.div>
  );
};

// Task card component
const TaskCard = ({ task, onMarkComplete, onFileUpload }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="border-2 border-[#0A3A3A]/20 rounded-lg shadow-sm bg-white overflow-hidden hover:shadow-md transition-all hover:border-[#0A3A3A]/40 hover:translate-y-[-2px]"
    >
      <div className="p-4 cursor-pointer flex justify-between items-start" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#0A3A3A]">{task.title}</h3>
            <StatusBadge status={task.status} />
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 whitespace-pre-line">{task.description}</p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {formatDate(task.startDate)} {task.startDay} {formatTimeToAmPm(task.startTime)} - {formatDate(task.endDate)} {task.endDay} {formatTimeToAmPm(task.endTime)}
            </span>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#0A3A3A]/10 bg-gradient-to-r from-[#f0f7f7] to-white"
          >
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  Duration: {formatDate(task.startDate)} {task.startDay} {formatTimeToAmPm(task.startTime)} - {formatDate(task.endDate)} {task.endDay} {formatTimeToAmPm(task.endTime)}
                </span>
              </div>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{task.description}</p>
              {task.status !== "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkComplete(task._id);
                  }}
                  className="text-sm px-4 py-2 bg-[#0A3A3A] text-white rounded-md hover:bg-[#0c4747] transition-colors shadow-sm hover:shadow mb-4"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Mark as Complete
                </button>
              )}
              <FileUploadSection task={task} onFileUpload={onFileUpload} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border border-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

// User info header component
const UserHeader = ({ userName = "User" }) => (
  <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
    <div className="w-10 h-10 rounded-full bg-[#0A3A3A] flex items-center justify-center text-white">
      <User className="w-5 h-5" />
    </div>
    <div className="ml-3">
      <p className="text-sm text-gray-500">Welcome back,</p>
      <h2 className="font-bold text-[#0A3A3A]">{userName}</h2>
    </div>
  </div>
);

const ProgramPortal = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Candidate");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("/api/getUserDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data._id) {
          setUserId(response.data._id);
          if (response.data.name) {
            setUserName(response.data.name);
          }
        } else {
          throw new Error("No user ID returned");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.response?.data?.message || error.message || "Failed to fetch user details");
        toast.error(error.response?.data?.message || error.message || "Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchHiredCandidateTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Fetching tasks with token:', token?.slice(0, 20) + '...');
        if (!token || !userId) {
          throw new Error("Token or userId not found");
        }

        const response = await axios.get("/api/hired-candidate-tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          console.log('Tasks received:', response.data.data);
          setAllTasks(response.data.data || []);
        } else {
          console.warn('Unexpected response:', response.data);
          setAllTasks([]);
          throw new Error(response.data.message || "Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching hired candidate tasks:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch tasks";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHiredCandidateTasks();
    }
  }, [userId]);

  // Update displayed tasks based on current time
  useEffect(() => {
    const updateDisplayedTasks = () => {
      const tasksToDisplay = allTasks.filter(task => shouldDisplayTask(task));
      console.log('Displayed tasks:', tasksToDisplay);
      setDisplayedTasks(tasksToDisplay);
    };

    // Initial update
    updateDisplayedTasks();

    // Update every minute
    const interval = setInterval(updateDisplayedTasks, 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [allTasks]);

  const handleMarkComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      console.log(`Marking task as complete: ${taskId}`);
      const response = await axios.patch(
        `/api/tasks/${taskId}/complete`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setAllTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: "completed" } : task
          )
        );
        console.log(`Task ${taskId} marked as completed`);
        toast.success("Task marked as complete");
      } else {
        throw new Error(response.data.message || "Failed to mark task as complete");
      }
    } catch (error) {
      console.error("Error marking task as complete:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(error.response?.data?.message || error.message || "Failed to mark task as complete");
    }
  };

  const handleFileUpload = (taskId, fileUrl) => {
    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, fileUrl } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl">
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0A3A3A]">Program Portal</h1>
            <div className="hidden md:block px-4 py-2 bg-[#0A3A3A]/10 rounded-lg text-[#0A3A3A] text-sm font-medium">
              Candidate Dashboard
            </div>
          </div>

          <UserHeader userName={userName} />

          {loading ? (
            <SkeletonLoader />
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : displayedTasks.length > 0 ? (
            <div className="bg-gradient-to-br from-[#f0f7f7] to-white p-5 rounded-xl border border-[#0A3A3A]/10 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#0A3A3A] flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#0A3A3A]/70" />
                  Your Assigned Tasks
                </h2>
                <div className="text-sm bg-[#0A3A3A]/10 px-3 py-1 rounded-full text-[#0A3A3A] font-medium">
                  {displayedTasks.length} tasks
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">Task will display on start time and date</p>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {displayedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onMarkComplete={handleMarkComplete}
                    onFileUpload={handleFileUpload}
                  />
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-[#0A3A3A] mb-2">No Tasks Available</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {allTasks.length > 0
                  ? "Tasks will display on their start time and date. Check back at the scheduled time."
                  : "You don't have any assigned tasks at the moment. Check back later or contact your program manager."}
              </p>
            </div>
          )}
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default ProgramPortal;