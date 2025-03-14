import React from 'react';
import { Outlet } from 'react-router-dom'; // Import the Outlet component
import Sidebar from './Sidebar';

const Layouts = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        {/* Outlet will render the corresponding page based on the current route */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layouts;
