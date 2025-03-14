import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import { Outlet } from "react-router-dom";
export const DashboardLayout = () => {


  return (
    <div className="flex">
      {/* Sidebar */}
      <div
      
      >
        <Sidebar
        
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[200px]">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Content */}
        <main className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// export const MainLayout = ({ children }) => {
//   return (
//     <div>
//       {/* You can add a different header or footer if needed */}
//       {/* {children} */}
//     </div>
//   );
// };
