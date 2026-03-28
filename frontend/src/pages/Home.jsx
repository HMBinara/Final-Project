import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, GraduationCap, Wallet, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    // Navigation to the predictor page
    const handleGetStarted = () => {
        navigate('/predict');
    };

    return (
        <div className="bg-white text-gray-900 min-h-screen">
            {/* Hero Section */}
            <header className="py-20 px-6 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <h1 className="text-5xl font-extrabold mb-4">LifeBalance Monitoring System</h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    An AI-powered platform to monitor your academic progress, physical health, and financial stability in one place.
                </p>
                <button
                    onClick={handleGetStarted}
                    className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold text-lg flex items-center mx-auto hover:bg-gray-100 transition shadow-lg"
                >
                    Get Started <ArrowRight className="ml-2" />
                </button>
            </header>

            {/* Services/Categories Section */}
            <section className="py-16 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">What We Analyze</h2>
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Academic Risk Card */}
                    <div className="p-8 border rounded-2xl hover:shadow-xl transition text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="text-blue-600 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Academic Risk</h3>
                        <p className="text-gray-600">
                            Predicting potential dropout risks based on your daily lifestyle and study habits.
                        </p>
                    </div>

                    {/* Health Analysis Card */}
                    <div className="p-8 border rounded-2xl hover:shadow-xl transition text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="text-green-600 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Health & Sleep</h3>
                        <p className="text-gray-600">
                            Analyzing sleep patterns and physical activity to assess your overall wellbeing.
                        </p>
                    </div>

                    {/* Financial Stability Card */}
                    <div className="p-8 border rounded-2xl hover:shadow-xl transition text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet className="text-purple-600 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Financial Stability</h3>
                        <p className="text-gray-600">
                            Monitoring income and expenses to ensure your financial status remains stable.
                        </p>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-center border-t text-gray-500">
                <p>© 2026 LifeBalance Monitoring System - Binara Nethranjana</p>
            </footer>
        </div>
    );
};

export default Home;