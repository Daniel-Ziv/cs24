import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AuthCallback from './components/AuthCallback';
import ProfilePage from './components/ProfilePage';
import ScrollToTop from './components/ScrollToTop'; 
import NotFoundPage from './components/NotFoundPage';
const isDev = process.env.REACT_APP_DEV === "true";
const Router = isDev ? HashRouter : BrowserRouter; // Use HashRouter in dev mode
const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Always scroll to top on navigation */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/tutors/:tutorName" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 