import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBuilding } from 'react-icons/fa';

const Feedback = () => {
  const [userFeedback, setUserFeedback] = useState([
    { text: "Great platform! I learned a lot from my internship experience.", timestamp: new Date() },
    { text: "The system is easy to use and navigate, but could use more resources.", timestamp: new Date() },
    { text: "I would love to see more real-time communication options between mentors and interns.", timestamp: new Date() },
  ]);

  const [industryPartnerFeedback, setIndustryPartnerFeedback] = useState([
    { text: "The platform has been effective in recruiting top talent.", timestamp: new Date() },
    { text: "It would be great to have more customization options for internship programs.", timestamp: new Date() },
    { text: "The feedback system is great for monitoring intern progress, but it could be more streamlined.", timestamp: new Date() },
  ]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
      {/* Updated Main Heading */}
      <h2 className="text-2xl font-bold text-black mb-8 text-center relative">
Feedback Center
<motion.div
  className="absolute left-1/2 -translate-x-1/2 mt-1 h-1 w-16 bg-black rounded-full"
  initial={{ scaleX: 11 }}
  animate={{ scaleX: 7 }}
  transition={{ duration: 0.4 }}
/>
</h2>


      {/* Feedback Sections - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Feedback */}
        <div>
          <h3 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
            <FaUser className="text-blue-400 text-3xl" />
            User Feedback
          </h3>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userFeedback.length > 0 ? (
              userFeedback.map((feedback, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm hover:shadow-lg transform transition duration-300 hover:scale-105"
                >
                  <p className="text-gray-700 text-lg font-medium mb-2">
                    {feedback.text}
                  </p>
                  <span className="text-sm text-blue-600 font-semibold">
                    {formatDate(feedback.timestamp)}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No feedback yet from users.
              </p>
            )}
          </motion.div>
        </div>

        {/* Industry Partner Feedback */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
            <FaBuilding className="text-green-400 text-3xl" />
            Industry Partner Feedback
          </h3>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {industryPartnerFeedback.length > 0 ? (
              industryPartnerFeedback.map((feedback, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-sm hover:shadow-lg transform transition duration-300 hover:scale-105"
                >
                  <p className="text-gray-700 text-lg font-medium mb-2">
                    {feedback.text}
                  </p>
                  <span className="text-sm text-green-600 font-semibold">
                    {formatDate(feedback.timestamp)}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No feedback yet from industry partners.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
