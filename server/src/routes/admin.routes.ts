import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get all users
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, status, search } = req.query;

    let sql = `SELECT u.id, u.wcu_id, u.email, u.role, u.status, u.created_at, u.last_login,
                      up.full_name, up.phone, up.photo_url
               FROM users u
               LEFT JOIN user_profiles up ON u.id = up.user_id
               WHERE 1=1`;
    const params: any[] = [];

    if (role) {
      sql += ' AND u.role = ?';
      params.push(role);
    }

    if (status) {
      sql += ' AND u.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (u.wcu_id LIKE ? OR u.email LIKE ? OR up.full_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY u.created_at DESC';

    const users: any = await query(sql, params);

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const users: any = await query(
      `SELECT u.*, up.full_name, up.date_of_birth, up.gender, up.phone, up.address, up.photo_url
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = ?`,
      [id]
    );

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
});

// Create new user
router.post('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const { wcu_id, email, password, role, full_name, date_of_birth, gender, phone, address } = req.body;

    if (!wcu_id || !password || !role || !full_name) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
      return;
    }

    // Check if user exists
    const existing: any = await query('SELECT id FROM users WHERE wcu_id = ?', [wcu_id]);

    if (existing.length > 0) {
      res.status(400).json({
        success: false,
        message: 'User with this WCU ID already exists',
      });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result: any = await query(
      'INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES (?, ?, ?, ?, "active")',
      [wcu_id, email, password_hash, role]
    );

    const userId = result.insertId;

    await query(
      'INSERT INTO user_profiles (user_id, full_name, date_of_birth, gender, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, full_name, date_of_birth, gender, phone, address]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: userId, wcu_id, role },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
});

// Update user
router.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, role, status, full_name, phone, address } = req.body;

    await query(
      'UPDATE users SET email = ?, role = ?, status = ? WHERE id = ?',
      [email, role, status, id]
    );

    await query(
      'UPDATE user_profiles SET full_name = ?, phone = ?, address = ? WHERE user_id = ?',
      [full_name, phone, address, id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
});

// Delete user
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Soft delete by setting status to inactive
    await query('UPDATE users SET status = "inactive" WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

// Get system statistics
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers: any = await query('SELECT COUNT(*) as count FROM users WHERE status = "active"');
    const totalStudents: any = await query('SELECT COUNT(*) as count FROM students');
    const totalCourses: any = await query('SELECT COUNT(*) as count FROM courses');
    const totalEnrollments: any = await query('SELECT COUNT(*) as count FROM enrollments');

    const usersByRole: any = await query(
      'SELECT role, COUNT(*) as count FROM users WHERE status = "active" GROUP BY role'
    );

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers[0].count,
        totalStudents: totalStudents[0].count,
        totalCourses: totalCourses[0].count,
        totalEnrollments: totalEnrollments[0].count,
        usersByRole,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
});

export default router;
