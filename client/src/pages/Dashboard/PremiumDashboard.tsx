import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import '../../styles/premium-components.css';

const PremiumDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      if (user?.role === 'student') {
        const [profile, courses, grades] = await Promise.all([
          apiService.student.getProfile(),
          apiService.student.getCourses(),
          apiService.student.getGrades()
        ]);

        setStats({
          enrolledCourses: courses.count || 0,
          gpa: grades.gpa || '0.00',
          completedCredits: grades.data?.filter((g: any) => g.letter_grade !== 'F').length * 3 || 0,
          pendingAssignments: 5
        });
      } else if (user?.role === 'faculty') {
        const [profile, courses] = await Promise.all([
          apiService.faculty.getProfile(),
          apiService.faculty.getCourses()
        ]);

        setStats({
          totalCourses: courses.count || 0,
          totalStudents: courses.data?.reduce((sum: number, c: any) => sum + (c.enrolled_students || 0), 0) || 0,
          pendingGrades: 12,
          upcomingClasses: 3
        });
      } else if (user?.role === 'admin') {
        const adminStats = await apiService.admin.getStats();

        setStats({
          totalUsers: adminStats.data.totalUsers || 0,
          totalStudents: adminStats.data.totalStudents || 0,
          totalCourses: adminStats.data.totalCourses || 0,
          totalEnrollments: adminStats.data.totalEnrollments || 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-premium"></div>
        <div className="loading-text">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in" style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Welcome back, <span className="text-gradient">{user?.profile?.full_name || 'User'}</span>! 👋
        </h1>
        <p style={{ color: '#718096', fontSize: '16px' }}>
          Here's what's happening with your account today.
        </p>
      </div>

      {error && (
        <div className="alert-premium alert-premium-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid-premium grid-premium-4" style={{ marginBottom: '32px' }}>
        {user?.role === 'student' && (
          <>
            <div className="stats-card bounce-in">
              <div className="stats-card-icon">📚</div>
              <div className="stats-card-value">{stats?.enrolledCourses || 0}</div>
              <div className="stats-card-label">Enrolled Courses</div>
              <div className="stats-card-trend up">
                <span>↑</span> Active
              </div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                🎯
              </div>
              <div className="stats-card-value">{stats?.gpa || '0.00'}</div>
              <div className="stats-card-label">Current GPA</div>
              <div className="stats-card-trend up">
                <span>↑</span> Excellent
              </div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                ✅
              </div>
              <div className="stats-card-value">{stats?.completedCredits || 0}</div>
              <div className="stats-card-label">Completed Credits</div>
              <div className="stats-card-trend up">
                <span>↑</span> On Track
              </div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                📝
              </div>
              <div className="stats-card-value">{stats?.pendingAssignments || 0}</div>
              <div className="stats-card-label">Pending Tasks</div>
            </div>
          </>
        )}

        {user?.role === 'faculty' && (
          <>
            <div className="stats-card bounce-in">
              <div className="stats-card-icon">📖</div>
              <div className="stats-card-value">{stats?.totalCourses || 0}</div>
              <div className="stats-card-label">My Courses</div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                👥
              </div>
              <div className="stats-card-value">{stats?.totalStudents || 0}</div>
              <div className="stats-card-label">Total Students</div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                📊
              </div>
              <div className="stats-card-value">{stats?.pendingGrades || 0}</div>
              <div className="stats-card-label">Pending Grades</div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                🕐
              </div>
              <div className="stats-card-value">{stats?.upcomingClasses || 0}</div>
              <div className="stats-card-label">Today's Classes</div>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <div className="stats-card bounce-in">
              <div className="stats-card-icon">👥</div>
              <div className="stats-card-value">{stats?.totalUsers || 0}</div>
              <div className="stats-card-label">Total Users</div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                🎓
              </div>
              <div className="stats-card-value">{stats?.totalStudents || 0}</div>
              <div className="stats-card-label">Total Students</div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                📚
              </div>
              <div className="stats-card-value">{stats?.totalCourses || 0}</div>
              <div className="stats-card-label">Total Courses</div>
            </div>

            <div className="stats-card bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="stats-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                📝
              </div>
              <div className="stats-card-value">{stats?.totalEnrollments || 0}</div>
              <div className="stats-card-label">Total Enrollments</div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h2>
        <div className="grid-premium grid-premium-3">
          {user?.role === 'student' && (
            <>
              <div className="gradient-card gradient-card-info" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Browse Courses</h3>
                <p style={{ opacity: 0.9 }}>Explore and enroll in new courses</p>
              </div>
              <div className="gradient-card gradient-card-success" onClick={() => navigate('/grades')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>View Grades</h3>
                <p style={{ opacity: 0.9 }}>Check your academic performance</p>
              </div>
              <div className="gradient-card gradient-card-warning" onClick={() => navigate('/exams')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Take Exam</h3>
                <p style={{ opacity: 0.9 }}>Access your online examinations</p>
              </div>
            </>
          )}

          {user?.role === 'faculty' && (
            <>
              <div className="gradient-card gradient-card-info" onClick={() => navigate('/faculty/courses')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>My Courses</h3>
                <p style={{ opacity: 0.9 }}>Manage your courses</p>
              </div>
              <div className="gradient-card gradient-card-success" onClick={() => navigate('/faculty/grades')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Grade Entry</h3>
                <p style={{ opacity: 0.9 }}>Submit student grades</p>
              </div>
              <div className="gradient-card gradient-card-warning" onClick={() => navigate('/faculty/exams')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Create Exam</h3>
                <p style={{ opacity: 0.9 }}>Design new examinations</p>
              </div>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="gradient-card gradient-card-info" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>User Management</h3>
                <p style={{ opacity: 0.9 }}>Manage system users</p>
              </div>
              <div className="gradient-card gradient-card-success" onClick={() => navigate('/admin/courses')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Course Management</h3>
                <p style={{ opacity: 0.9 }}>Manage courses and departments</p>
              </div>
              <div className="gradient-card gradient-card-warning" onClick={() => navigate('/admin/reports')} style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Reports</h3>
                <p style={{ opacity: 0.9 }}>View system analytics</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
