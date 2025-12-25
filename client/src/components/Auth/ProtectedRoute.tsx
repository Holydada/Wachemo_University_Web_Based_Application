import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, hasRole } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles && !hasRole(user, allowedRoles)) {
    // Redirect based on user role
    const roleRedirects: Record<UserRole, string> = {
      student: '/dashboard/student',
      faculty: '/dashboard/faculty',
      admin: '/dashboard/admin',
      registrar: '/dashboard/admin',
      dean: '/dashboard/faculty',
      department_head: '/dashboard/faculty',
      librarian: '/dashboard',
      cafeteria_staff: '/dashboard',
      dormitory_admin: '/dashboard',
      hr_admin: '/dashboard/admin',
    };

    const defaultRedirect = roleRedirects[user.role] || '/dashboard';
    
    return <Navigate to={defaultRedirect} replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;