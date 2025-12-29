import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Admin: Add behavior record
router.post('/records', authorizeRoles('admin', 'discipline'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      student_id,
      behavior_type,
      category,
      description,
      severity,
      action_taken,
      reported_by,
    } = req.body;

    const result: any = await query(
      `INSERT INTO student_behavior (student_id, behavior_type, category, description, severity,
       action_taken, reported_by, recorded_by, record_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [student_id, behavior_type, category, description, severity, action_taken, reported_by, req.user?.id]
    );

    // Update student status based on severity
    if (severity === 'critical') {
      await query(
        'UPDATE students SET behavior_status = "red_list" WHERE id = ?',
        [student_id]
      );
    } else if (severity === 'major') {
      await query(
        'UPDATE students SET behavior_status = "black_list" WHERE id = ?',
        [student_id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Behavior record added successfully',
      data: { record_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding behavior record',
      error: error.message,
    });
  }
});

// Admin: Get all behavior records
router.get('/records', authorizeRoles('admin', 'discipline'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, behavior_type, severity } = req.query;

    let sql = `SELECT sb.*, s.student_id as student_number, u.wcu_id, up.full_name,
                      d.department_name
               FROM student_behavior sb
               JOIN students s ON sb.student_id = s.id
               JOIN users u ON s.user_id = u.id
               JOIN user_profiles up ON u.id = up.user_id
               LEFT JOIN departments d ON s.department_id = d.id
               WHERE 1=1`;
    const params: any[] = [];

    if (student_id) {
      sql += ' AND sb.student_id = ?';
      params.push(student_id);
    }
    if (behavior_type) {
      sql += ' AND sb.behavior_type = ?';
      params.push(behavior_type);
    }
    if (severity) {
      sql += ' AND sb.severity = ?';
      params.push(severity);
    }

    sql += ' ORDER BY sb.record_date DESC';

    const records = await query(sql, params);

    res.json({
      success: true,
      count: (records as any[]).length,
      data: records,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching behavior records',
      error: error.message,
    });
  }
});

// Student: Get my behavior status
router.get('/my-status', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const student: any = await query(
      'SELECT behavior_status FROM students WHERE user_id = ?',
      [userId]
    );

    const records: any = await query(
      `SELECT sb.behavior_type, sb.category, sb.description, sb.severity, sb.record_date
       FROM student_behavior sb
       JOIN students s ON sb.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY sb.record_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        status: student[0]?.behavior_status || 'white_list',
        records,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching behavior status',
      error: error.message,
    });
  }
});

// Admin: Update student behavior status
router.put('/status/:studentId', authorizeRoles('admin', 'discipline'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { behavior_status, notes } = req.body;

    await query(
      'UPDATE students SET behavior_status = ? WHERE id = ?',
      [behavior_status, studentId]
    );

    // Log the status change
    await query(
      `INSERT INTO student_behavior (student_id, behavior_type, category, description, 
       recorded_by, record_date)
       VALUES (?, "status_change", "administrative", ?, ?, NOW())`,
      [studentId, `Status changed to ${behavior_status}. ${notes}`, req.user?.id]
    );

    res.json({
      success: true,
      message: 'Student behavior status updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating behavior status',
      error: error.message,
    });
  }
});

// Get students by behavior status
router.get('/by-status/:status', authorizeRoles('admin', 'discipline'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params;

    const students: any = await query(
      `SELECT s.*, u.wcu_id, up.full_name, d.department_name,
              (SELECT COUNT(*) FROM student_behavior WHERE student_id = s.id) as total_records
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.behavior_status = ?
       ORDER BY up.full_name`,
      [status]
    );

    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students by status',
      error: error.message,
    });
  }
});

export default router;
