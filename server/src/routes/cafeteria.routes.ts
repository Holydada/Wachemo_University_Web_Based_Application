import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Get weekly menu
router.get('/menu', async (req: Request, res: Response): Promise<void> => {
  try {
    const menu: any = await query(
      `SELECT * FROM cafeteria_menu 
       WHERE week_start_date <= CURDATE() AND week_end_date >= CURDATE()
       ORDER BY day_of_week, meal_type`
    );

    res.json({
      success: true,
      data: menu,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu',
      error: error.message,
    });
  }
});

// Add/Update menu (Admin only)
router.post('/menu', authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { day_of_week, meal_type, meal_name, description, week_start_date, week_end_date } = req.body;

    const result: any = await query(
      `INSERT INTO cafeteria_menu (day_of_week, meal_type, meal_name, description, week_start_date, week_end_date)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE meal_name = ?, description = ?`,
      [day_of_week, meal_type, meal_name, description, week_start_date, week_end_date, meal_name, description]
    );

    res.json({
      success: true,
      message: 'Menu updated successfully',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu',
      error: error.message,
    });
  }
});

// Get student cafeteria status
router.get('/my-status', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const status: any = await query(
      `SELECT cs.*, s.student_id
       FROM cafeteria_subscriptions cs
       JOIN students s ON cs.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY cs.academic_year DESC, cs.semester DESC
       LIMIT 1`,
      [userId]
    );

    res.json({
      success: true,
      data: status.length > 0 ? status[0] : null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cafeteria status',
      error: error.message,
    });
  }
});

// Register cafeteria preference
router.post('/register', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { subscription_type, academic_year, semester, bank_account } = req.body;

    // Get student ID
    const students: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = students[0]?.id;

    const result: any = await query(
      `INSERT INTO cafeteria_subscriptions (student_id, subscription_type, academic_year, semester, bank_account, status)
       VALUES (?, ?, ?, ?, ?, "active")
       ON DUPLICATE KEY UPDATE subscription_type = ?, bank_account = ?, status = "active"`,
      [studentId, subscription_type, academic_year, semester, bank_account, subscription_type, bank_account]
    );

    res.json({
      success: true,
      message: 'Cafeteria preference registered successfully',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering preference',
      error: error.message,
    });
  }
});

// Record meal consumption
router.post('/consume', authorizeRoles('admin', 'cafeteria_staff'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_wcu_id, meal_type } = req.body;

    // Get student
    const students: any = await query(
      'SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.wcu_id = ?',
      [student_wcu_id]
    );

    if (students.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    const studentId = students[0].id;

    // Check subscription
    const subscription: any = await query(
      `SELECT subscription_type FROM cafeteria_subscriptions 
       WHERE student_id = ? AND status = "active"
       ORDER BY academic_year DESC, semester DESC LIMIT 1`,
      [studentId]
    );

    if (subscription.length === 0 || subscription[0].subscription_type !== 'cafeteria') {
      res.status(403).json({
        success: false,
        message: 'Student not subscribed to cafeteria service',
      });
      return;
    }

    // Record consumption
    await query(
      'INSERT INTO cafeteria_consumption (student_id, meal_type, consumption_date, recorded_by) VALUES (?, ?, NOW(), ?)',
      [studentId, meal_type, req.user?.id]
    );

    res.json({
      success: true,
      message: 'Meal consumption recorded',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error recording consumption',
      error: error.message,
    });
  }
});

// Get consumption history
router.get('/my-consumption', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const consumption: any = await query(
      `SELECT cc.*, DATE_FORMAT(cc.consumption_date, '%Y-%m-%d %H:%i') as consumed_at
       FROM cafeteria_consumption cc
       JOIN students s ON cc.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY cc.consumption_date DESC
       LIMIT 100`,
      [userId]
    );

    res.json({
      success: true,
      count: consumption.length,
      data: consumption,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching consumption history',
      error: error.message,
    });
  }
});

// Cost sharing agreement
router.post('/cost-sharing', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { academic_year, semester, services, total_amount, agreement_accepted } = req.body;

    const students: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = students[0]?.id;

    const result: any = await query(
      `INSERT INTO cost_sharing_agreements (student_id, academic_year, semester, services, total_amount, 
       agreement_accepted, signed_date, status)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), "active")`,
      [studentId, academic_year, semester, JSON.stringify(services), total_amount, agreement_accepted]
    );

    res.status(201).json({
      success: true,
      message: 'Cost sharing agreement signed successfully',
      data: { agreement_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error signing agreement',
      error: error.message,
    });
  }
});

// Get my cost sharing agreements
router.get('/my-agreements', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const agreements: any = await query(
      `SELECT csa.*
       FROM cost_sharing_agreements csa
       JOIN students s ON csa.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY csa.academic_year DESC, csa.semester DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: agreements.length,
      data: agreements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agreements',
      error: error.message,
    });
  }
});

export default router;
