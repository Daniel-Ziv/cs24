import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import AuthCallback from '../components/AuthCallback';
import GpaCalc from '../pages/GpaCalc';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import UploadPage from '../pages/UploadPage';
import UserDashboard from '../pages/userDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/gpa" element={<GpaCalc />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/UploadPage" element={<UploadPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes; 