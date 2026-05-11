import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Download } from 'lucide-react';

const Chart = ({ isOpen, onClose }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadPredictionHistory = () => {
      const savedHistory = localStorage.getItem('predictionHistory');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      // ensure sorted by timestamp (oldest -> newest)
      history.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setChartData(history);
    };

    if (isOpen) {
      loadPredictionHistory();
    }

    // update if another tab modifies localStorage or this tab dispatches a custom event
    const handleStorage = (e) => {
      if (!e) return;
      if (e.key === 'predictionHistory') loadPredictionHistory();
    };
    const handleCustom = () => loadPredictionHistory();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('predictionHistoryUpdated', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('predictionHistoryUpdated', handleCustom);
    };
  }, [isOpen]);

  const downloadChartData = () => {
    if (chartData.length === 0) return;

    const csvContent = [
      ['Date', 'Longevity (Years)', 'Health Score', 'Financial Score'],
      ...chartData.map(item => [
        item.date,
        item.longevity,
        item.health,
        item.financial
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
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

        {/* Chart Content */}
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
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 mb-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: '12px' }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        padding: '10px'
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                      formatter={(value) => value.toFixed(1)}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="longevity"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      name="Longevity (Years)"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="health"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      name="Health Score"
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="financial"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      name="Financial Score"
                      dot={{ fill: '#a855f7', r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">Latest Longevity</p>
                  <p className="text-3xl font-black text-blue-400">{chartData[chartData.length - 1]?.longevity || '-'}</p>
                  <p className="text-xs text-slate-400 mt-2">years projected</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">Latest Health</p>
                  <p className="text-3xl font-black text-emerald-400">{chartData[chartData.length - 1]?.health || '-'}</p>
                  <p className="text-xs text-slate-400 mt-2">health score</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Latest Financial</p>
                  <p className="text-3xl font-black text-purple-400">{chartData[chartData.length - 1]?.financial || '-'}</p>
                  <p className="text-xs text-slate-400 mt-2">stability score</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">Longevity</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider">Health</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-purple-400 uppercase tracking-wider">Financial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                        <td className="px-4 py-3 text-slate-300">{item.date}</td>
                        <td className="px-4 py-3 text-blue-400 font-medium">{item.longevity}</td>
                        <td className="px-4 py-3 text-emerald-400 font-medium">{item.health}</td>
                        <td className="px-4 py-3 text-purple-400 font-medium">{item.financial.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
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
