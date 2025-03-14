import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const CourseVideos = () => {
  const location = useLocation();
  const { course } = location.state;
  const navigate = useNavigate();

  const handleWatchVideo = (video) => {
    navigate("/dashboard/video-player", { state: { video } }); // Navigate to VideoPlayerPage with video data
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">{course.title} Videos</h1>
      <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {course.videos.map((video, index) => (
          <div
            key={index}
            className="bg-slate-200 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleWatchVideo(video)}
          >
            <h4 className="text-lg font-semibold text-gray-800">{video.title}</h4>
            <button className="mt-4 bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
              Watch Video
            </button>
          </div>
        ))}
      </div>
      <Link to="/dashboard/learning-resource" className="mt-6 inline-block text-purple-500 hover:underline">
        Back to Courses
      </Link>
    </div>
  );
};

export default CourseVideos;
