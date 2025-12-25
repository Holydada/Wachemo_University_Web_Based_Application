import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Global CSS
import './styles/global.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/UI/ErrorBoundary';

// Public Pages
import LandingPageExact from './pages/LandingPageExact';
import LoginPage from './pages/LoginPage';

// Protected Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import StudentDashboard from './pages/Dashboard/StudentDashboard';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPageExact />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes with Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="faculty" element={
                <ProtectedRoute allowedRoles={['faculty', 'department_head', 'dean']}>
                  <div className="container py-5 text-center">
                    <h2>👨‍🏫 Faculty Dashboard</h2>
                    <p>Faculty dashboard coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin', 'registrar']}>
                  <div className="container py-5 text-center">
                    <h2>⚙️ Admin Dashboard</h2>
                    <p>Admin dashboard coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#28a745',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc3545',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
