import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return '🎓';
      case 'faculty': return '👨‍🏫';
      case 'admin': return '⚙️';
      case 'registrar': return '📋';
      default: return '👤';
    }
  };

  return (
    <header className={`dashboard-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="topbar container">
        <div className="mast-left">
          <Link className="brand" to="/" aria-label="Wachemo University">
            <img src="/logo2.png" alt="Wachemo University Logo" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
            <div className="brand-text">
              <span className="name">Wachemo University</span>
              <span className="subtitle">Digital Campus</span>
            </div>
          </Link>
          
          <nav className="primary-nav" aria-label="Primary">
            <Link to="/" className="nav-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V11h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Dashboard
                </Link>
                
                {user?.role === 'student' && (
                  <>
                    <Link to="/courses" className="nav-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Courses
                    </Link>
                    <Link to="/exams" className="nav-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Exams
                    </Link>
                    <Link to="/grades" className="nav-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/>
                        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Grades
                    </Link>
                  </>
                )}
                
                {(user?.role === 'faculty' || user?.role === 'department_head') && (
                  <>
                    <Link to="/faculty/courses" className="nav-link">Courses</Link>
                    <Link to="/faculty/exams" className="nav-link">Exams</Link>
                    <Link to="/faculty/grades" className="nav-link">Grades</Link>
                  </>
                )}
                
                {(user?.role === 'admin' || user?.role === 'registrar') && (
                  <div className="has-dd">
                    <button className="dd" aria-haspopup="true" aria-expanded="false">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Admin
                    </button>
                    <div className="dropdown menu" role="menu">
                      <Link to="/admin/users" role="menuitem">User Management</Link>
                      <Link to="/admin/reports" role="menuitem">Reports</Link>
                      <Link to="/admin/settings" role="menuitem">Settings</Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
        
        <div className="mast-tools">
          {isAuthenticated ? (
            <div className="has-dd user-menu">
              <button className="user-btn" aria-haspopup="true" aria-expanded="false">
                <div className="user-avatar">
                  {getRoleIcon(user?.role || '')}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.profile?.full_name || user?.wcu_id}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="dropdown menu" role="menu">
                <Link to="/profile" role="menuitem">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Profile
                </Link>
                <Link to="/notifications" role="menuitem">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Notifications
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} role="menuitem" className="logout-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link className="btn primary" to="/login">
              Sign In
            </Link>
          )}
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                {user?.role === 'student' && (
                  <>
                    <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
                    <Link to="/exams" onClick={() => setMobileMenuOpen(false)}>Exams</Link>
                    <Link to="/grades" onClick={() => setMobileMenuOpen(false)}>Grades</Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;