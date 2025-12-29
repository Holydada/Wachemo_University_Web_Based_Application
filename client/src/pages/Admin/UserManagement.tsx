import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import SharedLayout from '../../components/Layout/SharedLayout';

interface User {
  id: number;
  wcuId: string;
  fullName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  department?: string;
  college?: string;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'faculty' | 'admin'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [users] = useState<User[]>([
    {
      id: 1,
      wcuId: 'WCU/2024/001234',
      fullName: 'Abebe Kebede',
      email: 'abebe.kebede@student.wcu.edu.et',
      role: 'student',
      status: 'active',
      lastLogin: '2024-01-15 10:30:00',
      createdAt: '2024-09-01',
      department: 'Computer Engineering',
      college: 'Engineering & Technology'
    },
    {
      id: 2,
      wcuId: 'WCU/FAC/001',
      fullName: 'Dr. Alemayehu Tadesse',
      email: 'alemayehu.tadesse@wcu.edu.et',
      role: 'faculty',
      status: 'active',
      lastLogin: '2024-01-15 09:15:00',
      createdAt: '2020-01-15',
      department: 'Computer Science',
      college: 'Engineering & Technology'
    },
    {
      id: 3,
      wcuId: 'WCU/ADM/001',
      fullName: 'Meron Getachew',
      email: 'meron.getachew@wcu.edu.et',
      role: 'registrar',
      status: 'active',
      lastLogin: '2024-01-15 08:45:00',
      createdAt: '2019-03-10',
      department: 'Academic Affairs'
    },
    {
      id: 4,
      wcuId: 'WCU/2024/001235',
      fullName: 'Almaz Tadesse',
      email: 'almaz.tadesse@student.wcu.edu.et',
      role: 'student',
      status: 'suspended',
      lastLogin: '2024-01-10 14:20:00',
      createdAt: '2024-09-01',
      department: 'Computer Science',
      college: 'Engineering & Technology'
    }
  ]);

  const [newUser, setNewUser] = useState({
    wcuId: '',
    fullName: '',
    email: '',
    role: 'student',
    department: '',
    college: '',
    password: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.wcuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesTab = activeTab === 'all' || user.role === activeTab;
    
    return matchesSearch && matchesRole && matchesTab;
  });

  const getRoleBadge = (role: string) => {
    const roleColors: { [key: string]: string } = {
      student: 'primary',
      faculty: 'success',
      admin: 'danger',
      registrar: 'warning',
      department_head: 'info',
      dean: 'secondary',
      hr_admin: 'dark'
    };
    return <Badge bg={roleColors[role] || 'light'}>{role.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'danger'
    };
    return <Badge bg={statusColors[status]}>{status.toUpperCase()}</Badge>;
  };

  const handleAddUser = () => {
    console.log('Adding user:', newUser);
    setShowAddModal(false);
    setNewUser({
      wcuId: '',
      fullName: '',
      email: '',
      role: 'student',
      department: '',
      college: '',
      password: ''
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', userId);
    }
  };

  const handleSuspendUser = (userId: number) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      console.log('Suspending user:', userId);
    }
  };

  return (
    <SharedLayout title="User Management" userRole="admin">
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaUsers className="me-2" />
                User Management
              </h2>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaUserPlus className="me-1" />
                Add New User
              </Button>
            </div>

            {/* Search and Filter */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <div className="position-relative">
                        <FaSearch className="position-absolute" style={{ left: '10px', top: '12px', color: '#6c757d' }} />
                        <Form.Control
                          type="text"
                          placeholder="Search users by name, ID, or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ paddingLeft: '35px' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Administrators</option>
                        <option value="registrar">Registrars</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Button variant="outline-primary" className="w-100">
                      <FaFilter className="me-1" />
                      Advanced Filter
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* User Tabs */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as any)}
              className="mb-4"
            >
              <Tab eventKey="all" title={`All Users (${users.length})`}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>WCU ID</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user.id}>
                            <td><code>{user.wcuId}</code></td>
                            <td><strong>{user.fullName}</strong></td>
                            <td>{user.email}</td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>{user.department || '-'}</td>
                            <td>{getStatusBadge(user.status)}</td>
                            <td className="text-muted small">{user.lastLogin}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => handleSuspendUser(user.id)}
                                  disabled={user.status === 'suspended'}
                                >
                                  Suspend
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="students" title={`Students (${users.filter(u => u.role === 'student').length})`}>
                <Alert variant="info">
                  <strong>Student Management:</strong> Manage student accounts, academic status, and enrollment.
                </Alert>
              </Tab>

              <Tab eventKey="faculty" title={`Faculty (${users.filter(u => u.role === 'faculty').length})`}>
                <Alert variant="success">
                  <strong>Faculty Management:</strong> Manage faculty accounts, course assignments, and permissions.
                </Alert>
              </Tab>

              <Tab eventKey="admin" title={`Admin (${users.filter(u => u.role.includes('admin') || u.role === 'registrar').length})`}>
                <Alert variant="warning">
                  <strong>Administrator Management:</strong> Manage administrative accounts and system permissions.
                </Alert>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Add User Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>WCU ID *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="WCU/2024/001234"
                      value={newUser.wcuId}
                      onChange={(e) => setNewUser({...newUser, wcuId: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="user@wcu.edu.et"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Form.Select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Administrator</option>
                      <option value="registrar">Registrar</option>
                      <option value="department_head">Department Head</option>
                      <option value="dean">Dean</option>
                      <option value="hr_admin">HR Administrator</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>College</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter college"
                      value={newUser.college}
                      onChange={(e) => setNewUser({...newUser, college: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Temporary Password *</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter temporary password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
                <Form.Text className="text-muted">
                  User will be required to change password on first login.
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Add User
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit User Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <Form>
                <Alert variant="info">
                  <strong>Editing:</strong> {selectedUser.fullName} ({selectedUser.wcuId})
                </Alert>
                {/* Edit form fields would go here */}
                <p>Edit user functionality would be implemented here...</p>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </SharedLayout>
  );
};

export default UserManagement;