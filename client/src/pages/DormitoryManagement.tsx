import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { FaHome, FaBed, FaUsers, FaClipboardList, FaDownload } from 'react-icons/fa';
import SharedLayout from '../components/Layout/SharedLayout';

interface DormRoom {
  id: string;
  blockName: string;
  roomNumber: string;
  capacity: 4 | 6;
  currentOccupants: number;
  gender: 'male' | 'female';
  floor: number;
  facilities: string[];
  status: 'available' | 'full' | 'maintenance';
}

interface DormAssignment {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  year: string;
  stream?: 'natural' | 'social';
  roomId: string;
  blockName: string;
  roomNumber: string;
  assignedDate: string;
  status: 'active' | 'moved' | 'graduated';
}

interface ClearancePass {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  items: Array<{
    type: string;
    quantity: number;
    color: string;
    description: string;
  }>;
  passType: 'holiday' | 'class-end';
  issueDate: string;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
}

const DormitoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assignment' | 'clearance' | 'rules'>('assignment');
  const [newPassForm, setNewPassForm] = useState({
    passType: 'holiday' as 'holiday' | 'class-end',
    items: [{ type: '', quantity: 1, color: '', description: '' }]
  });

  // Mock data
  const dormRooms: DormRoom[] = [
    {
      id: '1',
      blockName: 'Block A',
      roomNumber: 'A101',
      capacity: 4,
      currentOccupants: 3,
      gender: 'male',
      floor: 1,
      facilities: ['WiFi', 'Study Desk', 'Wardrobe', 'Shared Bathroom'],
      status: 'available'
    },
    {
      id: '2',
      blockName: 'Block A',
      roomNumber: 'A102',
      capacity: 6,
      currentOccupants: 6,
      gender: 'female',
      floor: 1,
      facilities: ['WiFi', 'Study Desk', 'Wardrobe', 'Shared Bathroom'],
      status: 'full'
    }
  ];

  const assignments: DormAssignment[] = [
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      studentName: 'Abebe Kebede',
      department: 'Computer Engineering',
      year: '2nd Year',
      roomId: '1',
      blockName: 'Block A',
      roomNumber: 'A101',
      assignedDate: '2024-09-01',
      status: 'active'
    }
  ];

  const [clearancePasses, setClearancePasses] = useState<ClearancePass[]>([
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      studentName: 'Abebe Kebede',
      department: 'Computer Engineering',
      items: [
        { type: 'Laptop', quantity: 1, color: 'Black', description: 'Dell Inspiron 15' },
        { type: 'Books', quantity: 5, color: 'Various', description: 'Academic textbooks' }
      ],
      passType: 'holiday',
      issueDate: '2024-12-20',
      validUntil: '2024-12-30',
      status: 'active'
    }
  ]);

  const myAssignment = assignments.find(a => a.studentId === 'WCU/2024/001234' && a.status === 'active');
  const myRoom = myAssignment ? dormRooms.find(r => r.id === myAssignment.roomId) : null;

  const addItem = () => {
    setNewPassForm(prev => ({
      ...prev,
      items: [...prev.items, { type: '', quantity: 1, color: '', description: '' }]
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setNewPassForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (index: number) => {
    setNewPassForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleRequestPass = () => {
    const newPass: ClearancePass = {
      id: Date.now().toString(),
      studentId: 'WCU/2024/001234',
      studentName: 'Abebe Kebede',
      department: 'Computer Engineering',
      items: newPassForm.items.filter(item => item.type && item.description),
      passType: newPassForm.passType,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    };

    setClearancePasses(prev => [newPass, ...prev]);
    
    setNewPassForm({
      passType: 'holiday',
      items: [{ type: '', quantity: 1, color: '', description: '' }]
    });

    alert('Clearance pass requested successfully!');
  };

  return (
    <SharedLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaHome className="me-2" />
                Dormitory Management
              </h2>
            </div>

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as any)}
              className="mb-4"
            >
              <Tab eventKey="assignment" title={<><FaBed className="me-1" />Room Assignment</>}>
                <Row>
                  <Col lg={6}>
                    <Card className="shadow-sm mb-4">
                      <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">My Room Assignment</h5>
                      </Card.Header>
                      <Card.Body>
                        {myAssignment && myRoom ? (
                          <div>
                            <div className="text-center mb-3">
                              <FaHome size={48} className="text-primary mb-2" />
                              <h4>{myRoom.blockName} - Room {myRoom.roomNumber}</h4>
                            </div>
                            
                            <Table borderless size="sm">
                              <tbody>
                                <tr>
                                  <td><strong>Capacity:</strong></td>
                                  <td>{myRoom.capacity} students</td>
                                </tr>
                                <tr>
                                  <td><strong>Current Occupants:</strong></td>
                                  <td>{myRoom.currentOccupants}/{myRoom.capacity}</td>
                                </tr>
                                <tr>
                                  <td><strong>Floor:</strong></td>
                                  <td>{myRoom.floor}</td>
                                </tr>
                                <tr>
                                  <td><strong>Gender:</strong></td>
                                  <td className="text-capitalize">{myRoom.gender}</td>
                                </tr>
                                <tr>
                                  <td><strong>Department:</strong></td>
                                  <td>{myAssignment.department}</td>
                                </tr>
                                <tr>
                                  <td><strong>Academic Year:</strong></td>
                                  <td>{myAssignment.year}</td>
                                </tr>
                              </tbody>
                            </Table>

                            <div className="mb-3">
                              <strong>Facilities:</strong>
                              <div className="mt-2">
                                {myRoom.facilities.map(facility => (
                                  <Badge key={facility} bg="info" className="me-1 mb-1">
                                    {facility}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="d-grid gap-2">
                              <Button variant="outline-primary" size="sm">
                                Request Room Change
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                Contact Dormitory Office
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Alert variant="warning">
                            <strong>No Room Assignment</strong><br />
                            You don't have a current room assignment. Please contact the dormitory office.
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={6}>
                    <Card className="shadow-sm">
                      <Card.Header className="bg-info text-white">
                        <h5 className="mb-0">Available Rooms</h5>
                      </Card.Header>
                      <Card.Body>
                        {dormRooms.filter(room => room.status === 'available').map(room => (
                          <Card key={room.id} className="mb-3">
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">{room.blockName} - {room.roomNumber}</h6>
                                <Badge bg="success">Available</Badge>
                              </div>
                              <div className="small text-muted mb-2">
                                <div><FaUsers className="me-1" />{room.currentOccupants}/{room.capacity} occupants</div>
                                <div>Floor {room.floor} • {room.gender} only</div>
                              </div>
                              <Button variant="primary" size="sm" className="w-100">
                                Request Assignment
                              </Button>
                            </Card.Body>
                          </Card>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="clearance" title={<><FaClipboardList className="me-1" />Clearance Pass</>}>
                <Row>
                  <Col lg={8}>
                    <Card className="shadow-sm mb-4">
                      <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Request Clearance Pass</h5>
                      </Card.Header>
                      <Card.Body>
                        {myAssignment ? (
                          <Form>
                            <Form.Group className="mb-3">
                              <Form.Label>Pass Type</Form.Label>
                              <div>
                                <Form.Check
                                  type="radio"
                                  name="passType"
                                  id="holiday"
                                  label="🏖️ Holiday Pass"
                                  checked={newPassForm.passType === 'holiday'}
                                  onChange={() => setNewPassForm(prev => ({ ...prev, passType: 'holiday' }))}
                                />
                                <Form.Check
                                  type="radio"
                                  name="passType"
                                  id="class-end"
                                  label="🎓 Class-End Pass"
                                  checked={newPassForm.passType === 'class-end'}
                                  onChange={() => setNewPassForm(prev => ({ ...prev, passType: 'class-end' }))}
                                />
                              </div>
                            </Form.Group>

                            <h6>Items to Take Home</h6>
                            {newPassForm.items.map((item, index) => (
                              <Row key={index} className="mb-3 p-3 bg-light rounded">
                                <Col md={3}>
                                  <Form.Group>
                                    <Form.Label className="small">Item Type</Form.Label>
                                    <Form.Control
                                      type="text"
                                      size="sm"
                                      placeholder="Laptop, Books..."
                                      value={item.type}
                                      onChange={(e) => updateItem(index, 'type', e.target.value)}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="small">Quantity</Form.Label>
                                    <Form.Control
                                      type="number"
                                      size="sm"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={2}>
                                  <Form.Group>
                                    <Form.Label className="small">Color</Form.Label>
                                    <Form.Control
                                      type="text"
                                      size="sm"
                                      placeholder="Black, Blue..."
                                      value={item.color}
                                      onChange={(e) => updateItem(index, 'color', e.target.value)}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={4}>
                                  <Form.Group>
                                    <Form.Label className="small">Description</Form.Label>
                                    <Form.Control
                                      type="text"
                                      size="sm"
                                      placeholder="Dell Inspiron 15..."
                                      value={item.description}
                                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={1} className="d-flex align-items-end">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeItem(index)}
                                  >
                                    🗑️
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            
                            <div className="d-flex gap-2 mb-3">
                              <Button variant="outline-primary" onClick={addItem}>
                                ➕ Add Item
                              </Button>
                              <Button variant="primary" onClick={handleRequestPass}>
                                📋 Request Pass
                              </Button>
                            </div>
                          </Form>
                        ) : (
                          <Alert variant="warning">
                            <strong>No Room Assignment</strong><br />
                            You need to have a room assignment before requesting clearance passes.
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                      <Card.Header className="bg-secondary text-white">
                        <h5 className="mb-0">My Clearance Passes</h5>
                      </Card.Header>
                      <Card.Body>
                        {clearancePasses.map(pass => (
                          <Card key={pass.id} className="mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">
                                  {pass.passType === 'holiday' ? '🏖️ Holiday Pass' : '🎓 Class-End Pass'}
                                </h6>
                                <Badge bg={pass.status === 'active' ? 'success' : 'secondary'}>
                                  {pass.status.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="small text-muted mb-2">
                                Valid: {pass.issueDate} - {pass.validUntil}
                              </p>
                              <div className="mb-2">
                                <strong className="small">Items:</strong>
                                {pass.items.map((item, index) => (
                                  <div key={index} className="small text-muted">
                                    • {item.quantity}x {item.type} ({item.color}) - {item.description}
                                  </div>
                                ))}
                              </div>
                              {pass.status === 'active' && (
                                <Button variant="success" size="sm">
                                  <FaDownload className="me-1" />
                                  Download Pass
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card className="shadow-sm">
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">Clearance Pass Guidelines</h6>
                      </Card.Header>
                      <Card.Body>
                        <ul className="small">
                          <li>All items must be listed accurately</li>
                          <li>Pass is valid for specified duration only</li>
                          <li>Present pass to security when leaving</li>
                          <li>Return items must match description</li>
                          <li>Report lost passes immediately</li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="rules" title="📖 Dorm Rules">
                <Card className="shadow-sm">
                  <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">Dormitory Rules & Regulations</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6 className="text-primary">General Rules</h6>
                        <ul>
                          <li>Maintain cleanliness in rooms and common areas</li>
                          <li>Respect quiet hours (10 PM - 6 AM)</li>
                          <li>No smoking or alcohol consumption</li>
                          <li>Visitors must be registered at front desk</li>
                          <li>Report maintenance issues promptly</li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-success">Contact Information</h6>
                        <p><strong>Dormitory Office:</strong> Building A, Ground Floor</p>
                        <p><strong>Phone:</strong> +251-46-550-0145</p>
                        <p><strong>Email:</strong> dormitory@wcu.edu.et</p>
                        <p><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </SharedLayout>
  );
};

export default DormitoryManagement;