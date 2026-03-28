import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Predictor from './pages/Predictor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predictor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;