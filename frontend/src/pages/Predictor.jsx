import React, { useState } from 'react';
import axios from 'axios';

const Predictor = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [apiError, setApiError] = useState('');
    const [submittedData, setSubmittedData] = useState(null);

    const [formData, setFormData] = useState({
        // --- Step 1: Personal & Dropout Risk (9 Features) ---
        age: 20,
        gender: 1, // 0: Female, 1: Male
        social_media_hours: 0,
        netflix_hours: 0,
        exercise_frequency: 0,
        sleep_hours: 0,
        screen_time: 0,
        mental_health_rating: 5,
        stress_level: 5,

        // --- Step 2: Health & Sleep (12 Features) ---
        occupation: 0, // Encoder values: 0, 1, 2...
        sleep_duration: 7,
        quality_of_sleep: 5,
        physical_activity_level: 30,
        stress_level_health: 5,
        bmi_category: 0, // 0: Normal, 1: Overweight, etc.
        heart_rate: 72,
        daily_steps: 5000,
        systolic_bp: 120,
        diastolic_bp: 80,

        // --- Step 3: Financial (10 Features) ---
        years_employed: 1,
        annual_income: 50000,
        credit_score: 650,
        savings_assets: 10000,
        current_debt: 0,
        Equity_Market: 0,
        Fixed_Deposits: 0,
        occupation_status: 'Student', // Dropdown logic handle in handleInputChange
        investment_avenues: 'No',
        stock_market: 'No'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // ලිස්ට් එකේ නැති String values (dropdowns) කෙලින්ම set කරනවා
        const stringFields = ['occupation_status', 'investment_avenues', 'stock_market'];

        setFormData({
            ...formData,
            [name]: stringFields.includes(name) ? value : parseFloat(value) || 0
        });
    };
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setApiError('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict_all', formData);

            if (response.data?.status !== 'success' || !response.data?.results) {
                throw new Error(response.data?.message || 'Invalid response from backend');
            }

            setSubmittedData({ ...formData });
            setResult(response.data.results);
            setStep(4);
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Backend Error! Check if Flask is running.';
            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-100">
            {/* Progress Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-gray-800">LifeBalance AI Analyzer</h1>
                <p className="text-gray-500 mt-2">Step {step} of 3: {step === 1 ? 'Lifestyle' : step === 2 ? 'Health' : 'Finance'}</p>
                <div className="mt-4 flex gap-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            </div>

            {/* STEP 1: PERSONAL & LIFESTYLE */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    <div className="col-span-2"><h2 className="text-xl font-bold text-indigo-700 border-b pb-2">Academic & Lifestyle</h2></div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1">
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Social Media (Hours/Day)</label>
                        <input type="number" name="social_media_hours" value={formData.social_media_hours} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Netflix (Hours/Day)</label>
                        <input type="number" name="netflix_hours" value={formData.netflix_hours} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Exercise Frequency (Days/Week)</label>
                        <input type="number" name="exercise_frequency" value={formData.exercise_frequency} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Sleep Hours (Lifestyle)</label>
                        <input type="number" name="sleep_hours" value={formData.sleep_hours} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Screen Time (Hours/Day)</label>
                        <input type="number" name="screen_time" value={formData.screen_time} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Mental Health Rating (1-10)</label>
                        <input type="number" min="1" max="10" name="mental_health_rating" value={formData.mental_health_rating} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Stress Level (1-10)</label>
                        <input type="range" min="1" max="10" name="stress_level" value={formData.stress_level} onChange={handleInputChange} className="w-full mt-2" />
                        <p className="text-xs text-gray-500 mt-1">Current: {formData.stress_level}</p>
                    </div>
                    <button onClick={nextStep} className="col-span-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Continue to Health</button>
                </div>
            )}

            {/* STEP 2: DETAILED HEALTH */}
            {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right duration-500">
                    <div className="col-span-2"><h2 className="text-xl font-bold text-green-700 border-b pb-2">Comprehensive Health Data</h2></div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Occupation Category</label>
                        <select name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1">
                            <option value="0">Software Engineer</option>
                            <option value="1">Doctor/Nurse</option>
                            <option value="2">Student</option>
                            <option value="3">Teacher</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">BMI Category</label>
                        <select name="bmi_category" value={formData.bmi_category} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1">
                            <option value="0">Normal</option>
                            <option value="1">Overweight</option>
                            <option value="2">Obese</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Sleep Duration (Hours)</label>
                        <input type="number" name="sleep_duration" value={formData.sleep_duration} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Quality of Sleep (1-10)</label>
                        <input type="number" min="1" max="10" name="quality_of_sleep" value={formData.quality_of_sleep} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Physical Activity Level (Minutes/Day)</label>
                        <input type="number" name="physical_activity_level" value={formData.physical_activity_level} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Health Stress Level (1-10)</label>
                        <input type="number" min="1" max="10" name="stress_level_health" value={formData.stress_level_health} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Heart Rate (BPM)</label>
                        <input type="number" name="heart_rate" value={formData.heart_rate} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">Daily Steps</label>
                        <input type="number" name="daily_steps" value={formData.daily_steps} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">Blood Pressure (Systolic/Diastolic)</label>
                        <div className="flex gap-2">
                            <input type="number" name="systolic_bp" placeholder="Sys" value={formData.systolic_bp} onChange={handleInputChange} className="w-1/2 p-3 bg-gray-50 border rounded-xl" />
                            <input type="number" name="diastolic_bp" placeholder="Dia" value={formData.diastolic_bp} onChange={handleInputChange} className="w-1/2 p-3 bg-gray-50 border rounded-xl" />
                        </div>
                    </div>
                    <div className="flex col-span-2 gap-4">
                        <button onClick={prevStep} className="w-1/3 bg-gray-100 py-4 rounded-2xl font-bold text-gray-600">Back</button>
                        <button onClick={nextStep} className="w-2/3 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-200">Continue to Finance</button>
                    </div>
                </div>
            )}

            {/* STEP 3: FINANCIAL STATUS */}
            {step === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right duration-500">
                    <div className="col-span-2"><h2 className="text-xl font-bold text-purple-700 border-b pb-2">Financial Stability</h2></div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Annual Income (LKR)</label>
                        <input type="number" name="annual_income" value={formData.annual_income} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Credit Score</label>
                        <input type="number" name="credit_score" value={formData.credit_score} placeholder="300-850" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Years Employed</label>
                        <input type="number" name="years_employed" value={formData.years_employed} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Savings Assets</label>
                        <input type="number" name="savings_assets" value={formData.savings_assets} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Current Debt</label>
                        <input type="number" name="current_debt" value={formData.current_debt} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Equity Market Amount</label>
                        <input type="number" name="Equity_Market" value={formData.Equity_Market} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Fixed Deposits Amount</label>
                        <input type="number" name="Fixed_Deposits" value={formData.Fixed_Deposits} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Occupation Status</label>
                        <select name="occupation_status" value={formData.occupation_status} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1">
                            <option value="Student">Student</option>
                            <option value="Salaried">Salaried</option>
                            <option value="Self-Employed">Self-Employed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Investment Avenues?</label>
                        <select name="investment_avenues" value={formData.investment_avenues} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Stock Market Investor?</label>
                        <select name="stock_market" value={formData.stock_market} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border rounded-xl mt-1">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div className="flex col-span-2 gap-4">
                        <button onClick={prevStep} className="w-1/3 bg-gray-100 py-4 rounded-2xl font-bold text-gray-600">Back</button>
                        <button onClick={handleSubmit} disabled={loading} className="w-2/3 bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200">
                            {loading ? 'Processing...' : 'Generate Full Report'}
                        </button>
                    </div>
                    {apiError && (
                        <div className="col-span-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm">
                            Prediction failed: {apiError}
                        </div>
                    )}
                </div>
            )}


            {/* STEP 4: RESULTS DASHBOARD - CLEAN VERSION */}
            {step === 4 && result && (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <h2 className="text-3xl font-black text-center text-gray-800 mb-8">AI Analysis Report</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* 1. Personal & Academic Card */}
                        <div className="p-8 bg-white rounded-[2rem] border-2 border-orange-100 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 bg-orange-100 rounded-bl-2xl text-orange-600 font-bold text-xs">PERSONAL</div>
                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Dropout Risk</p>
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 mb-4">
                                <p className="text-3xl font-black text-orange-600">{result.dropout_risk}</p>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {parseFloat(result.dropout_risk) > 50 ? "High risk detected. Consider adjusting your workload." : "Your academic path looks stable."}
                            </p>
                        </div>

                        {/* 2. Health & Sleep Card */}
                        <div className="p-8 bg-white rounded-[2rem] border-2 border-emerald-100 shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 bg-emerald-100 rounded-bl-2xl text-emerald-600 font-bold text-xs">HEALTH</div>
                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Sleep Condition</p>
                            <div className="py-4 px-6 bg-emerald-50 rounded-2xl mb-4">
                                <p className="text-xl font-black text-emerald-700">{result.health_condition}</p>
                            </div>
                            <p className="text-sm text-gray-600">Based on your activity and sleep patterns, your health status is identified as {result.health_condition}.</p>
                        </div>

                        {/* 3. Financial Stability Card */}
                        {(() => {
                            const score = parseFloat(result.financial_status.replace(/[^0-9.]/g, ''));
                            const isGood = score > 15; // Score eka 15ta wedi nam "Good" kiyala gannawa
                            return (
                                <div className={`p-8 bg-white rounded-[2rem] border-2 ${isGood ? 'border-purple-100' : 'border-red-100'} shadow-xl text-center relative overflow-hidden`}>
                                    <div className={`absolute top-0 right-0 p-3 ${isGood ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'} rounded-bl-2xl font-bold text-xs`}>FINANCE</div>
                                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">Stability Score</p>
                                    <p className={`text-4xl font-black ${isGood ? 'text-purple-700' : 'text-red-600'} mt-2`}>{score.toFixed(2)}</p>
                                    <div className={`mt-4 py-2 px-4 rounded-full text-xs font-bold inline-block ${isGood ? 'bg-purple-50 text-purple-700' : 'bg-red-50 text-red-700'}`}>
                                        {isGood ? "STRONGLY STABLE" : "NEEDS ATTENTION"}
                                    </div>
                                </div>
                            );
                        })()}

                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setStep(1)}
                            className="group flex items-center gap-3 px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-2xl"
                        >
                            <span>Run New Analysis</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictor;