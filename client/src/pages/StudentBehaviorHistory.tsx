import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Alert, Form, Button, Modal } from 'react-bootstrap';
import { FaUser, FaHistory, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import SharedLayout from '../components/Layout/SharedLayout';

interface BehaviorRecord {
  id: string;
  date: string;
  type: 'good' | 'warning' | 'violation';
  category: string;
  description: string;
  reportedBy: string;
  status: 'white' | 'yellow' | 'red';
  points: number;
}

const StudentBehaviorHistory: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [newRecord, setNewRecord] = useState({
    type: 'good' as 'good' | 'warning' | 'violation',
    category: '',
    description: '',
    points: 0
  });

  // Mock behavior records
  const behaviorRecords: BehaviorRecord[] = [
    {
      id: 'BH001',
      date: '2024-01-15',
      type: 'good',
      category: 'Academic Excellence',
      description: 'Outstanding performance in semester exams',
      reportedBy: 'Dr. Alemayehu Tadesse',
      status: 'white',
      points: 10
    },
    {
      id: 'BH002',
      date: '2024-01-10',
      type: 'warning',
      category: 'Attendance',
      description: 'Multiple absences without proper justification',
      reportedBy: 'Prof. Meron Getachew',
      status: 'yellow',
      points: -5
    },
    {
      id: 'BH003',
      date: '2024-01-05',
      type: 'good',
      category: 'Community Service',
      description: 'Volunteered in university cleanup campaign',
      reportedBy: 'Student Affairs Office',
      status: 'white',
      points: 5
    }
  ];

  const calculateTotalPoints = () => {
    return behaviorRecords.reduce((total, record) => total + record.points, 0);
  };

  const getBehaviorStatus = () => {
    const totalPoints = calculateTotalPoints();
    if (totalPoints >= 20) return { status: 'white', label: 'Excellent', color: 'success' };
    if (totalPoints >= 0) return { status: 'white', label: 'Good Standing', color: 'primary' };
    if (totalPoints >= -10) return { status: 'yellow', label: 'Warning', color: 'warning' };
    return { status: 'red', label: 'Critical', color: 'danger' };
  };

  const handleAddRecord = () => {
    // In real implementation, this would save to backend
    console.log('Adding new behavior record:', newRecord);
    setShowAddModal(false);
    setNewRecord({
      type: 'good',
      category: '',
      description: '',
      points: 0
    });
  };

  const behaviorStatus = getBehaviorStatus();

  return (
    <SharedLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaUser className="me-2" />
                Student Behavior History
              </h2>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus className="me-1" />
                Add Record
              </Button>
            </div>

            <Row className="mb-4">
              <Col lg={4}>
                <Card className="shadow-sm">
                  <Card.Header className={`bg-${behaviorStatus.color} text-white`}>
                    <h6 className="mb-0">Current Status</h6>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      {behaviorStatus.status === 'white' && <FaCheckCircle size={48} className="text-success" />}
                      {behaviorStatus.status === 'yellow' && <FaExclamationTriangle size={48} className="text-warning" />}
                      {behaviorStatus.status === 'red' && <FaTimesCircle size={48} className="text-danger" />}
                    </div>
                    <h4 className={`text-${behaviorStatus.color}`}>{behaviorStatus.label}</h4>
                    <p className="text-muted">Total Points: <strong>{calculateTotalPoints()}</strong></p>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={8}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">Behavior Point System</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <div className="text-center">
                          <Badge bg="success" className="mb-2 p-2">
                            <FaCheckCircle className="me-1" />
                            White List
                          </Badge>
                          <p className="small text-muted">20+ Points<br />Excellent Behavior</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <Badge bg="warning" className="mb-2 p-2">
                            <FaExclamationTriangle className="me-1" />
                            Yellow List
                          </Badge>
                          <p className="small text-muted">-10 to 0 Points<br />Warning Status</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center">
                          <Badge bg="danger" className="mb-2 p-2">
                            <FaTimesCircle className="me-1" />
                            Red List
                          </Badge>
                          <p className="small text-muted">Below -10 Points<br />Critical Status</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="shadow-sm">
              <Card.Header className="bg-secondary text-white">
                <h5 className="mb-0">
                  <FaHistory className="me-2" />
                  Behavior Records
                </h5>
              </Card.Header>
              <Card.Body>
                {behaviorRecords.length > 0 ? (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Reported By</th>
                        <th>Points</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {behaviorRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.date}</td>
                          <td>
                            <Badge 
                              bg={record.type === 'good' ? 'success' : 
                                  record.type === 'warning' ? 'warning' : 'danger'}
                            >
                              {record.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td>{record.category}</td>
                          <td>{record.description}</td>
                          <td>{record.reportedBy}</td>
                          <td>
                            <span className={record.points > 0 ? 'text-success' : 'text-danger'}>
                              {record.points > 0 ? '+' : ''}{record.points}
                            </span>
                          </td>
                          <td>
                            <Badge 
                              bg={record.status === 'white' ? 'success' : 
                                  record.status === 'yellow' ? 'warning' : 'danger'}
                            >
                              {record.status.toUpperCase()}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <FaHistory size={48} className="text-muted mb-3" />
                    <p className="text-muted">No behavior records found</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {behaviorStatus.status === 'yellow' && (
              <Alert variant="warning" className="mt-3">
                <FaExclamationTriangle className="me-2" />
                <strong>Warning:</strong> Your behavior status is currently under review. 
                Please maintain good conduct to improve your standing.
              </Alert>
            )}

            {behaviorStatus.status === 'red' && (
              <Alert variant="danger" className="mt-3">
                <FaTimesCircle className="me-2" />
                <strong>Critical Status:</strong> Your behavior record requires immediate attention. 
                Please contact the Student Affairs Office for guidance.
              </Alert>
            )}
          </Col>
        </Row>

        {/* Add Record Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Behavior Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Record Type</Form.Label>
                <Form.Select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({...newRecord, type: e.target.value as any})}
                >
                  <option value="good">Good Behavior</option>
                  <option value="warning">Warning</option>
                  <option value="violation">Violation</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Academic Excellence, Attendance, Conduct"
                  value={newRecord.category}
                  onChange={(e) => setNewRecord({...newRecord, category: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Detailed description of the behavior"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Points to add/subtract"
                  value={newRecord.points}
                  onChange={(e) => setNewRecord({...newRecord, points: parseInt(e.target.value) || 0})}
                />
                <Form.Text className="text-muted">
                  Positive for good behavior, negative for violations
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddRecord}>
              Add Record
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </SharedLayout>
  );
};

export default StudentBehaviorHistory;