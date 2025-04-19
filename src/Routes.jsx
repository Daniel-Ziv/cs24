import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HitPage from './pages/HitPage';
import LandingPage from './pages/LandingPage';
import AuthCallback from './components/AuthCallback';

const isDevMode = process.env.REACT_APP_DEV === 'true';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={isDevMode ? <LandingPage /> : <HitPage />} />
        <Route path="/HitPage" element={<HitPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 