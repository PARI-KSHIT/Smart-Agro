/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import DetectDisease from './pages/DetectDisease';
import SearchFertilizers from './pages/SearchFertilizers';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Weather from './pages/Weather';
import Market from './pages/Market';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AnalysisHistory from './pages/AnalysisHistory';
import ProfilePage from './pages/ProfilePage';

function RootRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      }>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        {/* Weather is public but can also be seen by auth users via sidebar */}
        {!isAuthenticated && <Route path="/weather" element={<Weather />} />}
      </Route>

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detect" element={<DetectDisease />} />
        <Route path="/analysis-history" element={<AnalysisHistory />} />
        <Route path="/fertilizers" element={<SearchFertilizers />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Weather in protected layout when logged in */}
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<Market />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <Outlet />
        </AdminProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserManagement />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}
