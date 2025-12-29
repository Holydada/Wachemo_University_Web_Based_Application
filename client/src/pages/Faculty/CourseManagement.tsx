import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaBook, FaUsers, FaPlus, FaEdit, FaEye, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import SharedLayout from '../../components/Layout/SharedLayout';

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester: string;
  year: string;
  enrolledStudents: number;
  maxCapacity: number;
  schedule: string;
  room: string;
  status: 'active' | 'completed' | 'upcoming';
}

interface Student {
  id: number;
  wcuId: string;
  fullName: string;
  email: string;
  enrollmentDate: string;
  status: 'enrolled' | 'dropped' | 'completed';
  currentGrade?: number;
}

const CourseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'materials'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [courses] = useState<Course[]>([
    {
      id: 1,
      code: 'CS301',
      name: 'Data Structures and Algorithms',
      credits: 3,
      semester: 'Spring',
      year: '2024',
      enrolledStudents: 45,
      maxCapacity: 50,
      schedule: 'MWF 10:00-11:00 AM',
      room: 'Room 201',
      status: 'active'
    },
    {
      id: 2,
      code: 'CS401',
      name: 'Database Management Systems',
      credits: 4,
      semester: 'Spring',
      year: '2024',
      enrolledStudents: 38,
      maxCapacity: 40,
      schedule: 'TTh 2:00-4:00 PM',
      room: 'Room 305',
      status: 'active'
    },
    {
      id: 3,
      code: 'CS501',
      name: 'Software Engineering',
      credits: 3,
      semester: 'Fall',
      year: '2023',
      enrolledStudents: 52,
      maxCapacity: 55,
      schedule: 'MWF 4:00-5:00 PM',
      room: 'Room 102',
      status: 'completed'
    }
  ]);

  const [students] = useState<Student[]>([
    {
      id: 1,
      wcuId: 'WCU/2024/001234',
      fullName: 'Abebe Kebede',
      email: 'abebe.kebede@student.wcu.edu.et',
      enrollmentDate: '2024-01-15',
      status: 'enrolled',
      currentGrade: 85
    },
    {
      id: 2,
      wcuId: 'WCU/2024/001235',
      fullName: 'Almaz Tadesse',
      email: 'almaz.tadesse@student.wcu.edu.et',
      enrollmentDate: '2024-01-15',
      status: 'enrolled',
      currentGrade: 92
    },
    {
      id: 3,
      wcuId: 'WCU/2024/001236',
      fullName: 'Bekele Worku',
      email: 'bekele.worku@student.wcu.edu.et',
      enrollmentDate: '2024-01-15',
      status: 'dropped'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      active: 'success',
      completed: 'info',
      upcoming: 'primary',
      enrolled: 'success',
      dropped: 'danger'
    };
    return <Badge bg={statusColors[status]}>{status.toUpperCase()}</Badge>;
  };

  const getEnrollmentPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100);
  };

  const viewCourseStudents = (course: Course) => {
    setSelectedCourse(course);
    setShowStudentModal(true);
  };

  return (
    <SharedLayout title="Course Management" userRole="teacher">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaBook className="me-2" />
                Course Management
              </h2>
              <Button variant="primary" onClick={() => setShowCourseModal(true)}>
                <FaPlus className="me-1" />
                Add Course Material
              </Button>
            </div>

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as any)}
              className="mb-4"
            >
              <Tab eventKey="courses" title="My Courses">
                <Row>
                  {courses.map(course => (
                    <Col lg={4} md={6} key={course.id} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">{course.code}</h6>
                            <small className="text-muted">{course.credits} Credits</small>
                          </div>
                          {getStatusBadge(course.status)}
                        </Card.Header>
                        <Card.Body>
                          <h6 className="card-title">{course.name}</h6>
                          <div className="mb-3">
                            <small className="text-muted d-block">
                              <FaCalendarAlt className="me-1" />
                              {course.schedule}
                            </small>
                            <small className="text-muted d-block">
                              📍 {course.room}
                            </small>
                            <small className="text-muted d-block">
                              📅 {course.semester} {course.year}
                            </small>
                          </div>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <small>Enrollment</small>
                              <small>{course.enrolledStudents}/{course.maxCapacity}</small>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ 
                                  width: `${getEnrollmentPercentage(course.enrolledStudents, course.maxCapacity)}%`,
                                  backgroundColor: getEnrollmentPercentage(course.enrolledStudents, course.maxCapacity) > 90 ? '#dc3545' : '#28a745'
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="d-grid gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => viewCourseStudents(course)}
                            >
                              <FaUsers className="me-1" />
                              View Students ({course.enrolledStudents})
                            </Button>
                            <div className="d-flex gap-1">
                              <Button variant="outline-success" size="sm" className="flex-fill">
                                <FaClipboardList className="me-1" />
                                Grades
                              </Button>
                              <Button variant="outline-info" size="sm" className="flex-fill">
                                <FaEdit className="me-1" />
                                Materials
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab>

              <Tab eventKey="students" title="All Students">
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Students Across All Courses</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>WCU ID</th>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Enrollment Date</th>
                          <th>Status</th>
                          <th>Current Grade</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id}>
                            <td><code>{student.wcuId}</code></td>
                            <td><strong>{student.fullName}</strong></td>
                            <td>{student.email}</td>
                            <td>{student.enrollmentDate}</td>
                            <td>{getStatusBadge(student.status)}</td>
                            <td>
                              {student.currentGrade ? (
                                <span className={`fw-bold ${student.currentGrade >= 80 ? 'text-success' : student.currentGrade >= 60 ? 'text-warning' : 'text-danger'}`}>
                                  {student.currentGrade}%
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1">
                                <FaEye />
                              </Button>
                              <Button variant="outline-success" size="sm">
                                Grade
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="materials" title="Course Materials">
                <Alert variant="info">
                  <h5>Course Materials Management</h5>
                  <p>Upload and manage course materials, assignments, and resources for your students.</p>
                  <Button variant="primary">
                    <FaPlus className="me-1" />
                    Upload New Material
                  </Button>
                </Alert>

                <Row>
                  <Col md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h6>📄 Lecture Notes</h6>
                        <p className="text-muted small">Data Structures - Week 1</p>
                        <Button variant="outline-primary" size="sm">Download</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h6>📊 Assignment 1</h6>
                        <p className="text-muted small">Binary Trees Implementation</p>
                        <Button variant="outline-success" size="sm">View Submissions</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Card>
                      <Card.Body>
                        <h6>🎥 Video Lecture</h6>
                        <p className="text-muted small">Sorting Algorithms</p>
                        <Button variant="outline-info" size="sm">Watch</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Course Students Modal */}
        <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              Students in {selectedCourse?.name} ({selectedCourse?.code})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCourse && (
              <div>
                <div className="mb-3">
                  <Badge bg="info" className="me-2">
                    {selectedCourse.enrolledStudents} Enrolled
                  </Badge>
                  <Badge bg="secondary">
                    {selectedCourse.maxCapacity - selectedCourse.enrolledStudents} Available
                  </Badge>
                </div>
                
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>WCU ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter(s => s.status === 'enrolled').map(student => (
                      <tr key={student.id}>
                        <td><code>{student.wcuId}</code></td>
                        <td>{student.fullName}</td>
                        <td>{student.email}</td>
                        <td>{getStatusBadge(student.status)}</td>
                        <td>
                          {student.currentGrade ? `${student.currentGrade}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowStudentModal(false)}>
              Close
            </Button>
            <Button variant="primary">
              Export Student List
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </SharedLayout>
  );
};

export default CourseManagement;