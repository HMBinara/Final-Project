import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Activity } from 'lucide-react';

const AnalysisDashboard = ({ data }) => {
    const score = parseFloat(data.financial_status) || 0;
    const chartData = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-6xl mx-auto p-8 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-2xl mt-10 relative overflow-hidden"
        >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-black text-white text-center mb-2 uppercase tracking-tight">Personal Intelligence Report</h2>
            <p className="text-center text-slate-400 text-sm font-medium mb-10">Comprehensive Analysis Dashboard</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Financial Stability Gauge */}
                <div className="flex flex-col items-center justify-between p-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 w-full">
                        <div className="p-2.5 bg-blue-500/20 rounded-lg">
                            <TrendingUp size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Financial</p>
                            <p className="text-sm font-black text-white">Stability Score</p>
                        </div>
                    </div>

                    <div className="w-full h-48 relative flex justify-center mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%" cy="100%"
                                    startAngle={180} endAngle={0}
                                    innerRadius={55} outerRadius={85}
                                    paddingAngle={0} dataKey="value"
                                    isAnimationActive={true}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#1e293b" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-2 text-center">
                            <div className="text-3xl font-black text-white">{score}%</div>
                            <div className="text-xs text-slate-400 font-semibold">Resilience</div>
                        </div>
                    </div>
                </div>

                {/* Longevity Outlook Card */}
                <div className="flex flex-col items-center justify-between p-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg hover:border-emerald-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 w-full">
                        <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                            <Activity size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bio-Longevity</p>
                            <p className="text-sm font-black text-white">Lifespan Projection</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center mb-4">
                        <div className="text-6xl font-black text-white mb-2">{data.longevity_prediction}</div>
                        <div className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Years</div>
                    </div>

                    <div className="w-full p-4 bg-slate-900/60 rounded-xl border border-slate-700/30">
                        <p className="text-xs text-slate-300 text-center font-medium leading-relaxed">
                            {data.longevity_prediction >= 80 ? "Excellent trajectory for extended longevity" : data.longevity_prediction >= 65 ? "Good outlook with room for optimization" : "Lifestyle improvements recommended"}
                        </p>
                    </div>
                </div>

                {/* Health Condition Card */}
                <div className="flex flex-col items-center justify-between p-8 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg hover:border-violet-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 w-full">
                        <div className="p-2.5 bg-violet-500/20 rounded-lg">
                            <Heart size={20} className="text-violet-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinical</p>
                            <p className="text-sm font-black text-white">Health Status</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center mb-4">
                        <div className="text-center">
                            {data.health_condition === 'Normal' ? (
                                <>
                                    <div className="text-4xl font-black text-emerald-400 mb-2">✓ GOOD</div>
                                    <div className="text-xs text-emerald-300 font-bold uppercase tracking-widest">Healthy State</div>
                                </>
                            ) : data.health_condition === 'Insomnia' || data.health_condition === 'Sleep Apnea' ? (
                                <>
                                    <div className="text-4xl font-black text-amber-400 mb-2">⚠ WARNING</div>
                                    <div className="text-xs text-amber-300 font-bold uppercase tracking-widest">{data.health_condition}</div>
                                </>
                            ) : (
                                <>
                                    <div className="text-4xl font-black text-red-400 mb-2">✕ ALERT</div>
                                    <div className="text-xs text-red-300 font-bold uppercase tracking-widest">{data.health_condition}</div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-full p-4 bg-slate-900/60 rounded-xl border border-slate-700/30">
                        <p className="text-xs text-slate-300 text-center font-medium leading-relaxed">
                            {data.health_condition === 'Normal' ? "Maintain your preventive care routine" : "Consider consulting a healthcare professional"}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalysisDashboard;