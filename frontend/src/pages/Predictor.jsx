import React, { useState } from 'react';
import axios from 'axios';

const Predictor = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

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
        // Numeric අගයන් එවන ඒවා number එකක් විදිහටම set කරමු
        const numericFields = ['age', 'gender', 'social_media_hours', 'netflix_hours', 'exercise_frequency', 'sleep_hours', 'screen_time', 'mental_health_rating', 'stress_level', 'occupation', 'sleep_duration', 'quality_of_sleep', 'physical_activity_level', 'stress_level_health', 'bmi_category', 'heart_rate', 'daily_steps', 'systolic_bp', 'diastolic_bp', 'years_employed', 'annual_income', 'credit_score', 'savings_assets', 'current_debt', 'Equity_Market', 'Fixed_Deposits'];

        setFormData({
            ...formData,
            [name]: numericFields.includes(name) ? parseFloat(value) : value
        });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict_all', formData);
            setResult(response.data.results);
            setStep(4);
        } catch {
            alert("Backend Error! Check if Flask is running.");
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
                </div>
            )}

            {/* STEP 4: RESULTS DASHBOARD */}
            {step === 4 && result && (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Your AI Analysis Report</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-100 text-center">
                            <p className="text-red-600 font-bold uppercase text-xs tracking-widest">Dropout Risk</p>
                            <p className="text-4xl font-black text-red-700 mt-2">{result.dropout_risk}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 text-center">
                            <p className="text-green-600 font-bold uppercase text-xs tracking-widest">Sleep Health</p>
                            <p className="text-2xl font-black text-green-700 mt-2">{result.health_condition}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-3xl border border-purple-100 text-center">
                            <p className="text-purple-600 font-bold uppercase text-xs tracking-widest">Financial</p>
                            <p className="text-xl font-black text-purple-700 mt-2">{result.financial_status}</p>
                        </div>
                    </div>
                    <button onClick={() => setStep(1)} className="w-full py-4 text-indigo-600 font-bold hover:bg-indigo-50 rounded-2xl transition-all">Analyze New Data</button>
                </div>
            )}
        </div>
    );
};

export default Predictor;