import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

// Logger class
class Logger {
  private logToFile(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    const logString = JSON.stringify(logEntry) + '\n';
    
    // Log to appropriate file
    const filename = level === LogLevel.ERROR ? 'error.log' : 'combined.log';
    const filepath = path.join(logsDir, filename);
    
    fs.appendFileSync(filepath, logString);
    
    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${timestamp}] ${level}: ${message}`, meta || '');
    }
  }
  
  error(message: string, meta?: any): void {
    this.logToFile(LogLevel.ERROR, message, meta);
  }
  
  warn(message: string, meta?: any): void {
    this.logToFile(LogLevel.WARN, message, meta);
  }
  
  info(message: string, meta?: any): void {
    this.logToFile(LogLevel.INFO, message, meta);
  }
  
  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      this.logToFile(LogLevel.DEBUG, message, meta);
    }
  }
}

export const logger = new Logger();

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: (req as any).user?.id
  });
  
  next(err);
};

export default logger;
