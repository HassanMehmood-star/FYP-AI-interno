import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex-1 p-5 bg-gray-100">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <button className="border px-4 py-2 rounded-md text-sm">Daily</button>
        </div>
      </div>

      {/* Visitors Analytics */}
      <div className="bg-white p-5 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Visitors Analytics</h2>
        <div className="h-64 bg-blue-100"> {/* Replace with a Chart.js or other chart */}</div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-sm text-gray-500">Unique Visitors</h3>
          <p className="text-2xl font-bold">18.6K</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-sm text-gray-500">Total Pageviews</h3>
          <p className="text-2xl font-bold">55.9K</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-sm text-gray-500">Bounce Rate</h3>
          <p className="text-2xl font-bold">54%</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-sm text-gray-500">Visit Duration</h3>
          <p className="text-2xl font-bold">2m 56s</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
