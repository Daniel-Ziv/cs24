import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback';
import Privacy from './components/static/Privacy';
import Terms from './components/static/Terms';
import GpaCalc from './pages/GpaCalc';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/gpa" element={<GpaCalc />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 