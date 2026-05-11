import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chart from './Chart';

const Layout = () => {
  const user = localStorage.getItem('user');
  const [isChartOpen, setIsChartOpen] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setIsChartOpen(true);
    window.addEventListener('openGlobalChart', handleOpen);
    return () => window.removeEventListener('openGlobalChart', handleOpen);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Sidebar openChart={() => setIsChartOpen(true)} />
      <div className="flex-1 md:ml-64 relative overflow-y-auto w-full h-full p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
      <Chart isOpen={isChartOpen} onClose={() => setIsChartOpen(false)} />
    </div>
  );
};

export default Layout;
