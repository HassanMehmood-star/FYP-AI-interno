import React from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Registering required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const DataAnalytics = () => {
  // Data for Mentor Engagement Graph (Sessions, Feedback)
  const mentorEngagementData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Sessions Conducted',
        data: [20, 40, 60, 80, 100],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Feedback Given',
        data: [15, 35, 55, 75, 95],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Data for Mentor Performance Graph (Ratings, Feedback)
  const mentorPerformanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Average Rating',
        data: [4.5, 4.6, 4.7, 4.8, 4.9],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Positive Feedback Percentage',
        data: [80, 82, 85, 88, 90],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Data for User and Industry Partner Distribution
  const userIndustryData = {
    labels: ['Users', 'Industry Partners'],
    datasets: [
      {
        data: [75, 25], // Example: 75% users and 25% industry partners
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  // Data for Internship Applications Bar Chart
  const internshipApplicationsData = {
    labels: ['Web Dev', 'Data Science', 'Marketing', 'Design', 'Cybersecurity'],
    datasets: [
      {
        label: 'Applications',
        data: [120, 90, 70, 50, 40],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h2 className="text-2xl font-bold text-black mb-8 text-center relative">
        Mentor Engagement
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 mt-1 h-1 w-16 bg-black rounded-full"
          initial={{ scaleX: 11 }}
          animate={{ scaleX: 7 }}
          transition={{ duration: 0.4 }}
        />
      </h2>

      {/* Mentor Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mentor Engagement Graph */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Mentor Engagement</h2>
          <Line data={mentorEngagementData} />
        </div>

        {/* Mentor Performance Graph */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Mentor Performance</h2>
          <Line data={mentorPerformanceData} />
        </div>
      </div>

      {/* User vs Industry Partner Pie Chart */}
     <div className="flex justify-between mt-8">  {/* Added flex container */}
  {/* Pie Chart */}
  <div
    className="bg-white shadow-lg rounded-lg p-4"
    style={{ maxWidth: '300px' }}
  >
    <h2 className="text-xl font-semibold text-blue-600 mb-4 text-left">
      User vs Industry Partner
    </h2>
    <Pie
      data={userIndustryData}
      options={{
        responsive: true,
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: true,
      }}
      width={150}
      height={150}
    />
  </div>

  {/* Bar Chart */}
  {/* <div
    className="bg-white shadow-lg rounded-lg p-12"
    style={{
      maxWidth: '580px',
      marginLeft: 'auto',
      marginTop: '0',
      position: 'relative',
      top: '0px',
    }}
  >
    <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
      Internship Applications
    </h2>
    <Bar
      data={internshipApplicationsData}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Internship Applications by Domain' },
        },
      }}
    />
  </div> */}

</div>

    </div>
  );
};

export default DataAnalytics;
