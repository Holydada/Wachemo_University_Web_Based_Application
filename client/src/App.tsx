import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Global CSS
import './styles/global.css';
// Import Premium Components CSS
import './styles/premium-components.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import ErrorBoundary from './components/UI/ErrorBoundary';

// Public Pages
import LandingPageExact from './pages/LandingPageExact';
import LoginPage from './pages/LoginPage';

// Protected Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import OnlineExamination from './pages/OnlineExamination';
import StudentRegistration from './pages/StudentRegistration';
import CafeteriaManagement from './pages/CafeteriaManagement';
import LibraryManagement from './pages/LibraryManagement';
import StudentIdManagement from './pages/StudentIdManagement';
import GradeManagement from './pages/GradeManagement';
import TeacherGradeEntry from './pages/TeacherGradeEntry';
import NewsManagement from './pages/NewsManagement';
import ELearningPlatform from './pages/ELearningPlatform';
import StudentClearance from './pages/StudentClearance';
import CostSharingAgreement from './pages/CostSharingAgreement';
import DormitoryManagement from './pages/DormitoryManagement';
import EPaymentSystem from './pages/EPaymentSystem';
import StudentBehaviorHistory from './pages/StudentBehaviorHistory';
import UniversityPartnerships from './pages/UniversityPartnerships';
import HRManagement from './pages/HRManagement';

// Faculty Components
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import ExamCreation from './pages/Faculty/ExamCreation';
import CourseManagement from './pages/Faculty/CourseManagement';

// Admin Components
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';

// Registrar Components
import RegistrarDashboard from './pages/Registrar/RegistrarDashboard';

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

            {/* Protected Dashboard Route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/registration" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentRegistration />
              </ProtectedRoute>
            } />
            
            <Route path="/exams" element={
              <ProtectedRoute allowedRoles={['student']}>
                <OnlineExamination />
              </ProtectedRoute>
            } />
            
            <Route path="/cafeteria" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CafeteriaManagement />
              </ProtectedRoute>
            } />

            <Route path="/grades" element={
              <ProtectedRoute allowedRoles={['student']}>
                <GradeManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/library" element={
              <ProtectedRoute allowedRoles={['student']}>
                <LibraryManagement />
              </ProtectedRoute>
            } />

            <Route path="/student-id" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentIdManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/dorm" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DormitoryManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/clearance" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentClearance />
              </ProtectedRoute>
            } />
            
            <Route path="/cost-sharing" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CostSharingAgreement />
              </ProtectedRoute>
            } />
            
            <Route path="/e-learning" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ELearningPlatform />
              </ProtectedRoute>
            } />

            {/* Teacher/Faculty Routes */}
            <Route path="/grade-entry" element={
              <ProtectedRoute allowedRoles={['faculty', 'department_head', 'dean']}>
                <TeacherGradeEntry />
              </ProtectedRoute>
            } />

            <Route path="/faculty-dashboard" element={
              <ProtectedRoute allowedRoles={['faculty', 'department_head', 'dean']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } />

            <Route path="/exam-creation" element={
              <ProtectedRoute allowedRoles={['faculty', 'department_head', 'dean']}>
                <ExamCreation />
              </ProtectedRoute>
            } />

            <Route path="/course-management" element={
              <ProtectedRoute allowedRoles={['faculty', 'department_head', 'dean']}>
                <CourseManagement />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/user-management" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />

            <Route path="/news-management" element={
              <ProtectedRoute allowedRoles={['admin', 'registrar']}>
                <NewsManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/partnerships" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UniversityPartnerships />
              </ProtectedRoute>
            } />

            <Route path="/hr-management" element={
              <ProtectedRoute allowedRoles={['admin', 'hr_admin']}>
                <HRManagement />
              </ProtectedRoute>
            } />

            {/* Registrar Routes */}
            <Route path="/registrar-dashboard" element={
              <ProtectedRoute allowedRoles={['registrar']}>
                <RegistrarDashboard />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/payment" element={
              <ProtectedRoute allowedRoles={['student']}>
                <EPaymentSystem />
              </ProtectedRoute>
            } />

            <Route path="/behavior-history" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentBehaviorHistory />
              </ProtectedRoute>
            } />

            {/* Legacy route redirects */}
            <Route path="/student-dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/faculty-dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />

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
