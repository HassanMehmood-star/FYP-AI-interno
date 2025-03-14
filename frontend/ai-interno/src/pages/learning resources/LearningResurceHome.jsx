import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2"; 
// import jwt_decode from "jwt-decode";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import courseData from "./Course.json";

// Registering Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LearningResourceHome = () => {
  const [courses, setCourses] = useState([]);
  const [activityData, setActivityData] = useState({
    daily: [1, 2, 1, 3, 4, 2, 3], // Mock data for daily hours spent
    weekly: [10, 15, 12, 18], // Mock data for weekly hours spent
  });
  const navigate = useNavigate();

  useEffect(() => {
    setCourses(courseData);

    // Load persisted activity data from localStorage
    const savedActivityData = localStorage.getItem("activityData");
    if (savedActivityData) {
      setActivityData(JSON.parse(savedActivityData));
    }
  }, []);

  const handleEnroll = async (courseId) => {
    const selectedCourse = courses.find((course) => course.id === courseId);
  
    // Replace this with the authenticated user's ID from your session or token
   // const userId = "673f6058f65d49c2d026e592"; // Example valid ObjectId
    
    // Get the JWT token from local storage (or wherever it's stored)
    const token = localStorage.getItem('token'); // Or use a state management solution to get the token
  
    if (!token) {
      alert("You must be logged in to enroll in a course.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/enroll", 
        {
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          }
        }
      );
  
      console.log(response.data.message); // Success message
      alert("Enrolled successfully!");

      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay();

      const updatedDailyData = [...activityData.daily];
      updatedDailyData[dayOfWeek] += 1;

      const updatedWeeklyData = [...activityData.weekly];
      updatedWeeklyData[updatedWeeklyData.length - 1] += 1;

      const newActivityData = {
        daily: updatedDailyData,
        weekly: updatedWeeklyData,
      };

      localStorage.setItem("activityData", JSON.stringify(newActivityData));


      setActivityData(newActivityData);
      
      navigate(`/dashboard/course/${courseId}`, { state: { course: selectedCourse } });


      // Update activity data dynamically based on user enrollment
      
      
    } catch (error) {
      console.error("Failed to enroll course:", error.response?.data || error.message);
      alert(`Failed to enroll in the course: ${error.response?.data.message || "Unknown error"}`);
    }
  };
  
  

  // Chart Data
  const dailyLearningData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours Spent Learning (Daily)",
        data: activityData.daily,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
      },
    ],
  };

  const weeklyStatusData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Hours Spent Learning (Weekly)",
        data: activityData.weekly,
        backgroundColor: ["#60A5FA", "#818CF8", "#A78BFA", "#C084FC"],
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Top Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Courses</h1>
        <p className="text-gray-600 mt-2 text-sm">Enroll in free courses and start learning!</p>
      </div>

      {/* Courses Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-slate-200 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mt-4">{course.title}</h2>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
            <button
              onClick={() => handleEnroll(course.id)}
              className="mt-4 bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-600"
            >
              Enroll Now
            </button>
          </div>
        ))}
      </div>

      {/* Learning Activity and Weekly Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Daily Learning Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Daily Learning Activity</h3>
          <div className="mt-6 h-60">
            <Line data={dailyLearningData} />
          </div>
        </div>

        {/* Weekly Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Weekly Status</h3>
          <div className="mt-6 h-60">
            <Bar data={weeklyStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResourceHome;
