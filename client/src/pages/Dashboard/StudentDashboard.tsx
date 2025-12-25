import React from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock student data
  const studentStats = {
    currentGPA: 3.45,
    totalCredits: 78,
    completedCourses: 26,
    currentSemester: 'Semester 2, 2024/25',
    upcomingExams: 3,
    pendingAssignments: 5,
    registrationStatus: 'Completed'
  };

  const recentGrades = [
    { course: 'Advanced Programming', code: 'CS301', grade: 'A-', credits: 4 },
    { course: 'Database Systems', code: 'CS302', grade: 'B+', credits: 3 },
    { course: 'Software Engineering', code: 'CS303', grade: 'A', credits: 4 },
  ];

  const upcomingExams = [
    { course: 'Data Structures', date: '2024-12-25', time: '09:00 AM', type: 'Final' },
    { course: 'Computer Networks', date: '2024-12-27', time: '02:00 PM', type: 'Midterm' },
    { course: 'Operating Systems', date: '2024-12-30', time: '10:00 AM', type: 'Final' },
  ];

  const quickActions = [
    { title: 'Course Registration', icon: '📚', link: '/courses', color: 'primary' },
    { title: 'Take Exam', icon: '📝', link: '/exams', color: 'success' },
    { title: 'View Grades', icon: '📊', link: '/grades', color: 'info' },
    { title: 'ID Card Request', icon: '🆔', link: '/id-card', color: 'warning' },
    { title: 'Clearance Request', icon: '📋', link: '/clearance', color: 'secondary' },
    { title: 'Cafeteria Menu', icon: '🍽️', link: '/cafeteria', color: 'danger' },
  ];

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1" style={{ color: '#7a0a2d' }}>
                Welcome back, {user?.profile?.full_name}! 👋
              </h2>
              <p className="text-muted mb-0">
                {user?.wcu_id} • {studentStats.currentSemester}
              </p>
            </div>
            <Badge 
              bg="success" 
              className="px-3 py-2"
              style={{ fontSize: '0.9rem' }}
            >
              ✅ Registration: {studentStats.registrationStatus}
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Academic Overview Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div style={{ fontSize: '2.5rem', color: '#7a0a2d' }}>📊</div>
              <h4 className="mt-2 mb-1" style={{ color: '#7a0a2d' }}>
                {studentStats.currentGPA}
              </h4>
              <p className="text-muted mb-0">Current GPA</p>
              <ProgressBar 
                now={(studentStats.currentGPA / 4) * 100} 
                className="mt-2"
                style={{ height: '6px' }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div style={{ fontSize: '2.5rem', color: '#28a745' }}>🎓</div>
              <h4 className="mt-2 mb-1" style={{ color: '#28a745' }}>
                {studentStats.totalCredits}
              </h4>
              <p className="text-muted mb-0">Total Credits</p>
              <small className="text-success">
                {studentStats.completedCourses} courses completed
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div style={{ fontSize: '2.5rem', color: '#dc3545' }}>📝</div>
              <h4 className="mt-2 mb-1" style={{ color: '#dc3545' }}>
                {studentStats.upcomingExams}
              </h4>
              <p className="text-muted mb-0">Upcoming Exams</p>
              <small className="text-danger">Next: Dec 25</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div style={{ fontSize: '2.5rem', color: '#ffc107' }}>📋</div>
              <h4 className="mt-2 mb-1" style={{ color: '#ffc107' }}>
                {studentStats.pendingAssignments}
              </h4>
              <p className="text-muted mb-0">Assignments</p>
              <small className="text-warning">Due this week</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header 
              className="border-0"
              style={{ background: 'linear-gradient(135deg, #7a0a2d, #c42e53)', color: 'white' }}
            >
              <h5 className="mb-0">⚡ Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {quickActions.map((action, index) => (
                  <Col xs={6} className="mb-3" key={index}>
                    <Link to={action.link} className="text-decoration-none">
                      <Card className="border-0 bg-light h-100 text-center p-2 hover-shadow">
                        <Card.Body className="p-2">
                          <div style={{ fontSize: '1.8rem' }}>{action.icon}</div>
                          <small className="text-dark fw-medium">{action.title}</small>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Grades */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-success text-white border-0">
              <h5 className="mb-0">📊 Recent Grades</h5>
            </Card.Header>
            <Card.Body>
              {recentGrades.map((grade, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <div className="fw-medium">{grade.course}</div>
                    <small className="text-muted">{grade.code} • {grade.credits} Credits</small>
                  </div>
                  <Badge 
                    bg={grade.grade.startsWith('A') ? 'success' : grade.grade.startsWith('B') ? 'primary' : 'warning'}
                    className="px-2 py-1"
                  >
                    {grade.grade}
                  </Badge>
                </div>
              ))}
              <Link to="/grades" className="btn btn-outline-success btn-sm w-100 mt-2">
                View All Grades
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Exams */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-danger text-white border-0">
              <h5 className="mb-0">📝 Upcoming Exams</h5>
            </Card.Header>
            <Card.Body>
              {upcomingExams.map((exam, index) => (
                <div key={index} className="mb-3 p-2 bg-light rounded">
                  <div className="fw-medium text-danger">{exam.course}</div>
                  <small className="text-muted d-block">
                    📅 {exam.date} at {exam.time}
                  </small>
                  <Badge bg="outline-danger" className="mt-1">
                    {exam.type}
                  </Badge>
                </div>
              ))}
              <Link to="/exams" className="btn btn-outline-danger btn-sm w-100 mt-2">
                View All Exams
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Announcements */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-info text-white border-0">
              <h5 className="mb-0">📢 Recent Announcements</h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-3">
                <Alert.Heading className="h6">📚 New Semester Registration Opens</Alert.Heading>
                Registration for Semester 1, 2025/26 will begin on January 15, 2025. 
                Make sure to complete your course selection early.
              </Alert>
              
              <Alert variant="warning" className="mb-3">
                <Alert.Heading className="h6">🎓 Graduation Application Deadline</Alert.Heading>
                Final year students must submit graduation applications by February 1, 2025.
              </Alert>
              
              <Alert variant="success" className="mb-0">
                <Alert.Heading className="h6">🆔 New Digital ID Cards Available</Alert.Heading>
                Enhanced digital ID cards with QR codes are now available. Request yours today!
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;