import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000';

// ==========================================
// SECTION 1: DATE TIME NORMALIZATION UTILITY
// ==========================================
// Formats raw database ISO strings into a standard human-readable YYYY-MM-DD HH:MM format
const formatDateTime = (value) => {
    if (!value) return 'Unknown';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// ==========================================
// SECTION 2: RECORD SCHEMATIZATION & DATA MAPPING
// ==========================================
// Extracts database response records cleanly and maps fields to fit chart dataset requirements
const normalizeRecord = (item) => {
    const scores = item?.scores ?? {};
    const dateTime = formatDateTime(item?.createdAt);

    return {
        id: item.id,
        dateTime,
        longevityYears: Number(scores.longevityYears ?? 0),
        healthScore: Number(scores.healthScore ?? 0),
        resilienceScore: Number(scores.resilienceScore ?? 0), // Maps resilienceScore as the core financial performance metric
    };
};

const PredictionTimeline = ({ isOpen = true, userId: userIdProp }) => {
    // ==========================================
    // SECTION 3: COMPONENT STATE HOOKS
    // ==========================================
    // Core states managing network loader visibility, chart structural dataset, and backend errors
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState('');

    // ==========================================
    // SECTION 4: USER MEMOIZATION PROFILE RESOLVER
    // ==========================================
    // Resolves identity tokens safely, falling back to cached browser items or standard dummy accounts
    const userId = useMemo(() => {
        if (userIdProp) return userIdProp;

        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            return storedUser.email || 'demo-user';
        } catch {
            return 'demo-user';
        }
    }, [userIdProp]);

    // ==========================================
    // SECTION 5: ASYNCHRONOUS DATA FETCHING (EFFECT ENGINE)
    // ==========================================
    // Handles network request lifecycles, array ordering, data cleansing, and memory safety guards
    useEffect(() => {
        if (!isOpen) return;

        let active = true;

        const loadHistory = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await axios.get(`${API_BASE_URL}/api/history/${encodeURIComponent(userId)}`);
                const records = Array.isArray(response.data?.data) ? response.data.data : [];

                // Copy, reverse chronologically, map values and filters finite entries to secure the UI layout
                const mapped = records
                    .slice()
                    .reverse()
                    .map((item) => normalizeRecord(item))
                    .filter((item) =>
                        Number.isFinite(item.longevityYears) &&
                        Number.isFinite(item.healthScore) &&
                        Number.isFinite(item.resilienceScore)
                    );

                if (active) {
                    setChartData(mapped);
                }
            } catch (fetchError) {
                console.error('Prediction history fetch failed:', fetchError);
                if (active) {
                    setError('Unable to load prediction history. Please check the backend and Firestore connection.');
                    setChartData([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        // Cleanup function preventing component race conditions on fast state updates
        return () => {
            active = false;
        };
    }, [isOpen, userId]);

    if (!isOpen) return null;

    // Derived State tracking the single most fresh data log row
    const latestRecord = chartData[chartData.length - 1];

    return (
        // ==========================================
        // SECTION 6: WRAPPER BOX & VISUAL HEADER PANEL
        // ==========================================
        // Contains core status information layout tags detailing database identifiers
        <div className="w-full rounded-3xl border border-slate-700 bg-slate-900/95 text-slate-100 shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4 bg-slate-800/60">
                <div>
                    <h3 className="text-xl font-black tracking-tight uppercase">Prediction Timeline</h3>
                    <p className="text-xs text-slate-400">Chronological Firestore history for the current user</p>
                </div>
                <div className="text-xs font-semibold bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-slate-400">
                    User: {userId}
                </div>
            </div>

            <div className="p-6">
                {/* Loader Spinner Layout Block */}
                {loading ? (
                    <div className="flex h-[420px] items-center justify-center text-slate-300 gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        <span>Loading history from Firestore...</span>
                    </div>
                ) : error ? (
                    /* Error Message Boundary UI Alert Box */
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200 text-sm">
                        {error}
                    </div>
                ) : chartData.length === 0 ? (
                    /* Blank Space Placeholder layout block when array structure node size reads 0 */
                    <div className="flex h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 text-slate-400 text-sm">
                        No prediction records found yet. Generate a prediction to start tracking!
                    </div>
                ) : (
                    <div className="space-y-6">

                        {/* ==========================================
                            SECTION 7: CHRONOLOGICAL MULTI-AXIS LINE CHART
                           ========================================== */}
                        {/* Core Recharts engine canvas mapping user variables across specialized timeline traces */}
                        <div className="h-[440px] rounded-3xl border border-slate-700/60 bg-slate-950/40 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 24, left: -20, bottom: 24 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis
                                        dataKey="dateTime"
                                        stroke="#64748b"
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        angle={-20}
                                        textAnchor="end"
                                        height={60}
                                        interval="auto"
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        domain={[0, 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            borderRadius: '14px',
                                            color: '#e2e8f0',
                                        }}
                                        labelStyle={{ color: '#3b82f6', fontWeight: 700 }}
                                        formatter={(value) => [Number(value).toFixed(2)]}
                                    />
                                    <Legend wrapperStyle={{ pt: 10 }} />

                                    {/* 🔵 Longevity Line Vector - Cyan Blue */}
                                    <Line
                                        type="monotone"
                                        dataKey="longevityYears"
                                        name="Longevity (Years)"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
                                        activeDot={{ r: 7 }}
                                    />

                                    {/* 🟢 Health Line Vector - Emerald Green */}
                                    <Line
                                        type="monotone"
                                        dataKey="healthScore"
                                        name="Health Score"
                                        stroke="#22C55E"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#22C55E', strokeWidth: 0 }}
                                        activeDot={{ r: 7 }}
                                    />

                                    {/* 🟣 Financial Resilience Line Vector - Purple */}
                                    <Line
                                        type="monotone"
                                        dataKey="resilienceScore"
                                        name="Financial Score"
                                        stroke="#A855F7"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#A855F7', strokeWidth: 0 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* ==========================================
                            SECTION 8: REAL-TIME INDEPENDENT SUMMARY WIDGETS
                           ========================================== */}
                        {/* Display metrics showcasing current dynamic nodes mapped across independent score cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Longevity Stat Badge */}
                            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Latest Longevity (Years)</p>
                                <p className="mt-2 text-3xl font-black text-blue-400">
                                    {latestRecord ? latestRecord.longevityYears.toFixed(2) : '0.00'}
                                </p>
                            </div>

                            {/* Health Stat Badge */}
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Latest Health Score</p>
                                <p className="mt-2 text-3xl font-black text-emerald-400">
                                    {latestRecord ? latestRecord.healthScore.toFixed(2) : '0.00'}
                                </p>
                            </div>

                            {/* Financial Stat Badge */}
                            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">Latest Financial Score</p>
                                <p className="mt-2 text-3xl font-black text-purple-400">
                                    {latestRecord ? latestRecord.resilienceScore.toFixed(2) : '0.00'}
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionTimeline;