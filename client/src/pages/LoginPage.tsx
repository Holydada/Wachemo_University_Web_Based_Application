import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    wcuId: '',
    password: '',
  });
  
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      
      // Always redirect to /dashboard - the DashboardPage will handle role-based rendering
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="container">
          <Link className="brand" to="/" aria-label="Wachemo University">
            <img 
              src="/logo2.png" 
              alt="Wachemo University Logo" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }} 
            />
            <span className="name">Wachemo University</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header-section">
              <div className="university-logo">
                <img 
                  src="/logo2.png" 
                  alt="Wachemo University Logo" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }} 
                />
              </div>
              <h1>Wachemo University</h1>
              <p>Digital Campus Portal</p>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="wcuId">WCU ID</label>
                <input
                  type="text"
                  id="wcuId"
                  name="wcuId"
                  value={formData.wcuId}
                  onChange={handleChange}
                  placeholder="Enter your WCU ID (e.g., WCU/2024/001234)"
                  required
                  disabled={isLoading}
                  className="form-control"
                />
                <small className="form-text">Format: WCU/YEAR/XXXXXX</small>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              {error && (
                <div className="alert alert-error" role="alert">
                  {error}
                </div>
              )}

              <div className="forgot-password">
                <Link to="/forgot-password">
                  Forgot your password?
                </Link>
              </div>
            </form>

            <div className="login-footer">
              <p>
                Need help? Contact{' '}
                <a href="mailto:support@wcu.edu.et">support@wcu.edu.et</a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <div className="notice-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <h6>Secure Access</h6>
                <p>Your credentials are encrypted and protected. Never share your password with anyone.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;