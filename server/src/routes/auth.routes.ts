import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

const router = Router();

// Test endpoint - Get all users (for development only)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await query(
      'SELECT id, wcu_id, email, role, status, created_at FROM users'
    );
    
    res.json({
      success: true,
      count: (users as any[]).length,
      data: users
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { wcu_id, email, password, role, full_name, date_of_birth, gender } = req.body;

    // Validate required fields
    if (!wcu_id || !password || !role || !full_name || !date_of_birth || !gender) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE wcu_id = ?',
      [wcu_id]
    );

    if ((existingUser as any[]).length > 0) {
      res.status(400).json({
        success: false,
        message: 'User with this WCU ID already exists'
      });
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const result: any = await query(
      'INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
      [wcu_id, email, password_hash, role, 'active']
    );

    const userId = result.insertId;

    // Insert user profile
    await query(
      'INSERT INTO user_profiles (user_id, full_name, date_of_birth, gender) VALUES (?, ?, ?, ?)',
      [userId, full_name, date_of_birth, gender]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: userId,
        wcu_id,
        email,
        role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { wcuId, password } = req.body;

    if (!wcuId || !password) {
      res.status(400).json({
        success: false,
        message: 'WCU ID and password are required'
      });
      return;
    }

    // Get user
    const users: any = await query(
      'SELECT u.*, up.full_name, up.photo_url FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.wcu_id = ?',
      [wcuId]
    );

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        wcu_id: user.wcu_id, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'wcu_super_secret_jwt_key'
    );

    // Remove password from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          wcu_id: user.wcu_id,
          email: user.email,
          role: user.role,
          status: user.status,
          profile: {
            full_name: user.full_name,
            photo_url: user.photo_url
          }
        },
        token
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'wcu_super_secret_jwt_key';
    const decoded: any = jwt.verify(token, jwtSecret);

    res.json({
      success: true,
      message: 'Token is valid',
      data: decoded
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
});

export default router;