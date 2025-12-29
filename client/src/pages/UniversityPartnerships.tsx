import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Modal, Carousel } from 'react-bootstrap';
import { FaHandshake, FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaPlus, FaEye } from 'react-icons/fa';
import SharedLayout from '../components/Layout/SharedLayout';

interface Partnership {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  partnershipType: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  message: string;
  logo?: string;
}

const UniversityPartnerships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'partners' | 'applications'>('register');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    partnershipType: 'sponsorship',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock existing partnerships
  const existingPartners: Partnership[] = [
    {
      id: 'P001',
      companyName: 'Ethiopian Airlines',
      contactPerson: 'Mehari Reda',
      email: 'partnerships@ethiopianairlines.com',
      phone: '+251-11-517-8888',
      website: 'https://www.ethiopianairlines.com',
      partnershipType: 'internship',
      status: 'approved',
      submissionDate: '2024-01-01',
      message: 'We would like to provide internship opportunities for engineering students.',
      logo: '/api/placeholder/100/60'
    },
    {
      id: 'P002',
      companyName: 'Safaricom Ethiopia',
      contactPerson: 'Anteneh Tesfaye',
      email: 'corporate@safaricom.et',
      phone: '+251-11-551-5555',
      website: 'https://www.safaricom.et',
      partnershipType: 'technology',
      status: 'approved',
      submissionDate: '2024-01-15',
      message: 'Partnership for technology infrastructure and student training programs.',
      logo: '/api/placeholder/100/60'
    }
  ];

  // Mock pending applications
  const pendingApplications: Partnership[] = [
    {
      id: 'A001',
      companyName: 'Awash Bank',
      contactPerson: 'Tsegaye Eshete',
      email: 'info@awashbank.com',
      phone: '+251-11-551-5656',
      website: 'https://www.awashbank.com',
      partnershipType: 'financial',
      status: 'pending',
      submissionDate: '2024-01-20',
      message: 'We are interested in providing financial literacy programs and scholarships.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would submit to backend
    console.log('Partnership application submitted:', formData);
    setShowSuccess(true);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      partnershipType: 'sponsorship',
      message: ''
    });
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const viewDetails = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <SharedLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaHandshake className="me-2" />
                University Partnerships
              </h2>
              <div>
                <Button
                  variant={activeTab === 'register' ? 'primary' : 'outline-primary'}
                  className="me-2"
                  onClick={() => setActiveTab('register')}
                >
                  Register Partnership
                </Button>
                <Button
                  variant={activeTab === 'partners' ? 'primary' : 'outline-primary'}
                  className="me-2"
                  onClick={() => setActiveTab('partners')}
                >
                  Current Partners
                </Button>
                <Button
                  variant={activeTab === 'applications' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('applications')}
                >
                  Applications
                </Button>
              </div>
            </div>

            {showSuccess && (
              <Alert variant="success" className="mb-4">
                <strong>Application Submitted!</strong> Thank you for your interest in partnering with Wachemo University. 
                We will review your application and contact you within 5-7 business days.
              </Alert>
            )}

            {activeTab === 'register' && (
              <Row>
                <Col lg={8}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Partnership Registration Form</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Company/Organization Name *</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter company name"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Contact Person *</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Full name of contact person"
                                value={formData.contactPerson}
                                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Email Address *</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="contact@company.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Phone Number *</Form.Label>
                              <Form.Control
                                type="tel"
                                placeholder="+251-XX-XXX-XXXX"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Website</Form.Label>
                              <Form.Control
                                type="url"
                                placeholder="https://www.company.com"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Partnership Type *</Form.Label>
                              <Form.Select
                                value={formData.partnershipType}
                                onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                                required
                              >
                                <option value="sponsorship">Financial Sponsorship</option>
                                <option value="internship">Internship Programs</option>
                                <option value="research">Research Collaboration</option>
                                <option value="technology">Technology Partnership</option>
                                <option value="training">Training & Development</option>
                                <option value="infrastructure">Infrastructure Support</option>
                                <option value="other">Other</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-4">
                          <Form.Label>Partnership Proposal *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Please describe your partnership proposal, including objectives, expected outcomes, and how it will benefit both parties..."
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            required
                          />
                        </Form.Group>

                        <div className="d-grid">
                          <Button type="submit" variant="primary" size="lg">
                            <FaPlus className="me-2" />
                            Submit Partnership Application
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">Partnership Benefits</h6>
                    </Card.Header>
                    <Card.Body>
                      <ul className="list-unstyled">
                        <li className="mb-2">✓ Access to talented students and graduates</li>
                        <li className="mb-2">✓ Research collaboration opportunities</li>
                        <li className="mb-2">✓ Brand visibility on campus</li>
                        <li className="mb-2">✓ Corporate social responsibility</li>
                        <li className="mb-2">✓ Innovation and technology transfer</li>
                        <li className="mb-2">✓ Customized training programs</li>
                      </ul>
                    </Card.Body>
                  </Card>

                  <Card className="shadow-sm mt-3">
                    <Card.Header className="bg-warning text-dark">
                      <h6 className="mb-0">Contact Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><FaEnvelope className="me-2" />partnerships@wcu.edu.et</p>
                      <p><FaPhone className="me-2" />+251-46-550-1234</p>
                      <p><FaGlobe className="me-2" />www.wcu.edu.et</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {activeTab === 'partners' && (
              <div>
                <Card className="shadow-sm mb-4">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">Current University Partners</h5>
                  </Card.Header>
                  <Card.Body>
                    <Carousel>
                      {existingPartners.map((partner, index) => (
                        <Carousel.Item key={partner.id}>
                          <div className="text-center py-4">
                            <img
                              src={partner.logo || '/api/placeholder/150/80'}
                              alt={partner.companyName}
                              className="mb-3"
                              style={{ maxHeight: '80px' }}
                            />
                            <h4>{partner.companyName}</h4>
                            <p className="text-muted">{partner.partnershipType.charAt(0).toUpperCase() + partner.partnershipType.slice(1)} Partnership</p>
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Card.Body>
                </Card>

                <Card className="shadow-sm">
                  <Card.Header className="bg-secondary text-white">
                    <h5 className="mb-0">Partner Directory</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Contact Person</th>
                          <th>Partnership Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {existingPartners.map((partner) => (
                          <tr key={partner.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaBuilding className="me-2 text-primary" />
                                <strong>{partner.companyName}</strong>
                              </div>
                            </td>
                            <td>{partner.contactPerson}</td>
                            <td>
                              <Badge bg="primary">
                                {partner.partnershipType.charAt(0).toUpperCase() + partner.partnershipType.slice(1)}
                              </Badge>
                            </td>
                            <td>{getStatusBadge(partner.status)}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => viewDetails(partner)}
                              >
                                <FaEye className="me-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </div>
            )}

            {activeTab === 'applications' && (
              <Card className="shadow-sm">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">Pending Partnership Applications</h5>
                </Card.Header>
                <Card.Body>
                  {pendingApplications.length > 0 ? (
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Contact Person</th>
                          <th>Partnership Type</th>
                          <th>Submission Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApplications.map((application) => (
                          <tr key={application.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaBuilding className="me-2 text-warning" />
                                <strong>{application.companyName}</strong>
                              </div>
                            </td>
                            <td>{application.contactPerson}</td>
                            <td>
                              <Badge bg="info">
                                {application.partnershipType.charAt(0).toUpperCase() + application.partnershipType.slice(1)}
                              </Badge>
                            </td>
                            <td>{application.submissionDate}</td>
                            <td>{getStatusBadge(application.status)}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => viewDetails(application)}
                              >
                                <FaEye className="me-1" />
                                Review
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <FaHandshake size={48} className="text-muted mb-3" />
                      <p className="text-muted">No pending applications</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Details Modal */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Partnership Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPartnership && (
              <div>
                <Row>
                  <Col md={6}>
                    <h5>{selectedPartnership.companyName}</h5>
                    <p><strong>Contact:</strong> {selectedPartnership.contactPerson}</p>
                    <p><strong>Email:</strong> {selectedPartnership.email}</p>
                    <p><strong>Phone:</strong> {selectedPartnership.phone}</p>
                    {selectedPartnership.website && (
                      <p><strong>Website:</strong> <a href={selectedPartnership.website} target="_blank" rel="noopener noreferrer">{selectedPartnership.website}</a></p>
                    )}
                  </Col>
                  <Col md={6}>
                    <p><strong>Partnership Type:</strong> {selectedPartnership.partnershipType}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedPartnership.status)}</p>
                    <p><strong>Submission Date:</strong> {selectedPartnership.submissionDate}</p>
                  </Col>
                </Row>
                <hr />
                <h6>Partnership Proposal:</h6>
                <p>{selectedPartnership.message}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </SharedLayout>
  );
};

export default UniversityPartnerships;