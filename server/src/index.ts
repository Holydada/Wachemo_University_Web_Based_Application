import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Import configurations and utilities
import { connectDatabase } from '@/config/database';
import logger, { requestLogger } from '@/utils/logger';
import { authenticate, optionalAuth } from '@/middleware/auth';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import studentRoutes from '@/routes/students';
import examRoutes from '@/routes/exams';
import gradeRoutes from '@/routes/grades';
import clearanceRoutes from '@/routes/clearance';
import cafeteriaRoutes from '@/routes/cafeteria';
import libraryRoutes from '@/routes/library';
import newsRoutes from '@/routes/news';
import adminRoutes from '@/routes/admin';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      requestLogger.http(message.trim());
    },
  },
}));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { checkDatabaseHealth } = await import('@/config/database');
    const dbHealth = await checkDatabaseHealth();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth,
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
    };

    const statusCode = dbHealth.mysql && dbHealth.redis ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/students', authenticate, studentRoutes);
app.use('/api/exams', authenticate, examRoutes);
app.use('/api/grades', authenticate, gradeRoutes);
app.use('/api/clearance', authenticate, clearanceRoutes);
app.use('/api/cafeteria', authenticate, cafeteriaRoutes);
app.use('/api/library', authenticate, libraryRoutes);
app.use('/api/news', optionalAuth, newsRoutes);
app.use('/api/admin', authenticate, adminRoutes);

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Handle authentication for socket connections
  socket.on('authenticate', async (token) => {
    try {
      const { verifyToken } = await import('@/middleware/auth');
      const decoded = verifyToken(token);
      
      socket.data.userId = decoded.userId;
      socket.data.wcuId = decoded.wcuId;
      socket.data.role = decoded.role;
      
      socket.join(`user_${decoded.userId}`);
      socket.join(`role_${decoded.role}`);
      
      socket.emit('authenticated', { success: true });
      logger.info(`Socket authenticated: ${socket.id} - User: ${decoded.wcuId}`);
    } catch (error) {
      socket.emit('authentication_error', { message: 'Invalid token' });
      socket.disconnect();
    }
  });

  // Handle exam session events
  socket.on('join_exam', (examId) => {
    if (socket.data.userId) {
      socket.join(`exam_${examId}`);
      logger.info(`User ${socket.data.wcuId} joined exam ${examId}`);
    }
  });

  socket.on('exam_violation', (data) => {
    if (socket.data.userId) {
      // Broadcast violation to exam monitors
      socket.to(`exam_${data.examId}`).emit('violation_detected', {
        studentId: socket.data.userId,
        wcuId: socket.data.wcuId,
        violation: data.violation,
        timestamp: new Date(),
      });
    }
  });

  // Handle real-time notifications
  socket.on('mark_notification_read', async (notificationId) => {
    if (socket.data.userId) {
      try {
        const { executeQuery } = await import('@/config/database');
        await executeQuery(
          'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
          [notificationId, socket.data.userId]
        );
        
        socket.emit('notification_updated', { id: notificationId, is_read: true });
      } catch (error) {
        logger.error('Error marking notification as read:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    timestamp: new Date(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date(),
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  try {
    const { disconnectDatabase } = await import('@/config/database');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  try {
    const { disconnectDatabase } = await import('@/config/database');
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 WCU Digital Campus Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      logger.info(`📡 Socket.IO enabled for real-time features`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export for testing
export { app, io };

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}