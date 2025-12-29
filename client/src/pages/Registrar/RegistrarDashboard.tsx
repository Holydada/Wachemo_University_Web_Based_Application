import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { FaClipboardCheck, FaUserGraduate, FaIdCard, FaChartBar, FaExclamationTriangle, FaBell } from 'react-icons/fa';
import SharedLayout from '../../components/Layout/SharedLayout';

const RegistrarDashboard: React.FC = () => {
  const [pendingApprovals] = useState([
    { id: 1, type: 'Grade Submission', student: 'Abebe Kebede', course: 'CS301', instructor: 'Dr. Alemayehu', date: '2024-01-15' },
    { id: 2, type: 'Clearance Request', student: 'Almaz Tadesse', department: 'Computer Science', date: '2024-01-14' },
    { id: 3, type: 'Registration', student: 'Bekele Worku', program: 'Software Engineering', date: '2024-01-13' }
  ]);

  const [recentActivities] = useState([
    { id: 1, activity: 'Grade approved for CS301', time: '2 hours ago', status: 'approved' },
    { id: 2, activity: 'Student clearance processed', time: '4 hours ago', status: 'completed' },
    { id: 3, activity: 'New student registration', time: '6 hours ago', status: 'pending' },
    { id: 4, activity: 'ID card printed', time: '1 day ago', status: 'completed' }
  ]);

  const [alerts] = useState([
    { id: 1, message: 'Grade submission deadline approaching (3 days remaining)', type: 'warning' },
    { id: 2, message: '25 clearance requests pending approval', type: 'info' },
    { id: 3, message: 'Registration period ends in 1 week', type: 'danger' }
  ]);

  const stats = {
    totalStudents: 12450,
    pendingRegistrations: 156,
    pendingClearances: 89,
    pendingGrades: 234,
    idCardsPrinted: 1205,
    completedClearances: 2341
  };

  const semesterProgress = {
    registrations: 85,
    gradeSubmissions: 72,
    clearanceProcessing: 91
  };

  return (
    <SharedLayout title="Registrar Dashboard" userRole="registrar">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaClipboardCheck className="me-2" />
                Registrar Dashboard
              </h2>
              <div>
                <Badge bg="success" className="me-2">Spring 2024</Badge>
                <Badge bg="warning">Registration Open</Badge>
              </div>
            </div>

            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-primary border-4">
                  <Card.Body>
                    <FaUserGraduate size={32} className="text-primary mb-2" />
                    <h4 className="text-primary">{stats.totalStudents.toLocaleString()}</h4>
                    <p className="text-muted small mb-0">Total Students</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-warning border-4">
                  <Card.Body>
                    <FaClipboardCheck size={32} className="text-warning mb-2" />
                    <h4 className="text-warning">{stats.pendingRegistrations}</h4>
                    <p className="text-muted small mb-0">Pending Registrations</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-info border-4">
                  <Card.Body>
                    <FaExclamationTriangle size={32} className="text-info mb-2" />
                    <h4 className="text-info">{stats.pendingClearances}</h4>
                    <p className="text-muted small mb-0">Pending Clearances</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-success border-4">
                  <Card.Body>
                    <FaChartBar size={32} className="text-success mb-2" />
                    <h4 className="text-success">{stats.pendingGrades}</h4>
                    <p className="text-muted small mb-0">Pending Grades</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-secondary border-4">
                  <Card.Body>
                    <FaIdCard size={32} className="text-secondary mb-2" />
                    <h4 className="text-secondary">{stats.idCardsPrinted}</h4>
                    <p className="text-muted small mb-0">ID Cards Printed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={2} md={4} sm={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-success border-4">
                  <Card.Body>
                    <FaClipboardCheck size={32} className="text-success mb-2" />
                    <h4 className="text-success">{stats.completedClearances}</h4>
                    <p className="text-muted small mb-0">Completed Clearances</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              {/* Pending Approvals */}
              <Col lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-warning text-dark">
                    <h5 className="mb-0">
                      <FaExclamationTriangle className="me-2" />
                      Pending Approvals ({pendingApprovals.length})
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Student/Details</th>
                          <th>Course/Department</th>
                          <th>Instructor/Info</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map(approval => (
                          <tr key={approval.id}>
                            <td>
                              <Badge bg={approval.type === 'Grade Submission' ? 'success' : 
                                         approval.type === 'Clearance Request' ? 'info' : 'primary'}>
                                {approval.type}
                              </Badge>
                            </td>
                            <td><strong>{approval.student}</strong></td>
                            <td>{approval.course || approval.department || approval.program}</td>
                            <td>{approval.instructor || '-'}</td>
                            <td className="text-muted">{approval.date}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button variant="outline-success" size="sm">
                                  Approve
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                  Reject
                                </Button>
                                <Button variant="outline-primary" size="sm">
                                  Review
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>

                {/* Recent Activities */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Recent Activities</h5>
                  </Card.Header>
                  <Card.Body>
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded">
                        <div>
                          <span>{activity.activity}</span>
                          <small className="text-muted d-block">{activity.time}</small>
                        </div>
                        <Badge bg={activity.status === 'approved' || activity.status === 'completed' ? 'success' : 'warning'}>
                          {activity.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              {/* Sidebar */}
              <Col lg={4}>
                {/* Semester Progress */}
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">Semester Progress</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Student Registrations</small>
                        <small>{semesterProgress.registrations}%</small>
                      </div>
                      <ProgressBar now={semesterProgress.registrations} variant="success" />
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Grade Submissions</small>
                        <small>{semesterProgress.gradeSubmissions}%</small>
                      </div>
                      <ProgressBar now={semesterProgress.gradeSubmissions} variant="warning" />
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Clearance Processing</small>
                        <small>{semesterProgress.clearanceProcessing}%</small>
                      </div>
                      <ProgressBar now={semesterProgress.clearanceProcessing} variant="info" />
                    </div>
                  </Card.Body>
                </Card>

                {/* System Alerts */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-danger text-white">
                    <h6 className="mb-0">
                      <FaBell className="me-2" />
                      System Alerts
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {alerts.map(alert => (
                      <Alert 
                        key={alert.id} 
                        variant={alert.type === 'danger' ? 'danger' : 
                                alert.type === 'warning' ? 'warning' : 'info'}
                        className="small py-2"
                      >
                        {alert.message}
                      </Alert>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mt-4">
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-secondary text-white">
                    <h5 className="mb-0">Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-primary" className="w-100">
                          <FaUserGraduate className="me-2" />
                          Student Registration
                        </Button>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-success" className="w-100">
                          <FaChartBar className="me-2" />
                          Grade Approval
                        </Button>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-info" className="w-100">
                          <FaClipboardCheck className="me-2" />
                          Clearance Review
                        </Button>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-warning" className="w-100">
                          <FaIdCard className="me-2" />
                          Print ID Cards
                        </Button>
                      </Col>
                    </Row>
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

export default RegistrarDashboard;