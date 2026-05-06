import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
    Activity, Heart, Wallet, ChevronRight, ChevronLeft,
    RefreshCcw, Loader2, Landmark, CreditCard, TrendingUp,
    User, Thermometer, Zap, BarChart3, Info, Download, X
} from 'lucide-react';
import AnalysisDashboard from '../components/AnalysisDashboard';

// Occupation Type Mapping (LabelEncoder)
const occupations = [
    { id: 0, label: 'Artist' },
    { id: 1, label: 'Consultant' },
    { id: 2, label: 'Driver' },
    { id: 3, label: 'Engineer' },
    { id: 4, label: 'Entrepreneur' },
    { id: 5, label: 'Freelancer' },
    { id: 6, label: 'Healthcare Worker' },
    { id: 7, label: 'Manager' },
    { id: 8, label: 'Manual Laborer' },
    { id: 9, label: 'Office Worker' },
    { id: 10, label: 'Retail Worker' },
    { id: 11, label: 'Scientist' },
    { id: 12, label: 'Teacher' },
    { id: 13, label: 'Technician' }
];

const healthOccupations = [
    { id: 0, label: 'Accountant' },
    { id: 1, label: 'Doctor' },
    { id: 2, label: 'Engineer' },
    { id: 3, label: 'Lawyer' },
    { id: 4, label: 'Manager' },
    { id: 5, label: 'Nurse' },
    { id: 6, label: 'Salesperson' },
    { id: 7, label: 'Scientist' },
    { id: 8, label: 'Software Engineer' },
    { id: 9, label: 'Teacher' },
    { id: 10, label: 'Other' }
];

const InputField = ({
    label,
    name,
    value,
    type = "text",
    inputMode = "numeric",
    icon: Icon,
    inputRef,
    onKeyDown,
    onChange,
    onClear,
    focusTone = "blue",
    placeholder
}) => {
    const focusClasses = focusTone === "indigo"
        ? "focus:border-indigo-500 focus:ring-indigo-500/30"
        : "focus:border-blue-500 focus:ring-blue-500/30";

    return (
        <div className="flex flex-col gap-2.5">
            <label className="text-[11px] text-slate-300 font-bold uppercase tracking-widest ml-0.5 flex items-center gap-2.5">
                {Icon && <Icon size={14} className="text-blue-400" />} {label}
            </label>
            <div className="relative group">
                <input
                    ref={inputRef}
                    type={type}
                    inputMode={inputMode}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 pr-12 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 outline-none transition-all duration-200 hover:border-slate-500 hover:from-slate-750 ${focusClasses} focus:to-slate-800 shadow-sm hover:shadow-md focus:shadow-lg`}
                />
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onClear(name, inputRef)}
                    disabled={value === ''}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Clear ${label}`}
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
};

