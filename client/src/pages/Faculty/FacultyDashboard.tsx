import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaChartLine, FaCalendarAlt, FaBell } from 'react-icons/fa';
import SharedLayout from '../../components/Layout/SharedLayout';

const FacultyDashboard: React.FC = () => {
  const [upcomingClasses] = useState([
    { id: 1, course: 'Data Structures', time: '10:00 AM', room: 'Room 201', students: 45 },
    { id: 2, course: 'Database Systems', time: '2:00 PM', room: 'Room 305', students: 38 },
    { id: 3, course: 'Software Engineering', time: '4:00 PM', room: 'Room 102', students: 52 }
  ]);

  const [recentGrades] = useState([
    { id: 1, student: 'Abebe Kebede', course: 'Data Structures', assignment: 'Midterm Exam', grade: 85, status: 'graded' },
    { id: 2, student: 'Almaz Tadesse', course: 'Database Systems', assignment: 'Project 1', grade: 92, status: 'graded' },
    { id: 3, student: 'Bekele Worku', course: 'Software Engineering', assignment: 'Quiz 2', grade: 78, status: 'pending' }
  ]);

  const [notifications] = useState([
    { id: 1, message: 'Grade submission deadline: January 20, 2024', type: 'warning' },
    { id: 2, message: 'Faculty meeting scheduled for tomorrow at 3 PM', type: 'info' },
    { id: 3, message: 'New course evaluation forms available', type: 'success' }
  ]);

  const stats = {
    totalCourses: 4,
    totalStudents: 156,
    pendingGrades: 23,
    upcomingExams: 2,
    completionRate: 78
  };

  return (
    <SharedLayout title="Faculty Dashboard" userRole="teacher">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaChalkboardTeacher className="me-2" />
                Faculty Dashboard
              </h2>
              <div>
                <Badge bg="success" className="me-2">Active Semester</Badge>
                <Badge bg="info">Spring 2024</Badge>
              </div>
            </div>

            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-primary border-4">
                  <Card.Body>
                    <FaClipboardList size={32} className="text-primary mb-2" />
                    <h4 className="text-primary">{stats.totalCourses}</h4>
                    <p className="text-muted small mb-0">Courses Teaching</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-success border-4">
                  <Card.Body>
                    <FaUsers size={32} className="text-success mb-2" />
                    <h4 className="text-success">{stats.totalStudents}</h4>
                    <p className="text-muted small mb-0">Total Students</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-warning border-4">
                  <Card.Body>
                    <FaChartLine size={32} className="text-warning mb-2" />
                    <h4 className="text-warning">{stats.pendingGrades}</h4>
                    <p className="text-muted small mb-0">Pending Grades</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-3">
                <Card className="text-center h-100 shadow-sm border-start border-info border-4">
                  <Card.Body>
                    <FaCalendarAlt size={32} className="text-info mb-2" />
                    <h4 className="text-info">{stats.upcomingExams}</h4>
                    <p className="text-muted small mb-0">Upcoming Exams</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              {/* Today's Schedule */}
              <Col lg={8}>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <FaCalendarAlt className="me-2" />
                      Today's Schedule
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {upcomingClasses.map(classItem => (
                      <div key={classItem.id} className="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded">
                        <div>
                          <h6 className="mb-1">{classItem.course}</h6>
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            {classItem.time} • {classItem.room}
                          </small>
                        </div>
                        <div className="text-end">
                          <Badge bg="info">{classItem.students} students</Badge>
                          <div className="mt-1">
                            <Button variant="outline-primary" size="sm" className="me-1">
                              Start Class
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>

                {/* Recent Grading Activity */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">Recent Grading Activity</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Course</th>
                          <th>Assignment</th>
                          <th>Grade</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentGrades.map(grade => (
                          <tr key={grade.id}>
                            <td><strong>{grade.student}</strong></td>
                            <td>{grade.course}</td>
                            <td>{grade.assignment}</td>
                            <td>
                              <span className={`fw-bold ${grade.grade >= 80 ? 'text-success' : grade.grade >= 60 ? 'text-warning' : 'text-danger'}`}>
                                {grade.grade}%
                              </span>
                            </td>
                            <td>
                              <Badge bg={grade.status === 'graded' ? 'success' : 'warning'}>
                                {grade.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                {grade.status === 'graded' ? 'Edit' : 'Grade'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              {/* Sidebar */}
              <Col lg={4}>
                {/* Course Completion Progress */}
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">Semester Progress</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Overall Completion</small>
                        <small>{stats.completionRate}%</small>
                      </div>
                      <ProgressBar now={stats.completionRate} variant="info" />
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Grades Submitted</small>
                        <small>85%</small>
                      </div>
                      <ProgressBar now={85} variant="success" />
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Exams Conducted</small>
                        <small>60%</small>
                      </div>
                      <ProgressBar now={60} variant="warning" />
                    </div>
                  </Card.Body>
                </Card>

                {/* Notifications */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">
                      <FaBell className="me-2" />
                      Notifications
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {notifications.map(notification => (
                      <Alert 
                        key={notification.id} 
                        variant={notification.type === 'info' ? 'primary' : 
                                notification.type === 'warning' ? 'warning' : 'success'}
                        className="small py-2"
                      >
                        {notification.message}
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
                          <FaClipboardList className="me-2" />
                          Create Exam
                        </Button>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-success" className="w-100">
                          <FaChartLine className="me-2" />
                          Enter Grades
                        </Button>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-info" className="w-100">
                          <FaUsers className="me-2" />
                          View Students
                        </Button>
                      </Col>
                      <Col md={3} className="mb-2">
                        <Button variant="outline-warning" className="w-100">
                          <FaCalendarAlt className="me-2" />
                          Schedule Class
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

export default FacultyDashboard;