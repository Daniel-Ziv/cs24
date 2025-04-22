import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback';
import GPAPlanner from './components/GPAPlanner';
import { courseStyles } from './config/courseStyles';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/gpa" element={<GPAPlanner />} />      </Routes>
    </Router>
  );
};

export default AppRoutes; 