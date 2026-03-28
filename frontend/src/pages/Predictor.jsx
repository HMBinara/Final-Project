import React, { useState } from 'react';
import axios from 'axios';

const Predictor = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Academic & Lifestyle
        social_media: 0, netflix: 0, exercise: 0, sleep: 0, screen: 0,
        age: 20, gender: 1, mental_health: 5, stress: 5,
        // Step 2: Health
        sleep_duration: 7, physical_activity: 30,
        // Step 3: Financial
        income: 0, expenses: 0, savings: 0
    });

    const [result, setResult] = useState(null);

    // Generic function to handle all input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/predict_all', formData);
            setResult(response.data.results);
            setStep(4);
        } catch (error) {
            alert("Error connecting to Backend!");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10">

            {/* Progress Bar - To show user the current stage */}
            <div className="mb-8 flex justify-between">
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-2 w-1/3 mx-1 rounded ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                ))}
            </div>

            {/* Step 1: Academic & Lifestyle Inputs */}
            {step === 1 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-700">Step 1: Academic & Lifestyle</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Social Media (Hours)</label>
                            <input type="number" name="social_media" value={formData.social_media} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Netflix (Hours)</label>
                            <input type="number" name="netflix" value={formData.netflix} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Screen Time (Hours)</label>
                            <input type="number" name="screen" value={formData.screen} onChange={handleInputChange} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <button onClick={nextStep} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Next Step</button>
                </div>
            )}

            {/* Step 2: Health & Sleep Inputs */}
            {step === 2 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-green-700">Step 2: Health & Sleep</h2>
                    <div>
                        <label className="block text-sm font-medium">Daily Sleep Duration (Hours)</label>
                        <input type="number" name="sleep_duration" value={formData.sleep_duration} onChange={handleInputChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Physical Activity (Minutes)</label>
                        <input type="number" name="physical_activity" value={formData.physical_activity} onChange={handleInputChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={prevStep} className="w-1/2 bg-gray-200 py-2 rounded-lg">Back</button>
                        <button onClick={nextStep} className="w-1/2 bg-blue-600 text-white py-2 rounded-lg">Next Step</button>
                    </div>
                </div>
            )}

            {/* Step 3: Financial Background Inputs */}
            {step === 3 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-purple-700">Step 3: Financial Status</h2>
                    <div>
                        <label className="block text-sm font-medium">Monthly Income (LKR)</label>
                        <input type="number" name="income" value={formData.income} onChange={handleInputChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Monthly Expenses (LKR)</label>
                        <input type="number" name="expenses" value={formData.expenses} onChange={handleInputChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={prevStep} className="w-1/2 bg-gray-200 py-2 rounded-lg">Back</button>
                        <button onClick={handleSubmit} className="w-1/2 bg-green-600 text-white py-2 rounded-lg">Predict All</button>
                    </div>
                </div>
            )}

            {/* Step 4: Final Results Dashboard */}
            {step === 4 && result && (
                <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 underline">Prediction Results</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-red-700 font-bold">Dropout Risk</p>
                            <p className="text-2xl">{result.dropout_risk}</p>
                        </div>
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <p className="text-green-700 font-bold">Sleep/Health Condition</p>
                            <p className="text-2xl">{result.health_condition}</p>
                        </div>
                        <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                            <p className="text-purple-700 font-bold">Financial Stability</p>
                            <p className="text-2xl">{result.financial_status}</p>
                        </div>
                    </div>
                    <button onClick={() => setStep(1)} className="mt-4 text-blue-600 font-semibold">Restart Analysis</button>
                </div>
            )}
        </div>
    );
};

export default Predictor;