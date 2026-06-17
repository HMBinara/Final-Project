import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, User, Activity, BarChart3 } from 'lucide-react';

const Sidebar = ({ openChart }) => {
  const navigate = useNavigate();

  // ==========================================
  // SECTION 1: USER LOGOUT HANDLER LIFECYCLE
  // ==========================================
  // Clears active user tokens from memory store and forces navigation to authentication route
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // ==========================================
  // SECTION 2: USER METADATA PARSER
  // ==========================================
  // Safely parses active state user information from storage or maps system standard fallback labels
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest User', email: 'guest@example.com' };

  return (
    // ==========================================
    // SECTION 3: FIXED PERSISTENT SIDEBAR PANEL
    // ==========================================
    // Sidebar base grid container utilizing fixed position overlays mapped to the viewport mesh edge
    <div className="w-64 h-screen bg-slate-800 text-white flex flex-col justify-between hidden md:flex border-r border-slate-700 fixed left-0 top-0 pt-4">
      <div>

        {/* ==========================================
            SECTION 4: SYSTEM IDENTITY BRAND PANEL
           ========================================== */}
        {/* Visual system logo wrapper defining system parameters and subtitle headers */}
        <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-700/50 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-sans tracking-tight">LifeBalance</h1>
            <p className="text-xs text-blue-400">Monitoring System</p>
          </div>
        </div>

        {/* ==========================================
            SECTION 5: PRIMARY NAVIGATION LINK STACK
           ========================================== */}
        {/* App link stack handling dynamic router activation filters and callback toggles */}
        <nav className="flex flex-col gap-2 px-4 mt-6">
          {/* Active Navigation Route Link Element */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          {/* Global Event Modal Chart Trigger Button */}
          <button onClick={() => openChart && openChart()} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-700/50 text-slate-300 hover:text-white">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">View Chart</span>
          </button>
        </nav>
      </div>

      {/* ==========================================
          SECTION 6: ACCOUNT LOCK & FOOTER CONTROLS
         ========================================== */}
      {/* Footer interface layout showing active metadata profile cards and logout calls */}
      <div className="p-4 border-t border-slate-700">

        {/* Profile Card Summary Widget Node */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 rounded-xl mb-4 border border-slate-600/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* System Session Kill Logout Command Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;