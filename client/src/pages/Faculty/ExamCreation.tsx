import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Table, Modal, Tabs, Tab } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaUsers, FaClipboardList } from 'react-icons/fa';
import SharedLayout from '../../components/Layout/SharedLayout';

export {}; // Make this file a module

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  course: string;
  description: string;
  duration: number;
  totalPoints: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  questions: Question[];
  settings: {
    proctoring: boolean;
    faceVerification: boolean;
    fullscreen: boolean;
    maxAttempts: number;
    passingScore: number;
  };
}

const ExamCreation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [examForm, setExamForm] = useState<Partial<Exam>>({
    title: '',
    course: '',
    description: '',
    duration: 60,
    startDate: '',
    endDate: '',
    questions: [],
    settings: {
      proctoring: true,
      faceVerification: true,
      fullscreen: true,
      maxAttempts: 1,
      passingScore: 60
    }
  });

  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const handleCreateExam = () => {
    if (!examForm.title || !examForm.course || !examForm.questions?.length) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }

    console.log('Creating exam:', examForm);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <SharedLayout title="Exam Creation" userRole="teacher">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaClipboardList className="me-2" />
                Exam Management
              </h2>
            </div>

            {showSuccess && (
              <Alert variant="success" className="mb-4">
                <strong>Success!</strong> Exam created successfully.
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Create New Exam</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Exam Title *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter exam title"
                          value={examForm.title}
                          onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Course *</Form.Label>
                        <Form.Select
                          value={examForm.course}
                          onChange={(e) => setExamForm({...examForm, course: e.target.value})}
                        >
                          <option value="">Select Course</option>
                          <option value="Data Structures">Data Structures</option>
                          <option value="Database Systems">Database Systems</option>
                          <option value="Software Engineering">Software Engineering</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter exam description"
                      value={examForm.description}
                      onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration (minutes) *</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={examForm.duration}
                          onChange={(e) => setExamForm({...examForm, duration: parseInt(e.target.value)})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date & Time *</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={examForm.startDate}
                          onChange={(e) => setExamForm({...examForm, startDate: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date & Time *</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={examForm.endDate}
                          onChange={(e) => setExamForm({...examForm, endDate: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid">
                    <Button variant="primary" onClick={handleCreateExam}>
                      Create Exam
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </SharedLayout>
  );
};

export default ExamCreation;