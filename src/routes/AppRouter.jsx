import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import AdminRouter from './AdminRouter';
import LecturerRouter from './lecturerRouter';
import StudentRouter from './StudentRouter';
import ParentRouter from './ParentRouter';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import SuperAdminRouter from './SuperAdminRouter';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/superadmin/*" element={<SuperAdminRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/lecturer/*" element={<LecturerRouter />} />
      <Route path="/student/*" element={<StudentRouter />} />
      <Route path="/parent/*" element={<ParentRouter />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default AppRouter;
