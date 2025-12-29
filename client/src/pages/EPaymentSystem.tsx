import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Table } from 'react-bootstrap';
import { FaCreditCard, FaUniversity, FaMobile, FaReceipt, FaHistory } from 'react-icons/fa';
import SharedLayout from '../components/Layout/SharedLayout';

interface PaymentRecord {
  id: string;
  type: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference: string;
}

const EPaymentSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pay' | 'history'>('pay');
  const [paymentType, setPaymentType] = useState<'penalty' | 'registration' | 'sponsor'>('penalty');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile' | 'card'>('bank');
  const [amount, setAmount] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock payment history
  const paymentHistory: PaymentRecord[] = [
    {
      id: 'PAY001',
      type: 'ID Card Penalty',
      amount: 150,
      status: 'completed',
      date: '2024-01-15',
      reference: 'REF123456'
    },
    {
      id: 'PAY002',
      type: 'Late Registration Fee',
      amount: 200,
      status: 'completed',
      date: '2024-01-10',
      reference: 'REF123457'
    }
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setAmount('');
      setReference('');
      
      setTimeout(() => setShowSuccess(false), 5000);
    }, 3000);
  };

  const getPaymentTypeInfo = () => {
    switch (paymentType) {
      case 'penalty':
        return {
          title: 'Penalty Payments',
          description: 'Pay for ID card replacement, late registration, or other penalties',
          suggestedAmount: '150'
        };
      case 'registration':
        return {
          title: 'Registration Fees',
          description: 'Pay registration fees and related charges',
          suggestedAmount: '200'
        };
      case 'sponsor':
        return {
          title: 'University Sponsorship',
          description: 'Make sponsorship payments to support university programs',
          suggestedAmount: '1000'
        };
      default:
        return { title: '', description: '', suggestedAmount: '' };
    }
  };

  const paymentInfo = getPaymentTypeInfo();

  return (
    <SharedLayout>
      <Container fluid className="py-4">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <FaCreditCard className="me-2" />
                E-Payment System
              </h2>
              <div>
                <Button
                  variant={activeTab === 'pay' ? 'primary' : 'outline-primary'}
                  className="me-2"
                  onClick={() => setActiveTab('pay')}
                >
                  Make Payment
                </Button>
                <Button
                  variant={activeTab === 'history' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('history')}
                >
                  <FaHistory className="me-1" />
                  Payment History
                </Button>
              </div>
            </div>

            {showSuccess && (
              <Alert variant="success" className="mb-4">
                <strong>Payment Successful!</strong> Your payment has been processed successfully. 
                You will receive a confirmation email shortly.
              </Alert>
            )}

            {activeTab === 'pay' && (
              <Row>
                <Col lg={8}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Payment Details</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={handlePayment}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Payment Type</Form.Label>
                              <Form.Select
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value as any)}
                              >
                                <option value="penalty">Penalty Payments</option>
                                <option value="registration">Registration Fees</option>
                                <option value="sponsor">University Sponsorship</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Payment Method</Form.Label>
                              <Form.Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as any)}
                              >
                                <option value="bank">Bank Transfer</option>
                                <option value="mobile">Mobile Money</option>
                                <option value="card">Credit/Debit Card</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Amount (ETB)</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder={`Suggested: ${paymentInfo.suggestedAmount} ETB`}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Reference Number (Optional)</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter reference number"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {paymentMethod === 'bank' && (
                          <Alert variant="info" className="mb-3">
                            <strong>Bank Details:</strong><br />
                            Account Name: Wachemo University<br />
                            Account Number: 1000123456789<br />
                            Bank: Commercial Bank of Ethiopia<br />
                            Branch: Hossana Branch
                          </Alert>
                        )}

                        {paymentMethod === 'mobile' && (
                          <Alert variant="info" className="mb-3">
                            <strong>Mobile Money:</strong><br />
                            Send money to: 0911123456<br />
                            Service: M-Birr / HelloCash<br />
                            Reference: Your Student ID
                          </Alert>
                        )}

                        <div className="d-grid">
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isProcessing || !amount}
                          >
                            {isProcessing ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <FaCreditCard className="me-2" />
                                Pay {amount} ETB
                              </>
                            )}
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="shadow-sm">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">{paymentInfo.title}</h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted small">{paymentInfo.description}</p>
                      
                      <div className="mb-3">
                        <strong>Payment Methods:</strong>
                        <div className="mt-2">
                          <Badge bg="primary" className="me-2 mb-1">
                            <FaUniversity className="me-1" />
                            Bank Transfer
                          </Badge>
                          <Badge bg="success" className="me-2 mb-1">
                            <FaMobile className="me-1" />
                            Mobile Money
                          </Badge>
                          <Badge bg="warning" className="mb-1">
                            <FaCreditCard className="me-1" />
                            Card Payment
                          </Badge>
                        </div>
                      </div>

                      <Alert variant="warning" className="small">
                        <strong>Note:</strong> Keep your payment receipt for verification. 
                        Processing may take 1-3 business days.
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {activeTab === 'history' && (
              <Card className="shadow-sm">
                <Card.Header className="bg-secondary text-white">
                  <h5 className="mb-0">
                    <FaReceipt className="me-2" />
                    Payment History
                  </h5>
                </Card.Header>
                <Card.Body>
                  {paymentHistory.length > 0 ? (
                    <Table responsive striped hover>
                      <thead>
                        <tr>
                          <th>Payment ID</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td><code>{payment.id}</code></td>
                            <td>{payment.type}</td>
                            <td><strong>{payment.amount} ETB</strong></td>
                            <td>
                              <Badge 
                                bg={payment.status === 'completed' ? 'success' : 
                                    payment.status === 'pending' ? 'warning' : 'danger'}
                              >
                                {payment.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td>{payment.date}</td>
                            <td><code>{payment.reference}</code></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <FaReceipt size={48} className="text-muted mb-3" />
                      <p className="text-muted">No payment history found</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </SharedLayout>
  );
};

export default EPaymentSystem;