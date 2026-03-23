/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import InviteCode from './pages/InviteCode';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Admin from './pages/Admin';
import DiscordCallback from './pages/DiscordCallback';

const ProtectedRoute = ({ children, requireRole }: { children: React.ReactNode, requireRole?: string }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!profile) return <Navigate to="/invite" />;
  if (requireRole && profile.role !== requireRole) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/invite" element={<InviteCode />} />
          <Route path="/auth/callback" element={<DiscordCallback />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="course" element={
              <ProtectedRoute requireRole="trainee">
                <Course />
              </ProtectedRoute>
            } />
            <Route path="admin" element={
              <ProtectedRoute requireRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

