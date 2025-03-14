import React from "react";
import { motion } from "framer-motion";

const HallofFame = () => {
  // Demo data for Hall of Fame entries
  const programs = [
    {
      programName: "Web Development",
      topPerformers: [
        {
          name: "Alice Johnson",
          achievements: "Completed 5 projects with outstanding reviews.",
          profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
          programDuration: "3 months",
          skills: ["React", "Node.js", "MongoDB"],
        },
        {
          name: "John Doe",
          achievements: "Achieved 95% in the final assessment.",
          profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
          programDuration: "2 months",
          skills: ["HTML", "CSS", "JavaScript"],
        },
        {
          name: "Sophia Williams",
          achievements: "Built a responsive e-commerce website as a capstone project.",
          profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
          programDuration: "4 months",
          skills: ["Tailwind CSS", "Next.js", "GraphQL"],
        },
      ],
    },
    {
      programName: "Data Science",
      topPerformers: [
        {
          name: "Mary Smith",
          achievements: "Developed an AI-based recommendation system.",
          profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
          programDuration: "4 months",
          skills: ["Python", "Machine Learning", "Pandas"],
        },
        {
          name: "David Lee",
          achievements: "Conducted advanced data analysis for a case study.",
          profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
          programDuration: "3 months",
          skills: ["R", "Data Visualization", "Statistics"],
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Updated Heading with Motion Animation */}
      <h2 className="text-2xl font-bold text-black mb-8 text-center relative">
        Hall Of Fame
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 mt-1 h-1 w-16 bg-black rounded-full"
          initial={{ scaleX: 11 }}
          animate={{ scaleX: 7 }}
          transition={{ duration: 0.4 }}
        />
      </h2>

      {/* Displaying Programs */}
      <div className="space-y-12">
        {programs.map((program, index) => (
          <div
            key={index}
            className="bg-white shadow-2xl rounded-lg p-6 transform hover:scale-105 transition duration-500"
          >
            {/* Program Name */}
            <h2 className="text-2xl font-bold    text-blue-600 mb-6">
              {program.programName}
            </h2>

            {/* Top Performers Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {program.topPerformers.map((performer, i) => (
                <div
                  key={i}
                  className="p-6 bg-gray-100 rounded-lg shadow-2xl hover:shadow-3xl transition duration-500 transform hover:scale-105"
                >
                  {/* Profile Picture */}
                  <img
                    src={performer.profilePic}
                    alt={`${performer.name}'s profile`}
                    className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 shadow-lg hover:shadow-xl transition duration-300"
                  />

                  {/* Performer Details */}
                  <h3 className="text-xl font-medium text-gray-800 mt-4 text-center">
                    {performer.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">
                    {performer.programDuration}
                  </p>

                  <p className="mt-2 text-gray-600 text-center">
                    <span className="font-semibold">Achievements:</span>{" "}
                    {performer.achievements}
                  </p>

                  {/* Skills Section */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {performer.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full shadow-sm hover:shadow-md transition duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallofFame;