const Predictor = () => {
    // State management for navigation, loading status, and API results
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [apiError, setApiError] = useState('');

    // Step 1 Refs
    const workHoursRef = useRef(null);
    const restHoursRef = useRef(null);
    const sleepHoursRef = useRef(null);
    const exerciseHoursRef = useRef(null);
    const genderRef = useRef(null);
    const occupationTypeRef = useRef(null);
    const step1Refs = [workHoursRef, restHoursRef, sleepHoursRef, exerciseHoursRef, genderRef, occupationTypeRef];

    // Step 2 Refs
    const ageRef = useRef(null);
    const stressRef = useRef(null);
    const sleepQualityRef = useRef(null);
    const dailyStepsRef = useRef(null);
    const heartRateRef = useRef(null);
    const systolicRef = useRef(null);
    const diastolicRef = useRef(null);
    const bmiRef = useRef(null);
    const physicalActivityRef = useRef(null);
    const sleepDurationRef = useRef(null);
    const occupationRef = useRef(null);
    const step2Refs = [ageRef, stressRef, sleepQualityRef, dailyStepsRef, heartRateRef, systolicRef, diastolicRef, bmiRef, physicalActivityRef, sleepDurationRef, occupationRef];

    // Step 3 Refs
    const incomeRef = useRef(null);
    const savingsRef = useRef(null);
    const creditScoreRef = useRef(null);
    const yearsEmployedRef = useRef(null);
    const debtRef = useRef(null);
    const equityRef = useRef(null);
    const fixedDepositsRef = useRef(null);
    const stockMarketRef = useRef(null);
    const investmentRef = useRef(null);
    const occupationStatusRef = useRef(null);
    const step3Refs = [incomeRef, savingsRef, creditScoreRef, yearsEmployedRef, debtRef, equityRef, fixedDepositsRef, stockMarketRef, investmentRef, occupationStatusRef];

    // Auto-focus first field on step change
    React.useEffect(() => {
        if (step === 1) workHoursRef.current?.focus();
        else if (step === 2) ageRef.current?.focus();
        else if (step === 3) incomeRef.current?.focus();
    }, [step]);

    // Handle Enter key to move to next field or advance to the next step.
    const handleKeyDown = (e, currentIndex, steprefs, onLastField) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < steprefs.length) {
                steprefs[nextIndex].current?.focus();
            } else if (onLastField) {
                onLastField();
            }
        }
    };

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
        occupation: '',
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
                        <p className="text-sm text-slate-300 font-medium italic">
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
                        <p className="text-sm text-slate-300 font-medium italic">
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
                        <p className="text-sm text-slate-300 font-medium italic">
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

    const getRawAdvice = (type, value) => {
        if (type === 'longevity') {
            const age = parseInt(value);
            if (age >= 80) return "Excellent lifestyle! Maintain these habits for a long, healthy life.";
            if (age >= 65) return "Good outlook. Increasing physical activity could further improve your longevity.";
            return "Warning! Significant lifestyle changes needed. Focus on diet and consistent sleep patterns.";
        }
        if (type === 'health') {
            if (value === 'Normal') return "You are in a healthy clinical state. Keep up the preventive care.";
            if (value === 'Insomnia' || value === 'Sleep Apnea') return "Poor sleep detected. Try to reduce stress and aim for a consistent sleep schedule.";
            return "Potential health risk detected. We recommend consulting a healthcare professional.";
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClearField = (name, ref) => {
        setFormData(prev => ({
            ...prev,
            [name]: ''
        }));
        ref?.current?.focus();
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
            setApiError(error.response?.data?.message || "Backend Connection Error. Ensure Flask server is running on port 5000.");
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = () => {
        if (!result) return;

        const reportContent = `
=============================================
         LIFE BALANCE INTELLIGENCE REPORT      
=============================================

[ BIO-LONGEVITY ]
Projected Years: ${result.longevity_prediction}
Insight: ${getRawAdvice('longevity', result.longevity_prediction)}

[ CLINICAL HEALTH STATE ]
Diagnostic: ${result.health_condition}
Insight: ${getRawAdvice('health', result.health_condition)}

[ FINANCIAL STABILITY ]
Resilience Score: ${result.financial_status}
Insight: ${getRawAdvice('finance', result.financial_status)}

=============================================
Generated by LifeBalance Intelligence System
=============================================`;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'LifeBalance_Report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto mb-10 mt-4 p-1 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 font-sans overflow-hidden min-h-[750px] relative">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="p-8 md:p-12 relative z-10">

                {/* Navbar Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase flex items-center gap-3">
                            LifeBalance <span className="text-blue-500">AI</span>
                        </h1>
                        <p className="text-slate-400 text-[10px] font-bold tracking-[0.4em] uppercase mt-1">Multi-Model Stability Engine</p>
                    </div>

                    {/* Step Tracker */}
                    <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700">
                        {
                            // Build steps: include 4 (Final) when result exists
                            (result ? [1, 2, 3, 4] : [1, 2, 3]).map((s) => {
                                const completed = result ? s < 4 : step > s;
                                const isActive = step === s;
                                const isDisabled = result && s !== 4;
                                const baseClass = `w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-500`;
                                const stateClass = isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' : (completed ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-700/60');
                                const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
                                return (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => !isDisabled && setStep(s)}
                                        disabled={isDisabled}
                                        className={`${baseClass} ${stateClass} ${disabledClass}`}
                                        aria-label={s === 4 ? 'Final Report' : `Go to step ${s}`}
                                        aria-current={isActive ? 'step' : undefined}
                                    >
                                        {s === 4 ? 'R' : s}
                                    </button>
                                );
                            })
                        }
                    </div>
                </div>

                {/* Step 1: Lifestyle & Habits */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl"><Zap className="text-blue-500" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 1: Personal Growth</h2>
                                <p className="text-xs text-slate-400 font-medium">Daily habits and performance metrics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField label="Work Hours / Day" name="avg_work_hours" value={formData.avg_work_hours} inputRef={workHoursRef} onKeyDown={(e) => handleKeyDown(e, 0, step1Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Rest Hours / Day" name="avg_rest_hours" value={formData.avg_rest_hours} inputRef={restHoursRef} onKeyDown={(e) => handleKeyDown(e, 1, step1Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Sleep Hours / Day" name="avg_sleep_hours" value={formData.avg_sleep_hours} inputRef={sleepHoursRef} onKeyDown={(e) => handleKeyDown(e, 2, step1Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Exercise / Day" name="avg_exercise_hours" value={formData.avg_exercise_hours} inputRef={exerciseHoursRef} onKeyDown={(e) => handleKeyDown(e, 3, step1Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Gender</label>
                                <div className="relative group">
                                    <select ref={genderRef} name="gender" value={formData.gender} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 4, step1Refs)} className="w-full px-4 py-3 pr-12 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg text-white text-sm outline-none transition-all duration-200 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 shadow-sm hover:shadow-md focus:shadow-lg">
                                        <option value="" className="bg-slate-900">Select gender</option>
                                        <option value={1} className="bg-slate-900">Male</option>
                                        <option value={0} className="bg-slate-900">Female</option>
                                    </select>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleClearField('gender', genderRef)}
                                        disabled={formData.gender === ''}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                                        aria-label="Clear Gender"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-300 font-bold uppercase tracking-widest ml-0.5 flex items-center gap-2.5">
                                    <Zap size={14} className="text-blue-400" /> Occupation Type
                                </label>
                                <div className="relative group">
                                    <select ref={occupationTypeRef} name="occupation_type" value={formData.occupation_type} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 5, step1Refs, () => setStep(2))} className="w-full px-4 py-3 pr-12 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg text-white text-sm outline-none transition-all duration-200 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 shadow-sm hover:shadow-md focus:shadow-lg">
                                        <option value="" className="bg-slate-900">Select occupation</option>
                                        {occupations.map((occ) => (
                                            <option key={occ.id} value={occ.id} className="bg-slate-900">
                                                {occ.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleClearField('occupation_type', occupationTypeRef)}
                                        disabled={formData.occupation_type === ''}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                                        aria-label="Clear Occupation Type"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="mt-12 w-full md:w-max px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ml-auto shadow-lg shadow-blue-600/20">
                            Analyze Health <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Step 2: Biological & Clinical Data */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"><Heart className="text-emerald-500" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 2: Bio-Clinical Data</h2>
                                <p className="text-xs text-slate-400 font-medium">Diagnostic health parameters</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <InputField label="Age" name="age" value={formData.age} icon={User} inputRef={ageRef} onKeyDown={(e) => handleKeyDown(e, 0, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Stress Level (1-10)" name="stress_level_health" value={formData.stress_level_health} inputRef={stressRef} onKeyDown={(e) => handleKeyDown(e, 1, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Sleep Quality (1-10)" name="quality_of_sleep" value={formData.quality_of_sleep} inputRef={sleepQualityRef} onKeyDown={(e) => handleKeyDown(e, 2, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Daily Steps" name="daily_steps" value={formData.daily_steps} inputRef={dailyStepsRef} onKeyDown={(e) => handleKeyDown(e, 3, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Heart Rate (BPM)" name="heart_rate" value={formData.heart_rate} inputRef={heartRateRef} onKeyDown={(e) => handleKeyDown(e, 4, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Systolic BP" name="systolic_bp" value={formData.systolic_bp} inputRef={systolicRef} onKeyDown={(e) => handleKeyDown(e, 5, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Diastolic BP" name="diastolic_bp" value={formData.diastolic_bp} inputRef={diastolicRef} onKeyDown={(e) => handleKeyDown(e, 6, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="BMI (0,1,2)" name="bmi_category" value={formData.bmi_category} inputRef={bmiRef} onKeyDown={(e) => handleKeyDown(e, 7, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Physical Activity" name="physical_activity_level" value={formData.physical_activity_level} inputRef={physicalActivityRef} onKeyDown={(e) => handleKeyDown(e, 8, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <InputField label="Sleep Duration" name="sleep_duration" value={formData.sleep_duration} inputRef={sleepDurationRef} onKeyDown={(e) => handleKeyDown(e, 9, step2Refs)} onChange={handleInputChange} onClear={handleClearField} />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Occupation</label>
                                <div className="relative group">
                                    <select ref={occupationRef} name="occupation" value={formData.occupation} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 10, step2Refs, () => setStep(3))} className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm outline-none transition-all duration-200 hover:border-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 shadow-sm hover:shadow-md focus:shadow-lg">
                                        <option value="" className="bg-slate-900">-- Select Occupation --</option>
                                        {healthOccupations.map((occupationOption) => (
                                            <option key={occupationOption.id} value={occupationOption.id} className="bg-slate-900">
                                                {occupationOption.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleClearField('occupation', occupationRef)}
                                        disabled={formData.occupation === ''}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                                        aria-label="Clear Occupation"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(1)} className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-slate-700 transition-all"><ChevronLeft size={16} /> Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">Analyze Economics <ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}

                {/* Step 3: Economic & Investment Profile */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"><Wallet className="text-indigo-400" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Step 3: Economic Stability</h2>
                                <p className="text-xs text-slate-400 font-medium">Wealth and investment metrics</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <InputField label="Annual Income" name="annual_income" value={formData.annual_income} icon={Landmark} inputRef={incomeRef} onKeyDown={(e) => handleKeyDown(e, 0, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />
                            <InputField label="Total Savings" name="savings_assets" value={formData.savings_assets} icon={TrendingUp} inputRef={savingsRef} onKeyDown={(e) => handleKeyDown(e, 1, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />
                            <InputField label="Credit Score" name="credit_score" value={formData.credit_score} icon={CreditCard} inputRef={creditScoreRef} onKeyDown={(e) => handleKeyDown(e, 2, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />
                            <InputField label="Years Employed" name="years_employed" value={formData.years_employed} inputRef={yearsEmployedRef} onKeyDown={(e) => handleKeyDown(e, 3, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />
                            <InputField label="Current Debt" name="current_debt" value={formData.current_debt} inputRef={debtRef} onKeyDown={(e) => handleKeyDown(e, 4, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />
                            <InputField label="Equity Market (%)" name="Equity_Market" value={formData.Equity_Market} inputRef={equityRef} onKeyDown={(e) => handleKeyDown(e, 5, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />
                            <InputField label="Fixed Deposits" name="Fixed_Deposits" value={formData.Fixed_Deposits} inputRef={fixedDepositsRef} onKeyDown={(e) => handleKeyDown(e, 6, step3Refs)} onChange={handleInputChange} onClear={handleClearField} focusTone="indigo" />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Stock Market</label>
                                <div className="relative group">
                                    <select ref={stockMarketRef} name="stock_market" value={formData.stock_market} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 7, step3Refs)} className="w-full px-4 py-3 pr-12 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg text-white text-sm outline-none transition-all duration-200 hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 shadow-sm hover:shadow-md focus:shadow-lg">
                                        <option value="" className="bg-slate-900">Select</option>
                                        <option value="No" className="bg-slate-900">No</option>
                                        <option value="Yes" className="bg-slate-900">Yes</option>
                                    </select>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleClearField('stock_market', stockMarketRef)}
                                        disabled={formData.stock_market === ''}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                                        aria-label="Clear Stock Market"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Investment Avenues</label>
                                <div className="relative group">
                                    <select ref={investmentRef} name="investment_avenues" value={formData.investment_avenues} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 8, step3Refs)} className="w-full px-4 py-3 pr-12 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg text-white text-sm outline-none transition-all duration-200 hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 shadow-sm hover:shadow-md focus:shadow-lg">
                                        <option value="" className="bg-slate-900">Select</option>
                                        <option value="No" className="bg-slate-900">No</option>
                                        <option value="Yes" className="bg-slate-900">Yes</option>
                                    </select>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleClearField('investment_avenues', investmentRef)}
                                        disabled={formData.investment_avenues === ''}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                                        aria-label="Clear Investment Avenues"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Current Occupation Status</label>
                                <div className="relative group">
                                    <input ref={occupationStatusRef} type="text" name="occupation_status" value={formData.occupation_status} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 9, step3Refs, handleSubmit)} className="w-full px-4 py-3 pr-12 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 outline-none transition-all duration-200 hover:border-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 shadow-sm hover:shadow-md focus:shadow-lg" placeholder="e.g. Self-Employed" />
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleClearField('occupation_status', occupationStatusRef)}
                                        disabled={formData.occupation_status === ''}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md border border-slate-500/80 text-slate-200 hover:bg-slate-700 opacity-0 pointer-events-none transition-opacity group-focus-within:opacity-100 group-focus-within:pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed"
                                        aria-label="Clear Occupation Status"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {apiError && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center tracking-wide">{apiError}</div>}

                        <div className="flex gap-4 mt-12">
                            <button onClick={() => setStep(2)} className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold uppercase text-xs flex items-center gap-2 hover:bg-slate-700 transition-all"><ChevronLeft size={16} /> Back</button>
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/40">
                                {loading ? <><Loader2 className="animate-spin" size={16} /> Synchronizing Models...</> : 'Generate Intelligence Report'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Final Intelligence Report */}
                {step === 4 && result && (
                    <div className="animate-in zoom-in-95 duration-1000">
                        <div className="text-center mb-16 relative">
                            <div className="inline-flex p-4 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20 animate-pulse relative z-10">
                                <BarChart3 className="text-blue-400" size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Final Analysis</h2>
                            <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] mt-3 uppercase">Dynamic Life Stability Index</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Longevity Analysis Card */}
                            <div className="group flex flex-col p-8 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 transition-all hover:bg-slate-800 hover:border-blue-500/40 shadow-lg relative overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-6 text-center">Bio-Longevity</span>
                                <h3 className="text-7xl font-black text-white mb-2 text-center group-hover:scale-110 transition-transform duration-500 relative z-10">{result.longevity_prediction}</h3>
                                <p className="text-[10px] text-blue-400 font-bold uppercase text-center mb-8 italic">Projected Years</p>

                                <div className="mt-auto p-4 bg-slate-900/80 rounded-2xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info size={14} className="text-blue-400" />
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Longevity Insight</span>
                                    </div>
                                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic">
                                        "{getAdvice('longevity', result.longevity_prediction)}"
                                    </p>
                                </div>
                            </div>

                            {/* Health State Analysis Card */}
                            <div className="group flex flex-col p-8 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 transition-all hover:bg-slate-800 hover:border-emerald-500/40 shadow-lg relative overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-6 text-center">Clinical State</span>

                                <div className="flex-1 flex flex-col justify-center relative z-10">
                                    {getAdvice('health', result.health_condition)}
                                </div>

                                <p className="text-[10px] text-slate-400 font-bold uppercase text-center mt-8 italic">Neural Diagnostic</p>
                            </div>

                            {/* Financial Stability Card */}
                            <div className="group flex flex-col p-8 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 transition-all hover:bg-slate-800 hover:border-indigo-500/40 shadow-lg relative overflow-hidden">
                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-6 text-center">Stability Rating</span>
                                <h3 className="text-7xl font-black text-white mb-2 text-center group-hover:scale-110 transition-transform duration-500 relative z-10">{result.financial_status}</h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase text-center mb-8 italic">Resilience Score</p>

                                <div className="mt-auto p-4 bg-slate-900/80 rounded-2xl border border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet size={14} className="text-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Economic Forecast</span>
                                    </div>
                                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic">
                                        "{getAdvice('finance', result.financial_status)}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {result && <AnalysisDashboard data={result} />}

                        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                            <button onClick={downloadReport} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold uppercase text-xs hover:bg-slate-700 border border-slate-700 transition-all shadow-lg hover:shadow-xl">
                                <Download size={16} /> Download Report
                            </button>

                            <button onClick={() => {
                                setStep(1);
                                setResult(null);
                                setFormData({
                                    gender: 1,
                                    occupation_type: 3,
                                    avg_work_hours: 8,
                                    avg_rest_hours: 2,
                                    avg_sleep_hours: 7,
                                    avg_exercise_hours: 1,
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
                                setApiError('');
                            }} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase text-xs hover:bg-blue-500 border border-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
                                <RefreshCcw size={16} /> Start Over Assessment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictor;
