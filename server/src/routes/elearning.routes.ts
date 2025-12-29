import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Admin: Add e-learning resource
router.post('/resources', authorizeRoles('admin', 'faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      resource_type,
      platform,
      url,
      category,
      duration,
      level,
      is_free,
    } = req.body;

    const result: any = await query(
      `INSERT INTO elearning_resources (title, description, resource_type, platform, url,
       category, duration, level, is_free, added_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "active")`,
      [title, description, resource_type, platform, url, category, duration, level, is_free, req.user?.id]
    );

    res.status(201).json({
      success: true,
      message: 'E-learning resource added successfully',
      data: { resource_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding resource',
      error: error.message,
    });
  }
});

// Get all e-learning resources
router.get('/resources', async (req: Request, res: Response): Promise<void> => {
  try {
    const { platform, category, level, is_free, search } = req.query;

    let sql = `SELECT er.*, u.wcu_id as added_by_id, up.full_name as added_by_name
               FROM elearning_resources er
               JOIN users u ON er.added_by = u.id
               JOIN user_profiles up ON u.id = up.user_id
               WHERE er.status = "active"`;
    const params: any[] = [];

    if (platform) {
      sql += ' AND er.platform = ?';
      params.push(platform);
    }
    if (category) {
      sql += ' AND er.category = ?';
      params.push(category);
    }
    if (level) {
      sql += ' AND er.level = ?';
      params.push(level);
    }
    if (is_free !== undefined) {
      sql += ' AND er.is_free = ?';
      params.push(is_free === 'true' ? 1 : 0);
    }
    if (search) {
      sql += ' AND (er.title LIKE ? OR er.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY er.created_at DESC';

    const resources = await query(sql, params);

    res.json({
      success: true,
      count: (resources as any[]).length,
      data: resources,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: error.message,
    });
  }
});

// Get resource by ID
router.get('/resources/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const resources: any = await query(
      `SELECT er.*, u.wcu_id as added_by_id, up.full_name as added_by_name
       FROM elearning_resources er
       JOIN users u ON er.added_by = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE er.id = ?`,
      [id]
    );

    if (resources.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    // Increment view count
    await query('UPDATE elearning_resources SET views = views + 1 WHERE id = ?', [id]);

    res.json({
      success: true,
      data: resources[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resource',
      error: error.message,
    });
  }
});

// Student: Enroll in resource
router.post('/enroll', authorizeRoles('student', 'faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { resource_id } = req.body;

    // Check if already enrolled
    const existing: any = await query(
      'SELECT id FROM elearning_enrollments WHERE user_id = ? AND resource_id = ?',
      [userId, resource_id]
    );

    if (existing.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Already enrolled in this resource',
      });
      return;
    }

    const result: any = await query(
      'INSERT INTO elearning_enrollments (user_id, resource_id, enrollment_date, status) VALUES (?, ?, NOW(), "active")',
      [userId, resource_id]
    );

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: { enrollment_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling in resource',
      error: error.message,
    });
  }
});

// Get my enrolled resources
router.get('/my-enrollments', authorizeRoles('student', 'faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const enrollments: any = await query(
      `SELECT ee.*, er.title, er.description, er.platform, er.url, er.resource_type,
              er.duration, er.level
       FROM elearning_enrollments ee
       JOIN elearning_resources er ON ee.resource_id = er.id
       WHERE ee.user_id = ?
       ORDER BY ee.enrollment_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message,
    });
  }
});

// Update progress
router.put('/progress/:enrollmentId', authorizeRoles('student', 'faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { enrollmentId } = req.params;
    const { progress_percentage, completed } = req.body;

    await query(
      'UPDATE elearning_enrollments SET progress_percentage = ?, completed = ?, last_accessed = NOW() WHERE id = ?',
      [progress_percentage, completed, enrollmentId]
    );

    if (completed) {
      await query(
        'UPDATE elearning_enrollments SET completion_date = NOW() WHERE id = ?',
        [enrollmentId]
      );
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message,
    });
  }
});

// Admin: Update resource
router.put('/resources/:id', authorizeRoles('admin', 'faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      url,
      category,
      duration,
      level,
      is_free,
      status,
    } = req.body;

    await query(
      `UPDATE elearning_resources SET title = ?, description = ?, url = ?, category = ?,
       duration = ?, level = ?, is_free = ?, status = ? WHERE id = ?`,
      [title, description, url, category, duration, level, is_free, status, id]
    );

    res.json({
      success: true,
      message: 'Resource updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating resource',
      error: error.message,
    });
  }
});

// Admin: Delete resource
router.delete('/resources/:id', authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await query('DELETE FROM elearning_resources WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message,
    });
  }
});

export default router;
