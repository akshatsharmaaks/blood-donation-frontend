import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import DonorDashboard from '../pages/donor/DonorDashboard';
import ReceiverDashboard from '../pages/receiver/ReceiverDashboard';
import HospitalDashboard from '../pages/hospital/HospitalDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboards */}
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/receiver/dashboard" element={<ReceiverDashboard />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}