import React from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract video or fallback to null
  const video = location.state?.video;

  // Redirect if no video data is available
  if (!video) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          No video data available!
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{video.title}</h1>
      <div
        className="relative"
        style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}
      >
        <iframe
          src={video.url.replace("watch?v=", "embed/")}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        ></iframe>
      </div>
      <Link
        to="/dashboard/course/:id"
        className="mt-6 inline-block text-purple-500 hover:underline"
      >
        Back to Videos
      </Link>
    </div>
  );
};

export default VideoPlayer;
