import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { requestLogger, errorLogger } from './config/logger';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.middleware';
import { validateInput } from './middleware/validation.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import facultyRoutes from './routes/faculty.routes';
import adminRoutes from './routes/admin.routes';
import registrarRoutes from './routes/registrar.routes';
import coursesRoutes from './routes/courses.routes';
import examRoutes from './routes/exam.routes';
import libraryRoutes from './routes/library.routes';
import cafeteriaRoutes from './routes/cafeteria.routes';
import newsRoutes from './routes/news.routes';
import studentIdRoutes from './routes/student-id.routes';
import dormitoryRoutes from './routes/dormitory.routes';
import paymentRoutes from './routes/payment.routes';
import partnershipRoutes from './routes/partnership.routes';
import behaviorRoutes from './routes/behavior.routes';
import elearningRoutes from './routes/elearning.routes';
import healthRoutes from './routes/health.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middleware
app.use(requestLogger); // Request logging
app.use(validateInput); // Input sanitization
app.use(apiLimiter); // Rate limiting for all routes

// Health check endpoints (no rate limiting)
app.use('/', healthRoutes);

// API routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limiting for auth
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/registrar', registrarRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/cafeteria', cafeteriaRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/student-id', studentIdRoutes);
app.use('/api/dormitory', dormitoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/elearning', elearningRoutes);

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Wachemo University Digital Campus API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      students: '/api/students',
      faculty: '/api/faculty',
      admin: '/api/admin',
      registrar: '/api/registrar',
      courses: '/api/courses',
      exams: '/api/exams',
      library: '/api/library',
      cafeteria: '/api/cafeteria',
      news: '/api/news',
      studentId: '/api/student-id',
      dormitory: '/api/dormitory',
      payments: '/api/payments',
      partnerships: '/api/partnerships',
      behavior: '/api/behavior',
      elearning: '/api/elearning'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use(errorLogger); // Log errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('🚀 ========================================');
      console.log(`🎓 WCU Digital Campus API Server`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('🚀 ========================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

export default app;