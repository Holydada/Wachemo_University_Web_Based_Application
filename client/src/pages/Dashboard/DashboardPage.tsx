import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import SharedLayout from '../../components/Layout/SharedLayout';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // Map user roles to SharedLayout roles
  const getLayoutRole = (userRole: string): 'student' | 'teacher' | 'admin' | 'registrar' | 'hr' => {
    switch (userRole) {
      case 'faculty':
      case 'department_head':
      case 'dean':
        return 'teacher';
      case 'admin':
        return 'admin';
      case 'registrar':
        return 'registrar';
      case 'hr_admin':
        return 'hr';
      case 'student':
      default:
        return 'student';
    }
  };

  // Render role-specific dashboard directly
  switch (user.role) {
    case 'student':
      return (
        <SharedLayout title="Student Dashboard" userRole="student">
          <StudentDashboard />
        </SharedLayout>
      );
    
    case 'faculty':
    case 'department_head':
    case 'dean':
      return (
        <SharedLayout title="Faculty Dashboard" userRole="teacher">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>👨‍🏫 Faculty Dashboard</h2>
            <p>Welcome, {user.profile?.full_name}!</p>
            <p>Use the navigation menu to access faculty features.</p>
            <div style={{ marginTop: '20px' }}>
              <a href="/faculty-dashboard" style={{ 
                background: '#7a0a2d', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}>
                Go to Faculty Dashboard
              </a>
            </div>
          </div>
        </SharedLayout>
      );
    
    case 'admin':
      return (
        <SharedLayout title="Admin Dashboard" userRole="admin">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>⚙️ Admin Dashboard</h2>
            <p>Welcome, {user.profile?.full_name}!</p>
            <p>Use the navigation menu to access admin features.</p>
            <div style={{ marginTop: '20px' }}>
              <a href="/admin-dashboard" style={{ 
                background: '#7a0a2d', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}>
                Go to Admin Dashboard
              </a>
            </div>
          </div>
        </SharedLayout>
      );
    
    case 'registrar':
      return (
        <SharedLayout title="Registrar Dashboard" userRole="registrar">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>📋 Registrar Dashboard</h2>
            <p>Welcome, {user.profile?.full_name}!</p>
            <p>Use the navigation menu to access registrar features.</p>
            <div style={{ marginTop: '20px' }}>
              <a href="/registrar-dashboard" style={{ 
                background: '#7a0a2d', 
                color: 'white', 
                padding: '10px 20px', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}>
                Go to Registrar Dashboard
              </a>
            </div>
          </div>
        </SharedLayout>
      );
    
    default:
      return (
        <SharedLayout title="Dashboard" userRole="student">
          <StudentDashboard />
        </SharedLayout>
      );
  }
};

export default DashboardPage;