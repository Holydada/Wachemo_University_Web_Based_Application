import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload, UserRole, ApiResponse } from '@/types';
import { executeQuery } from '@/config/database';
import { logSecurity } from '@/utils/logger';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        wcuId: string;
        role: UserRole;
        email?: string;
      };
    }
  }
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'wcu_jwt_secret_key_2024_very_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT Token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Generate Refresh Token
export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT Token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Hash Password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  return bcrypt.hash(password, saltRounds);
};

// Compare Password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Authentication Middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logSecurity('Authentication failed - No token provided', undefined, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
      });
      
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        timestamp: new Date(),
      } as ApiResponse);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const users = await executeQuery(
      'SELECT id, wcu_id, email, role, status FROM users WHERE id = ? AND status = ?',
      [decoded.userId, 'active']
    );

    if (users.length === 0) {
      logSecurity('Authentication failed - User not found or inactive', decoded.userId, {
        wcuId: decoded.wcuId,
        ip: req.ip,
      });
      
      return res.status(401).json({
        success: false,
        message: 'User not found or account inactive',
        timestamp: new Date(),
      } as ApiResponse);
    }

    const user = users[0];
    req.user = {
      id: user.id,
      wcuId: user.wcu_id,
      role: user.role,
      email: user.email,
    };

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    next();
  } catch (error) {
    logSecurity('Authentication failed - Token verification error', undefined, {
      error: error.message,
      ip: req.ip,
    });
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      timestamp: new Date(),
    } as ApiResponse);
  }
};

// Authorization Middleware
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        timestamp: new Date(),
      } as ApiResponse);
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurity('Authorization failed - Insufficient permissions', req.user.id, {
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        resource: req.path,
      });
      
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        timestamp: new Date(),
      } as ApiResponse);
    }

    next();
  };
};

// Role-based access control helper
export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Check if user can access student data
export const canAccessStudentData = (userRole: UserRole, targetStudentId?: number, currentUserId?: number): boolean => {
  // Admin and registrar can access all student data
  if (['admin', 'registrar'].includes(userRole)) {
    return true;
  }
  
  // Students can only access their own data
  if (userRole === 'student' && targetStudentId === currentUserId) {
    return true;
  }
  
  // Faculty can access their students' data (this would need additional logic)
  if (userRole === 'faculty') {
    // TODO: Implement logic to check if faculty teaches the student
    return true;
  }
  
  return false;
};

// Middleware to check student data access
export const checkStudentAccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = parseInt(req.params.studentId || req.body.studentId);
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID required',
        timestamp: new Date(),
      } as ApiResponse);
    }

    if (!canAccessStudentData(req.user!.role, studentId, req.user!.id)) {
      logSecurity('Unauthorized student data access attempt', req.user!.id, {
        targetStudentId: studentId,
        userRole: req.user!.role,
      });
      
      return res.status(403).json({
        success: false,
        message: 'Access denied to student data',
        timestamp: new Date(),
      } as ApiResponse);
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking student access',
      timestamp: new Date(),
    } as ApiResponse);
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      const users = await executeQuery(
        'SELECT id, wcu_id, email, role, status FROM users WHERE id = ? AND status = ?',
        [decoded.userId, 'active']
      );

      if (users.length > 0) {
        const user = users[0];
        req.user = {
          id: user.id,
          wcuId: user.wcu_id,
          role: user.role,
          email: user.email,
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Rate limiting by user
export const userRateLimit = new Map<number, { count: number; resetTime: number }>();

export const checkUserRateLimit = (userId: number, maxRequests: number = 100, windowMs: number = 900000): boolean => {
  const now = Date.now();
  const userLimit = userRateLimit.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    userRateLimit.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

// Middleware for user-specific rate limiting
export const rateLimitByUser = (maxRequests: number = 100, windowMs: number = 900000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next();
    }
    
    if (!checkUserRateLimit(req.user.id, maxRequests, windowMs)) {
      logSecurity('Rate limit exceeded', req.user.id, {
        maxRequests,
        windowMs,
        ip: req.ip,
      });
      
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        timestamp: new Date(),
      } as ApiResponse);
    }
    
    next();
  };
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticate,
  authorize,
  hasPermission,
  canAccessStudentData,
  checkStudentAccess,
  optionalAuth,
  rateLimitByUser,
};