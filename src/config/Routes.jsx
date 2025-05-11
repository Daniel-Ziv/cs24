import React from 'react';
import { BrowserRouter ,HashRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import AuthCallback from '../components/AuthCallback';
import GpaCalc from '../pages/GpaCalc';
import Courses from '../pages/Courses';
import ProfilePage from '../components/ProfilePage';
import ScrollToTop from '../components/ScrollToTop'; 
import NotFoundPage from '../components/NotFoundPage';
import CourseDetails from '../pages/CourseDetails';
import UploadPage from '../pages/UploadPage';
import UserDashboard from '../pages/userDashboard';
import About from '../pages/About';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';

const isDev = process.env.REACT_APP_DEV === "true";
const Router = isDev ? HashRouter : BrowserRouter;

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/gpa" element={<GpaCalc />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/tutors/:courseType/:id/:tutorName" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 

