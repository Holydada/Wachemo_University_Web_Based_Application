import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { FaUsers, FaChartBar, FaCog, FaBell, FaFileAlt, FaUniversity } from 'react-icons/fa';
import SharedLayout from '../../components/Layout/SharedLayout';

const AdminDashboard: React.FC = () => {
  const [notifications] = useState([
    { id: 1, message: 'New partnership application from Ethiopian Airlines', type: 'info', time: '2 hours ago' },
    { id: 2, message: '15 students pending clearance approval', type: 'warning', time: '4 hours ago' },
    { id: 3, message: 'System backup completed successfully', type: 'success', time: '1 day ago' }
  ]);

  const stats = {
    totalStudents: 12450,
    totalFaculty: 890,
    activeExams: 23,
    pendingClearances: 156,
    newsArticles: 45,
    partnerships: 12
  };

  const recentActivities = [
    { id: 1, activity: 'New student registered', user: 'Abebe Kebede', time: '10 minutes ago' },
    { id: 2, activity: 'Grade submitted', user: 'Dr. Alemayehu Tadesse', time: '25 minutes ago' },
    { id: 3, activity: 'News article published', user: 'Admin User', time: '1 hour ago' },
    { id: 4, activity: 'Partnership approved', user: 'Admin User', time: '2 hours ago' }
  ];

  return (
    <SharedLayout title="Admin Dashboard" userRole="admin">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaCog className="me-2" />
                Admin Dashboard
              </h2>
              <div>
                <Badge bg="success" className="me-2">System Online</Badge>
                <Badge bg="info">Admin Panel</Badge>
              </div>
            </div>

            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <FaUsers size={32} className="text-primary mb-2" />
                    <h4 className="text-primary">{stats.totalStudents.toLocaleString()}</h4>
                    <p className="text-muted small mb-0">Total Students</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <FaUniversity size={32} className="text-success mb-2" />
                    <h4 className="text-success">{stats.totalFaculty}</h4>
                    <p className="text-muted small mb-0">Faculty Members</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <FaFileAlt size={32} className="text-warning mb-2" />
                    <h4 className="text-warning">{stats.activeExams}</h4>
                    <p className="text-muted small mb-0">Active Exams</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <FaChartBar size={32} className="text-info mb-2" />
                    <h4 className="text-info">{stats.pendingClearances}</h4>
                    <p className="text-muted small mb-0">Pending Clearances</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <FaBell size={32} className="text-danger mb-2" />
                    <h4 className="text-danger">{stats.newsArticles}</h4>
                    <p className="text-muted small mb-0">News Articles</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm">
                  <Card.Body>
                    <FaUsers size={32} className="text-secondary mb-2" />
                    <h4 className="text-secondary">{stats.partnerships}</h4>
                    <p className="text-muted small mb-0">Partnerships</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              {/* Recent Activities */}
              <Col lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Recent System Activities</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Activity</th>
                          <th>User</th>
                          <th>Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivities.map(activity => (
                          <tr key={activity.id}>
                            <td>{activity.activity}</td>
                            <td><strong>{activity.user}</strong></td>
                            <td className="text-muted">{activity.time}</td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>

                {/* System Status */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">System Status</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Database Connection</span>
                            <Badge bg="success">Online</Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Authentication Service</span>
                            <Badge bg="success">Running</Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>File Storage</span>
                            <Badge bg="success">Available</Badge>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Email Service</span>
                            <Badge bg="warning">Maintenance</Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Backup System</span>
                            <Badge bg="success">Active</Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Payment Gateway</span>
                            <Badge bg="success">Connected</Badge>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Notifications */}
              <Col lg={4}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h5 className="mb-0">
                      <FaBell className="me-2" />
                      System Notifications
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {notifications.map(notification => (
                      <Alert 
                        key={notification.id} 
                        variant={notification.type === 'info' ? 'primary' : 
                                notification.type === 'warning' ? 'warning' : 'success'}
                        className="small"
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{notification.message}</strong>
                            <div className="text-muted small mt-1">{notification.time}</div>
                          </div>
                          <Button variant="outline-secondary" size="sm">
                            ×
                          </Button>
                        </div>
                      </Alert>
                    ))}
                    
                    <div className="text-center mt-3">
                      <Button variant="outline-primary" size="sm">
                        View All Notifications
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </SharedLayout>
  );
};

export default AdminDashboard;