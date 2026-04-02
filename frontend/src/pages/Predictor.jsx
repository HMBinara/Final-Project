import React, { useState } from 'react';
import axios from 'axios';
import {
    Activity, Heart, Wallet, ChevronRight, ChevronLeft,
    RefreshCcw, Loader2, Landmark, CreditCard, TrendingUp,
    User, Thermometer, Zap, BarChart3, Info
} from 'lucide-react';

const Predictor = () => {
    // State management for navigation, loading status, and API results
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [apiError, setApiError] = useState('');

    // Comprehensive data structure for all 28 features (Lifestyle, Health, and Finance)
    const [formData, setFormData] = useState({
        // Lifestyle Features
        gender: 1,
        occupation_type: 3,
        avg_work_hours: 8,
        avg_rest_hours: 2,
        avg_sleep_hours: 7,
        avg_exercise_hours: 1,

        // Clinical Health Features
        age: 25,
        occupation: 0,
        sleep_duration: 7.0,
        quality_of_sleep: 5,
        physical_activity_level: 30,
        stress_level_health: 5,
        bmi_category: 1,
        heart_rate: 72,
        daily_steps: 5000,
        systolic_bp: 120,
        diastolic_bp: 80,

        // Financial Features
        years_employed: 1.0,
        annual_income: 50000,
        credit_score: 650,
        savings_assets: 10000,
        current_debt: 0,
        Equity_Market: 0.0,
        Fixed_Deposits: 0.0,
        occupation_status: 'Student',
        investment_avenues: 'No',
        stock_market: 'No'
    });

    /**
     * Dynamic Advice & Status Engine:
     * Generates human-readable insights and color-coded status labels 
     * based on model prediction values.
     */
    const getAdvice = (type, value) => {
        if (type === 'longevity') {
            const age = parseInt(value);
            if (age >= 80) return "Excellent lifestyle! Maintain these habits for a long, healthy life.";
            if (age >= 65) return "Good outlook. Increasing physical activity could further improve your longevity.";
            return "Warning! Significant lifestyle changes needed. Focus on diet and consistent sleep patterns.";
        }

        if (type === 'health') {
            let statusLabel = "";
            let statusColor = "";

            // Mapping clinical model results to user-friendly Good/Normal/Bad statuses
            if (value === 'Normal') {
                statusLabel = "GOOD";
                statusColor = "text-emerald-400"; // Green for Good
                return (
                    <div className="text-center">
                        <span className={`${statusColor} font-black text-3xl tracking-widest block mb-2`}>{statusLabel}</span>
                        <p className="text-sm text-gray-300 font-medium italic">
                            "You are in a healthy clinical state. Keep up the preventive care."
                        </p>
                    </div>
                );
            } else if (value === 'Insomnia' || value === 'Sleep Apnea') {
                statusLabel = "WARNING";
                statusColor = "text-amber-400"; // Orange/Yellow for Warning
                return (
                    <div className="text-center">
                        <span className={`${statusColor} font-black text-3xl tracking-widest block mb-2`}>{statusLabel}</span>
                        <p className="text-sm text-gray-300 font-medium italic">
                            "Poor sleep detected. Try to reduce stress and aim for a consistent sleep schedule."
                        </p>
                    </div>
                );
            } else {
                statusLabel = "BAD";
                statusColor = "text-red-500"; // Red for Bad
                return (
                    <div className="text-center">
                        <span className={`${statusColor} font-black text-3xl tracking-widest block mb-2`}>{statusLabel}</span>
                        <p className="text-sm text-gray-300 font-medium italic">
                            "Potential health risk detected. We recommend consulting a healthcare professional."
                        </p>
                    </div>
                );
            }
        }

        if (type === 'finance') {
            const score = parseFloat(value);
            if (score > 15) return "Strong financial stability! You are in a great position for long-term investments.";
            if (score > 10) return "Stable, but there's room for growth. Consider increasing your monthly savings.";
            return "Financial risk detected. Focus on debt reduction and building an emergency fund.";
        }
        return "";
    };

    // Generic input handler with support for both numeric and string fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const stringFields = ['occupation_status', 'investment_avenues', 'stock_market'];
        setFormData(prev => ({
            ...prev,
            [name]: stringFields.includes(name) ? value : (isNaN(parseFloat(value)) ? 0 : parseFloat(value))
        }));
    };

    // Submit form data to the Flask Backend
    const handleSubmit = async () => {
        setLoading(true);
        setApiError('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict_all', formData);
            if (response.data?.status === 'success') {
                setResult(response.data.results);
                setStep(4); // Move to the Final Report step
            }
        } catch (error) {
            setApiError(error.response?.data?.message || "Backend Connection Error. Ensure Flask server is running.");
        } finally {
            setLoading(false);
        }
    };

    // Reusable Input Component for UI consistency
    const InputField = ({ label, name, type = "number", icon: Icon }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1 flex items-center gap-2">
                {Icon && <Icon size={12} className="text-indigo-400" />} {label}
            </label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all text-sm hover:bg-white/[0.08]"
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto my-10 p-1 bg-[#0a0c10] rounded-[2.5rem] shadow-2xl border border-white/5 font-sans overflow-hidden min-h-[750px]">
            <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900/40 to-transparent backdrop-blur-3xl rounded-[2.3rem]">

                {/* Navbar Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
                            GeoPulse <span className="text-indigo-500">AI</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-bold tracking-[0.4em] uppercase mt-1">Multi-Model Stability Engine</p>
                    </div>

                    {/* Step Tracker */}
                    <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-500 ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-110' : 'text-gray-600'}`}>
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Lifestyle & Habits */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl"><Zap className="text-indigo-500" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 1: Lifestyle Profile</h2>
                                <p className="text-xs text-gray-500 font-medium">Daily habits and performance metrics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="Work Hours / Day" name="avg_work_hours" />
                            <InputField label="Rest Hours / Day" name="avg_rest_hours" />
                            <InputField label="Sleep Hours / Day" name="avg_sleep_hours" />
                            <InputField label="Exercise / Day" name="avg_exercise_hours" />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 text-sm">
                                    <option value={1} className="bg-slate-900">Male</option>
                                    <option value={0} className="bg-slate-900">Female</option>
                                </select>
                            </div>
                            <InputField label="Occupation Type (ID)" name="occupation_type" />
                        </div>
                        <button onClick={() => setStep(2)} className="mt-12 w-full md:w-max px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ml-auto">
                            Analyze Health <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Step 2: Biological & Clinical Data */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl"><Heart className="text-emerald-500" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 2: Bio-Clinical Data</h2>
                                <p className="text-xs text-gray-500 font-medium">Diagnostic health parameters</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <InputField label="Age" name="age" icon={User} />
                            <InputField label="Stress Level (1-10)" name="stress_level_health" />
                            <InputField label="Sleep Quality (1-10)" name="quality_of_sleep" />
                            <InputField label="Daily Steps" name="daily_steps" />
                            <InputField label="Heart Rate (BPM)" name="heart_rate" />
                            <InputField label="Systolic BP" name="systolic_bp" />
                            <InputField label="Diastolic BP" name="diastolic_bp" />
                            <InputField label="BMI (0,1,2)" name="bmi_category" />
                            <InputField label="Physical Activity" name="physical_activity_level" />
                            <InputField label="Sleep Duration" name="sleep_duration" />
                            <InputField label="Occupation (ID)" name="occupation" />
                        </div>
                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(1)} className="px-8 py-4 border border-white/10 text-gray-500 rounded-2xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-white/5 transition-all"><ChevronLeft size={16} /> Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">Analyze Economics <ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}

                {/* Step 3: Economic & Investment Profile */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl"><Wallet className="text-purple-500" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 3: Economic Stability</h2>
                                <p className="text-xs text-gray-500 font-medium">Wealth and investment metrics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <InputField label="Annual Income" name="annual_income" icon={Landmark} />
                            <InputField label="Total Savings" name="savings_assets" icon={TrendingUp} />
                            <InputField label="Credit Score" name="credit_score" icon={CreditCard} />
                            <InputField label="Years Employed" name="years_employed" />
                            <InputField label="Current Debt" name="current_debt" />
                            <InputField label="Equity Market (%)" name="Equity_Market" />
                            <InputField label="Fixed Deposits" name="Fixed_Deposits" />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Stock Market</label>
                                <select name="stock_market" value={formData.stock_market} onChange={handleInputChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 text-sm">
                                    <option value="No" className="bg-slate-900">No</option>
                                    <option value="Yes" className="bg-slate-900">Yes</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Investment Avenues</label>
                                <select name="investment_avenues" value={formData.investment_avenues} onChange={handleInputChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 text-sm">
                                    <option value="No" className="bg-slate-900">No</option>
                                    <option value="Yes" className="bg-slate-900">Yes</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Current Occupation Status</label>
                                <input type="text" name="occupation_status" value={formData.occupation_status} onChange={handleInputChange} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 text-sm" placeholder="e.g. Self-Employed" />
                            </div>
                        </div>

                        {apiError && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black text-center uppercase tracking-widest">{apiError}</div>}

                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(2)} className="px-8 py-4 border border-white/10 text-gray-500 rounded-2xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-white/5 transition-all"><ChevronLeft size={16} /> Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/40">
                                {loading ? <><Loader2 className="animate-spin" size={14} /> Synchronizing Models...</> : 'Generate Intelligence Report'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Final Intelligence Report */}
                {step === 4 && result && (
                    <div className="animate-in zoom-in-95 duration-1000">
                        <div className="text-center mb-16">
                            <div className="inline-block p-4 bg-indigo-500/10 rounded-full mb-6 border border-indigo-500/20 animate-pulse">
                                <BarChart3 className="text-indigo-500" size={32} />
                            </div>
                            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Final Analysis</h2>
                            <p className="text-indigo-400 text-[10px] font-black tracking-[0.6em] mt-3 uppercase">Dynamic Life Stability Index</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Longevity Analysis Card */}
                            <div className="group flex flex-col p-8 bg-white/[0.03] rounded-[3rem] border border-white/5 transition-all hover:bg-white/[0.07] hover:border-indigo-500/30">
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-6 text-center">Bio-Longevity</span>
                                <h3 className="text-7xl font-black text-white mb-2 text-center group-hover:scale-110 transition-transform duration-500">{result.longevity_prediction}</h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase text-center mb-8 italic">Projected Years</p>

                                <div className="mt-auto p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info size={14} className="text-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Longevity Insight</span>
                                    </div>
                                    <p className="text-[12px] text-gray-300 font-medium leading-relaxed italic">
                                        "{getAdvice('longevity', result.longevity_prediction)}"
                                    </p>
                                </div>
                            </div>

                            {/* Health State Analysis Card (Modified for Good/Normal/Bad labels) */}
                            <div className="group flex flex-col p-8 bg-white/[0.03] rounded-[3rem] border border-white/5 transition-all hover:bg-white/[0.07] hover:border-emerald-500/30">
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-6 text-center">Clinical State</span>

                                {/* Dynamically renders Label and Advice */}
                                <div className="flex-1 flex flex-col justify-center">
                                    {getAdvice('health', result.health_condition)}
                                </div>

                                <p className="text-[10px] text-gray-400 font-bold uppercase text-center mt-8 italic">Neural Diagnostic</p>
                            </div>

                            {/* Financial Stability Card */}
                            <div className="group flex flex-col p-8 bg-white/[0.03] rounded-[3rem] border border-white/5 transition-all hover:bg-white/[0.07] hover:border-purple-500/30">
                                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-6 text-center">Stability Rating</span>
                                <h3 className="text-7xl font-black text-white mb-2 text-center group-hover:scale-110 transition-transform duration-500">{result.financial_status}</h3>
                                <p className="text-[10px] text-purple-400 font-bold uppercase text-center mb-8 italic">Resilience Score</p>

                                <div className="mt-auto p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet size={14} className="text-purple-400" />
                                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-tighter">Economic Forecast</span>
                                    </div>
                                    <p className="text-[12px] text-gray-300 font-medium leading-relaxed italic">
                                        "{getAdvice('finance', result.financial_status)}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reset Component */}
                        <button onClick={() => { setStep(1); setResult(null); }} className="mt-20 group flex items-center gap-4 text-gray-600 font-black mx-auto hover:text-white transition-all uppercase text-[10px] tracking-[0.4em]">
                            <RefreshCcw size={14} className="group-hover:rotate-180 transition-all duration-1000" /> Reset System & Re-Analyze
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictor;