import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '../components/common/ProtectedRoute';
import DashboardLayout from '../components/common/DashboardLayout';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Donor Pages
import DonorDashboard from '../pages/donor/DonorDashboard';
import DonorProfilePage from '../pages/donor/DonorProfilePage';
import DonorOffersPage from '../pages/donor/DonorOffersPage';
import DonorHistoryPage from '../pages/donor/DonorHistoryPage';

// Receiver Pages
import ReceiverDashboard from '../pages/receiver/ReceiverDashboard';
import CreateRequestPage from '../pages/receiver/CreateRequestPage';
import ReceiverRequestsPage from '../pages/receiver/ReceiverRequestsPage';
import SearchDonorsPage from '../pages/receiver/SearchDonorsPage';

// Hospital Pages
import HospitalDashboard from '../pages/hospital/HospitalDashboard';
import HospitalProfilePage from '../pages/hospital/HospitalProfilePage';
import InventoryPage from '../pages/hospital/InventoryPage';
import HospitalRequestsPage from '../pages/hospital/HospitalRequestsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageRequests from '../pages/admin/ManageRequests';
import ManageHospitals from '../pages/admin/ManageHospitals';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          
          {/* Donor */}
          <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['DONOR']}><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/profile"   element={<ProtectedRoute allowedRoles={['DONOR']}><DonorProfilePage /></ProtectedRoute>} />
          <Route path="/donor/offers"    element={<ProtectedRoute allowedRoles={['DONOR']}><DonorOffersPage /></ProtectedRoute>} />
          <Route path="/donor/history"   element={<ProtectedRoute allowedRoles={['DONOR']}><DonorHistoryPage /></ProtectedRoute>} />

          {/* Receiver */}
          <Route path="/receiver/dashboard"      element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReceiverDashboard /></ProtectedRoute>} />
          <Route path="/receiver/create-request" element={<ProtectedRoute allowedRoles={['RECEIVER']}><CreateRequestPage /></ProtectedRoute>} />
          <Route path="/receiver/requests"       element={<ProtectedRoute allowedRoles={['RECEIVER']}><ReceiverRequestsPage /></ProtectedRoute>} />
          <Route path="/receiver/search-donors"  element={<ProtectedRoute allowedRoles={['RECEIVER']}><SearchDonorsPage /></ProtectedRoute>} />

          {/* Hospital / Blood Bank Routes */}
          <Route path="/hospital/dashboard" element={<ProtectedRoute allowedRoles={['HOSPITAL']}><HospitalDashboard /></ProtectedRoute>} />
          <Route path="/hospital/profile"   element={<ProtectedRoute allowedRoles={['HOSPITAL']}><HospitalProfilePage /></ProtectedRoute>} />
          <Route path="/hospital/inventory" element={<ProtectedRoute allowedRoles={['HOSPITAL']}><InventoryPage /></ProtectedRoute>} />
          <Route path="/hospital/requests"  element={<ProtectedRoute allowedRoles={['HOSPITAL']}><HospitalRequestsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"     element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/requests"  element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageRequests /></ProtectedRoute>} />
          <Route path="/admin/hospitals" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageHospitals /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}