import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect to role-specific dashboard
  if (user) {
    switch (user.role) {
      case 'student':
        return <Navigate to="/dashboard/student" replace />;
      case 'faculty':
      case 'department_head':
      case 'dean':
        return <Navigate to="/dashboard/faculty" replace />;
      case 'admin':
      case 'registrar':
        return <Navigate to="/dashboard/admin" replace />;
      default:
        return <Navigate to="/dashboard/student" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

export default DashboardPage;