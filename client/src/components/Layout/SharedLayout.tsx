import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SharedLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSidebar?: boolean;
  userRole?: 'student' | 'teacher' | 'admin' | 'registrar' | 'hr';
}

const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  children, 
  title = "Wachemo University", 
  showSidebar = true,
  userRole = 'student'
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const sidebarItems = {
    student: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/registration', label: 'Registration', icon: '📝' },
      { path: '/grades', label: 'Grades', icon: '📊' },
      { path: '/exams', label: 'Online Exams', icon: '📋' },
      { path: '/cafeteria', label: 'Cafeteria', icon: '🍽️' },
      { path: '/library', label: 'Library', icon: '📚' },
      { path: '/student-id', label: 'Student ID', icon: '🆔' },
      { path: '/dorm', label: 'Dormitory', icon: '🏠' },
      { path: '/clearance', label: 'Clearance', icon: '✅' },
      { path: '/cost-sharing', label: 'Cost Sharing', icon: '💰' },
      { path: '/e-learning', label: 'E-Learning', icon: '💻' },
      { path: '/payment', label: 'E-Payment', icon: '💳' },
      { path: '/behavior-history', label: 'Behavior History', icon: '📊' },
    ],
    teacher: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/faculty-dashboard', label: 'Faculty Dashboard', icon: '👨‍🏫' },
      { path: '/grade-entry', label: 'Grade Entry', icon: '📊' },
      { path: '/exam-creation', label: 'Create Exams', icon: '📋' },
      { path: '/course-management', label: 'My Courses', icon: '📚' },
    ],
    admin: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/admin-dashboard', label: 'Admin Dashboard', icon: '⚙️' },
      { path: '/user-management', label: 'User Management', icon: '👤' },
      { path: '/news-management', label: 'News & Announcements', icon: '📢' },
      { path: '/partnerships', label: 'University Partnerships', icon: '🤝' },
      { path: '/hr-management', label: 'HR Management', icon: '👥' },
      { path: '/reports', label: 'Reports', icon: '📈' },
    ],
    registrar: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/registrar-dashboard', label: 'Registrar Dashboard', icon: '📋' },
      { path: '/news-management', label: 'News Management', icon: '📢' },
      { path: '/student-registration', label: 'Student Registration', icon: '📝' },
      { path: '/grade-approval', label: 'Grade Approval', icon: '✅' },
      { path: '/clearance-approval', label: 'Clearance Approval', icon: '📋' },
      { path: '/id-printing', label: 'ID Printing', icon: '🖨️' },
    ],
    hr: [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/hr-management', label: 'HR Management', icon: '👥' },
      { path: '/staff-management', label: 'Staff Management', icon: '👤' },
      { path: '/recruitment', label: 'Recruitment', icon: '📋' },
      { path: '/salary-management', label: 'Salary Management', icon: '💰' },
    ]
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo2.png" alt="WCU Logo" style={{ height: '40px' }} />
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#7a0a2d' }}>
              Wachemo University
            </span>
          </Link>
          <span style={{ color: '#64748b', fontSize: '14px' }}>|</span>
          <span style={{ color: '#64748b', fontSize: '14px' }}>{title}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            background: '#f1f5f9', 
            padding: '8px 12px', 
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#7a0a2d',
            textTransform: 'capitalize'
          }}>
            {userRole}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#7a0a2d',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        {showSidebar && (
          <aside style={{
            width: '280px',
            background: '#fff',
            borderRight: '1px solid #e2e8f0',
            padding: '24px 0',
            overflowY: 'auto'
          }}>
            <nav>
              {sidebarItems[userRole]?.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    color: location.pathname === item.path ? '#7a0a2d' : '#64748b',
                    background: location.pathname === item.path ? '#fef2f2' : 'transparent',
                    borderRight: location.pathname === item.path ? '3px solid #7a0a2d' : 'none',
                    fontSize: '14px',
                    fontWeight: location.pathname === item.path ? '600' : '500',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SharedLayout;