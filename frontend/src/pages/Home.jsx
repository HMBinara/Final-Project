import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Activity, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500/30">
      <nav className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LifeBalance</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Intelligence Report v2.0 Live
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
                Optimize Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Life Balance</span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
                Our advanced monitoring system analyzes your routine to generate a personalized Intelligence Report. Reclaim your focus, health, and productivity.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 border-l-2 border-slate-800 pl-6">
                <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 duration-200">
                  Start Monitoring <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="text-sm text-slate-500">
                  Join 10,000+ users transforming<br/>their daily routines today.
                </div>
              </div>
            </div>

            <div className="relative lg:ml-auto w-full max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/0 rounded-3xl transform rotate-6 border border-slate-700/50 backdrop-blur-sm -z-10 transition-transform hover:rotate-3 duration-500"></div>
              <img 
                src="/hero.png" 
                alt="Life Balance App Preview" 
                className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-blue-900/50 border border-slate-700/50"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-slate-800 bg-slate-900/50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Professional Intelligence Analysis</h2>
              <p className="text-slate-400">Everything you need to monitor, adapt, and succeed in balancing your life.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Activity, title: 'Real-time Tracking', desc: 'Monitor your vital statistics and productivity cycles automatically.' },
                { icon: Brain, title: 'AI Predictions', desc: 'Get smart suggestions before burnout heavily affects your life.' },
                { icon: Shield, title: 'Secure Reports', desc: 'Your intelligence data is stored securely and entirely private to you.' },
              ].map((f, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;