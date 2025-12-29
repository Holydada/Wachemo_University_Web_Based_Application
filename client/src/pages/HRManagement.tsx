import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaUsers, FaUserPlus, FaUserTimes, FaMoneyBillWave, FaBell, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import SharedLayout from '../components/Layout/SharedLayout';

interface Employee {
  id: string;
  fullName: string;
  position: string;
  department: string;
  employeeType: 'faculty' | 'admin' | 'staff' | 'security';
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  experience: string;
  education: string;
  email: string;
  phone: string;
}

interface SalaryUpdate {
  id: string;
  employeeId: string;
  employeeName: string;
  oldSalary: number;
  newSalary: number;
  effectiveDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const HRManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'recruitment' | 'salary'>('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    position: '',
    department: '',
    employeeType: 'faculty' as 'faculty' | 'admin' | 'staff' | 'security',
    salary: '',
    experience: '',
    education: '',
    email: '',
    phone: ''
  });

  const [salaryUpdate, setSalaryUpdate] = useState({
    newSalary: '',
    reason: '',
    effectiveDate: ''
  });

  // Mock employee data
  const employees: Employee[] = [
    {
      id: 'EMP001',
      fullName: 'Dr. Alemayehu Tadesse',
      position: 'Professor',
      department: 'Computer Science',
      employeeType: 'faculty',
      hireDate: '2020-01-15',
      salary: 25000,
      status: 'active',
      experience: '15 years',
      education: 'PhD in Computer Science',
      email: 'alemayehu.tadesse@wcu.edu.et',
      phone: '+251-911-123456'
    },
    {
      id: 'EMP002',
      fullName: 'Meron Getachew',
      position: 'Registrar',
      department: 'Academic Affairs',
      employeeType: 'admin',
      hireDate: '2019-03-10',
      salary: 18000,
      status: 'active',
      experience: '12 years',
      education: 'Masters in Educational Administration',
      email: 'meron.getachew@wcu.edu.et',
      phone: '+251-911-234567'
    },
    {
      id: 'EMP003',
      fullName: 'Bekele Worku',
      position: 'Security Officer',
      department: 'Security',
      employeeType: 'security',
      hireDate: '2021-06-01',
      salary: 8000,
      status: 'active',
      experience: '8 years',
      education: 'High School Diploma',
      email: 'bekele.worku@wcu.edu.et',
      phone: '+251-911-345678'
    }
  ];

  // Mock salary updates
  const salaryUpdates: SalaryUpdate[] = [
    {
      id: 'SAL001',
      employeeId: 'EMP001',
      employeeName: 'Dr. Alemayehu Tadesse',
      oldSalary: 23000,
      newSalary: 25000,
      effectiveDate: '2024-01-01',
      reason: 'Annual increment and promotion',
      status: 'approved'
    },
    {
      id: 'SAL002',
      employeeId: 'EMP002',
      employeeName: 'Meron Getachew',
      oldSalary: 16000,
      newSalary: 18000,
      effectiveDate: '2024-01-01',
      reason: 'Government salary adjustment',
      status: 'pending'
    }
  ];

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would save to backend
    console.log('Adding new employee:', newEmployee);
    setShowAddModal(false);
    setSuccessMessage('Employee added successfully!');
    setShowSuccess(true);
    setNewEmployee({
      fullName: '',
      position: '',
      department: '',
      employeeType: 'faculty',
      salary: '',
      experience: '',
      education: '',
      email: '',
      phone: ''
    });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleSalaryUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would save to backend
    console.log('Salary update for:', selectedEmployee?.fullName, salaryUpdate);
    setShowSalaryModal(false);
    setSuccessMessage('Salary update request submitted successfully!');
    setShowSuccess(true);
    setSalaryUpdate({
      newSalary: '',
      reason: '',
      effectiveDate: ''
    });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="warning">Inactive</Badge>;
      case 'terminated':
        return <Badge bg="danger">Terminated</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getEmployeeTypeBadge = (type: string) => {
    switch (type) {
      case 'faculty':
        return <Badge bg="primary">Faculty</Badge>;
      case 'admin':
        return <Badge bg="info">Admin</Badge>;
      case 'staff':
        return <Badge bg="secondary">Staff</Badge>;
      case 'security':
        return <Badge bg="warning">Security</Badge>;
      default:
        return <Badge bg="light">Other</Badge>;
    }
  };

  return (
    <SharedLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaUsers className="me-2" />
                HR Management System
              </h2>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                <FaUserPlus className="me-1" />
                Add Employee
              </Button>
            </div>

            {showSuccess && (
              <Alert variant="success" className="mb-4">
                <strong>Success!</strong> {successMessage}
              </Alert>
            )}

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as any)}
              className="mb-4"
            >
              <Tab eventKey="employees" title="Employee Directory">
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Employee Directory</h5>
                    <div className="d-flex align-items-center">
                      <FaSearch className="me-2" />
                      <Form.Control
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '250px' }}
                      />
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Full Name</th>
                          <th>Position</th>
                          <th>Department</th>
                          <th>Type</th>
                          <th>Hire Date</th>
                          <th>Salary</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td><code>{employee.id}</code></td>
                            <td><strong>{employee.fullName}</strong></td>
                            <td>{employee.position}</td>
                            <td>{employee.department}</td>
                            <td>{getEmployeeTypeBadge(employee.employeeType)}</td>
                            <td>{employee.hireDate}</td>
                            <td><strong>{employee.salary.toLocaleString()} ETB</strong></td>
                            <td>{getStatusBadge(employee.status)}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-1"
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowSalaryModal(true);
                                }}
                              >
                                <FaMoneyBillWave />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="me-1"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="recruitment" title="Recruitment">
                <Card className="shadow-sm">
                  <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">Recruitment Guidelines</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>Faculty Recruitment Requirements:</h6>
                        <ul>
                          <li>Minimum PhD degree in relevant field</li>
                          <li>Teaching experience preferred</li>
                          <li>Research publications</li>
                          <li>Ethiopian government clearance</li>
                          <li>Medical certificate</li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6>Administrative Staff Requirements:</h6>
                        <ul>
                          <li>Relevant degree/diploma</li>
                          <li>Work experience in similar role</li>
                          <li>Computer literacy</li>
                          <li>Language proficiency (Amharic/English)</li>
                          <li>Background check</li>
                        </ul>
                      </Col>
                    </Row>
                    
                    <Alert variant="warning" className="mt-3">
                      <strong>Note:</strong> All recruitment must follow Ethiopian Federal Government 
                      regulations and university policies. Contact HR for detailed guidelines.
                    </Alert>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="salary" title="Salary Management">
                <Card className="shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">
                      <FaMoneyBillWave className="me-2" />
                      Salary Updates & Notifications
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Old Salary</th>
                          <th>New Salary</th>
                          <th>Effective Date</th>
                          <th>Reason</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryUpdates.map((update) => (
                          <tr key={update.id}>
                            <td><strong>{update.employeeName}</strong></td>
                            <td>{update.oldSalary.toLocaleString()} ETB</td>
                            <td><strong className="text-success">{update.newSalary.toLocaleString()} ETB</strong></td>
                            <td>{update.effectiveDate}</td>
                            <td>{update.reason}</td>
                            <td>
                              <Badge bg={update.status === 'approved' ? 'success' : 
                                        update.status === 'pending' ? 'warning' : 'danger'}>
                                {update.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                <FaBell className="me-1" />
                                Notify
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Add Employee Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddEmployee}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      value={newEmployee.fullName}
                      onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Position *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Professor, Lecturer, Admin"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter department"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee Type *</Form.Label>
                    <Form.Select
                      value={newEmployee.employeeType}
                      onChange={(e) => setNewEmployee({...newEmployee, employeeType: e.target.value as any})}
                      required
                    >
                      <option value="faculty">Faculty</option>
                      <option value="admin">Administrative</option>
                      <option value="staff">Support Staff</option>
                      <option value="security">Security</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="employee@wcu.edu.et"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+251-XXX-XXXXXX"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Salary (ETB) *</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter monthly salary"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., 5 years"
                      value={newEmployee.experience}
                      onChange={(e) => setNewEmployee({...newEmployee, experience: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Education *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., PhD in Computer Science"
                  value={newEmployee.education}
                  onChange={(e) => setNewEmployee({...newEmployee, education: e.target.value})}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Salary Update Modal */}
        <Modal show={showSalaryModal} onHide={() => setShowSalaryModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Salary</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEmployee && (
              <div>
                <p><strong>Employee:</strong> {selectedEmployee.fullName}</p>
                <p><strong>Current Salary:</strong> {selectedEmployee.salary.toLocaleString()} ETB</p>
                
                <Form onSubmit={handleSalaryUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Salary (ETB) *</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter new salary"
                      value={salaryUpdate.newSalary}
                      onChange={(e) => setSalaryUpdate({...salaryUpdate, newSalary: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Effective Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={salaryUpdate.effectiveDate}
                      onChange={(e) => setSalaryUpdate({...salaryUpdate, effectiveDate: e.target.value})}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Reason *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Reason for salary adjustment"
                      value={salaryUpdate.reason}
                      onChange={(e) => setSalaryUpdate({...salaryUpdate, reason: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Form>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSalaryModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSalaryUpdate}>
              Submit Update
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </SharedLayout>
  );
};

export default HRManagement;