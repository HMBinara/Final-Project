import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chart from './Chart';

const Layout = () => {
  // ==========================================
  // SECTION 1: AUTHENTICATION STATE CHECK
  // ==========================================
  // Retrieves the logged-in user profile token from browser storage to determine access rights
  const user = localStorage.getItem('user');

  // ==========================================
  // SECTION 2: GLOBAL CHART STATE MANAGEMENT
  // ==========================================
  // Manages the visibility toggle state of the overlay prediction history chart popup
  const [isChartOpen, setIsChartOpen] = useState(false);

  // ==========================================
  // SECTION 3: GLOBAL EVENT ENGINE (CROSS-COMPONENT TRIGGER)
  // ==========================================
  React.useEffect(() => {
    const handleOpen = () => setIsChartOpen(true);

    // Global event listener allowing inner nested child pages to launch the chart popup directly
    window.addEventListener('openGlobalChart', handleOpen);

    return () => window.removeEventListener('openGlobalChart', handleOpen);
  }, []);

  // ==========================================
  // SECTION 4: ROUTE GUARD SECURITY MECHANISM
  // ==========================================
  // Protects private dashboard sub-pages by instantly bouncing unauthenticated visitors back to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // SECTION 5: MASTER CORE DASHBOARD VIEW LAYOUT
  // ==========================================
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">

      {/* Sidebar Navigation Component with integrated chart modal controller callback */}
      <Sidebar openChart={() => setIsChartOpen(true)} />

      {/* Main Content Render Area Workspace Canvas */}
      <div className="flex-1 md:ml-64 relative overflow-y-auto w-full h-full p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* React Router Outlet placeholder rendering dynamic nested nested page routes seamlessly */}
          <Outlet />
        </div>
      </div>

      {/* Shared Prediction Timeline Overlay Chart Component */}
      <Chart isOpen={isChartOpen} onClose={() => setIsChartOpen(false)} />

    </div>
  );
};

export default Layout;