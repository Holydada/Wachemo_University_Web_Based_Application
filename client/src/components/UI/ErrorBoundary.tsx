import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card className="shadow-sm border-0">
                  <Card.Body className="text-center p-5">
                    <div className="mb-4" style={{ fontSize: '4rem' }}>
                      ⚠️
                    </div>
                    
                    <h2 className="text-danger mb-3">Something went wrong</h2>
                    
                    <p className="text-muted mb-4">
                      We're sorry, but something unexpected happened. Please try refreshing the page 
                      or contact support if the problem persists.
                    </p>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                      <Card className="text-start mb-4 bg-light">
                        <Card.Header className="bg-danger text-white">
                          <h6 className="mb-0">🐛 Error Details (Development Mode)</h6>
                        </Card.Header>
                        <Card.Body>
                          <p className="mb-2">
                            <strong>Error:</strong> {this.state.error.message}
                          </p>
                          <details>
                            <summary className="text-primary" style={{ cursor: 'pointer' }}>
                              View Stack Trace
                            </summary>
                            <pre className="small mt-2 p-2 bg-white border rounded" style={{ 
                              whiteSpace: 'pre-wrap',
                              fontSize: '0.75rem',
                              maxHeight: '200px',
                              overflow: 'auto'
                            }}>
                              {this.state.error.stack}
                            </pre>
                          </details>
                        </Card.Body>
                      </Card>
                    )}

                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Button
                        style={{
                          background: 'linear-gradient(135deg, #7a0a2d, #c42e53)',
                          border: 'none'
                        }}
                        onClick={() => window.location.reload()}
                      >
                        🔄 Refresh Page
                      </Button>
                      
                      <Button
                        variant="outline-secondary"
                        onClick={() => window.location.href = '/'}
                      >
                        🏠 Go Home
                      </Button>
                    </div>

                    <div className="mt-4 pt-3 border-top">
                      <p className="text-muted small mb-0">
                        If this problem continues, please contact{' '}
                        <a 
                          href="mailto:support@wcu.edu.et" 
                          className="text-decoration-none"
                          style={{ color: '#7a0a2d' }}
                        >
                          support@wcu.edu.et
                        </a>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;