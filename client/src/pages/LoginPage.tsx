import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    wcuId: '',
    password: '',
  });
  
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

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
      navigate(from, { replace: true });
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
            <img src="/logo2.png" alt="Wachemo University Logo" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
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
                <img src="/logo2.png" alt="Wachemo University Logo" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />
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

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <h6>Demo Credentials</h6>
            <div className="credentials-grid">
              <div>
                <span className="label">Student:</span>
                <span className="value">WCU/2024/001234</span>
              </div>
              <div>
                <span className="label">Faculty:</span>
                <span className="value">WCU/FAC/001</span>
              </div>
            </div>
            <p className="password-note">Password: demo123</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;