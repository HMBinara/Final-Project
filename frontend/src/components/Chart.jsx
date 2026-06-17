import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Download } from 'lucide-react';

const Chart = ({ isOpen, onClose }) => {
  // ==========================================
  // SECTION 1: STATE MANAGEMENT
  // ==========================================
  // Holds the sanitized chronological array of historical records for chart plotting and data grid views.
  const [chartData, setChartData] = useState([]);

  // ==========================================
  // SECTION 2: API FETCHING & DATA NORMALIZATION (EFFECT ENGINE)
  // ==========================================
  useEffect(() => {
    let isMounted = true; // Guard flag to prevent state mutations on unmounted components

    const loadPredictionHistory = async () => {
      // Pull user profile from local browser storage to fetch custom personalized logs
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser.email || 'demo-user';

      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/history/${encodeURIComponent(userId)}`);
        const records = response.data?.data || [];

        // Reverse records list to order them chronologically from Left-to-Right (Oldest to Newest)
        const chronological = [...records].reverse().map((item) => {
          // Fallback mechanism for structural timeline labels if specific string attributes are missing
          const dateTimeLabel = item.createdAtLabel || (item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Unknown time');

          return {
            ...item,
            label: dateTimeLabel,
            // Cast string attributes explicitly into real numbers using Number() so Recharts can plot data paths correctly
            longevity: Number(item.longevityYears || 0),
            health: Number(item.healthScore || 0),
            financial: Number(item.financialScore || 0),
          };
        });

        if (isMounted) {
          setChartData(chronological);
        }
      } catch (error) {
        console.error('Failed to load prediction history:', error);
        if (isMounted) {
          setChartData([]);
        }
      }
    };

    if (isOpen) {
      loadPredictionHistory();
    }

    // ==========================================
    // SECTION 3: REAL-TIME CROSS-TAB SYNC LISTENER
    // ==========================================
    const handleRefresh = () => {
      if (isOpen) {
        loadPredictionHistory();
      }
    };

    // Global custom event listener that triggers background refetches instantly when new forms submit across components
    window.addEventListener('predictionHistoryUpdated', handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener('predictionHistoryUpdated', handleRefresh);
    };
  }, [isOpen]);

  // ==========================================
  // SECTION 4: FILE EXPORT UTILITY (CSV UTILS)
  // ==========================================
  const downloadChartData = () => {
    if (chartData.length === 0) return;

    // Build flat data matrix blocks for cross-platform analytical tool access (Excel, sheets)
    const csvContent = [
      ['Date & Time', 'Longevity (Years)', 'Health Score', 'Financial Score'],
      ...chartData.map(item => [
        item.label,
        item.longevity,
        item.health,
        item.financial
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    // Create a local system instance link dynamically using browser Blobs to start background conversion downloads
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prediction_history.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Isolate the final vector item slot to dynamically show real-time scores inside metrics summary components
  const latestRecord = chartData[chartData.length - 1];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">

        {/* ==========================================
            SECTION 5: MODAL HEADER VIEW
           ========================================== */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Prediction Timeline</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Track your progress over time</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close chart"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        {/* Modal Dynamic Content Container */}
        <div className="p-8 overflow-auto max-h-[calc(90vh-120px)]">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-center">
              <div>
                <p className="text-slate-400 font-medium mb-2">No prediction history yet</p>
                <p className="text-xs text-slate-500">Generate a prediction to start tracking your progress</p>
              </div>
            </div>
          ) : (
            <>
              {/* ==========================================
                  SECTION 6: MULTI-AXIS LINE CHART INTERFACE (RECHARTS ENGINE)
                 ========================================== */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      style={{ fontSize: '11px' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                      domain={[0, 100]} // Anchor range thresholds cleanly from 0 up to 100 max bounds
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        padding: '10px'
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                      formatter={(value) => Number(value).toFixed(1)}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />

                    {/* Line Path Vector 1: Longevity Target (Blue Gradient Vector) */}
                    <Line
                      type="monotone"
                      dataKey="longevity"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Longevity (Years)"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    {/* Line Path Vector 2: Health Target (Emerald Green Vector) */}
                    <Line
                      type="monotone"
                      dataKey="health"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Health Score"
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    {/* Line Path Vector 3: Financial Target (Purple Balance Vector) */}
                    <Line
                      type="monotone"
                      dataKey="financial"
                      stroke="#a855f7"
                      strokeWidth={3}
                      name="Financial Score"
                      dot={{ fill: '#a855f7', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* ==========================================
                  SECTION 7: REAL-TIME SUMMARY CARD WIDGETS
                 ========================================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Latest Longevity Score</p>
                  <p className="text-3xl font-black text-blue-400">{latestRecord ? latestRecord.longevity.toFixed(1) : '-'}</p>
                  <p className="text-xs text-slate-400 mt-2">submitted at {latestRecord?.label || 'N/A'}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">Latest Health Score</p>
                  <p className="text-3xl font-black text-emerald-400">{latestRecord ? latestRecord.health.toFixed(1) : '-'}</p>
                  <p className="text-xs text-slate-400 mt-2">health trend profile</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Latest Finance Score</p>
                  <p className="text-3xl font-black text-purple-400">{latestRecord ? latestRecord.financial.toFixed(1) : '-'}</p>
                  <p className="text-xs text-slate-400 mt-2">financial stability profile</p>
                </div>
              </div>

              {/* ==========================================
                  SECTION 8: HISTORICAL CHRONOLOGICAL DATA TABLE
                 ========================================== */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">Longevity</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">Health</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Finance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="px-4 py-3 text-slate-300">{item.label}</td>
                        <td className="px-4 py-3 text-blue-400 font-medium">{item.longevity.toFixed(1)}</td>
                        <td className="px-4 py-3 text-emerald-400 font-medium">{item.health.toFixed(1)}</td>
                        <td className="px-4 py-3 text-purple-400 font-medium">{item.financial.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ==========================================
            SECTION 9: MODAL FOOTER & EXPORT CONTROL
           ========================================== */}
        {chartData.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-800/50">
            <p className="text-xs text-slate-400">
              {chartData.length} prediction{chartData.length !== 1 ? 's' : ''} recorded
            </p>
            <button
              onClick={downloadChartData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Download size={14} />
              <span className="text-xs font-bold">Export Data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;