import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Home / Landing page
import HomePage from '../pages/HomePage';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Dashboard pages  
import DashboardPage from '../pages/DashboardPage';
import SkillsPage from '../pages/SkillsPage';
import CompaniesPage from '../pages/CompaniesPage';
import CompanyDetailPage from '../pages/CompanyDetailPage';
import MatchesPage from '../pages/MatchesPage';
import RoleDetailPage from '../pages/RoleDetailPage';
import RoadmapsPage from '../pages/RoadmapsPage';
import RoadmapDetailPage from '../pages/RoadmapDetailPage';
import SavedPage from '../pages/SavedPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <p className="text-slate-500 text-sm">Loading SkillSync...</p>
      </div>
    </div>
  );
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

export default function AppRoutes() {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Dashboard Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/roles/:roleId" element={<RoleDetailPage />} />
        <Route path="/roadmaps" element={<RoadmapsPage />} />
        <Route path="/roadmaps/:roadmapId" element={<RoadmapDetailPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
