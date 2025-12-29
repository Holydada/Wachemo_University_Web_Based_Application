import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Student: Initiate payment
router.post('/initiate', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { payment_type, amount, description } = req.body;

    const students: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = students[0]?.id;

    const result: any = await query(
      `INSERT INTO payments (student_id, payment_type, amount, description, status, created_at)
       VALUES (?, ?, ?, ?, "pending", NOW())`,
      [studentId, payment_type, amount, description]
    );

    const paymentId = result.insertId;

    // Generate payment reference
    const reference = `WCU${new Date().getFullYear()}${String(paymentId).padStart(6, '0')}`;

    await query('UPDATE payments SET payment_reference = ? WHERE id = ?', [reference, paymentId]);

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        payment_id: paymentId,
        reference,
        amount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error initiating payment',
      error: error.message,
    });
  }
});

// Student: Submit payment proof
router.post('/:paymentId/proof', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { transaction_id, receipt_url, payment_method } = req.body;

    await query(
      `UPDATE payments SET transaction_id = ?, receipt_url = ?, payment_method = ?, 
       status = "verifying", payment_date = NOW() WHERE id = ?`,
      [transaction_id, receipt_url, payment_method, paymentId]
    );

    res.json({
      success: true,
      message: 'Payment proof submitted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting payment proof',
      error: error.message,
    });
  }
});

// Admin: Verify payment
router.put('/:paymentId/verify', authorizeRoles('admin', 'finance'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { status, notes } = req.body; // status: 'completed' or 'rejected'

    await query(
      'UPDATE payments SET status = ?, verified_by = ?, verified_at = NOW(), verification_notes = ? WHERE id = ?',
      [status, req.user?.id, notes, paymentId]
    );

    res.json({
      success: true,
      message: `Payment ${status} successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message,
    });
  }
});

// Get my payments
router.get('/my-payments', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const payments: any = await query(
      `SELECT p.*
       FROM payments p
       JOIN students s ON p.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
});

// Admin: Get all payments
router.get('/all', authorizeRoles('admin', 'finance'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, payment_type } = req.query;

    let sql = `SELECT p.*, s.student_id, u.wcu_id, up.full_name
               FROM payments p
               JOIN students s ON p.student_id = s.id
               JOIN users u ON s.user_id = u.id
               JOIN user_profiles up ON u.id = up.user_id
               WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (payment_type) {
      sql += ' AND p.payment_type = ?';
      params.push(payment_type);
    }

    sql += ' ORDER BY p.created_at DESC';

    const payments = await query(sql, params);

    res.json({
      success: true,
      count: (payments as any[]).length,
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
});

// Get payment statistics
router.get('/stats', authorizeRoles('admin', 'finance'), async (req: Request, res: Response): Promise<void> => {
  try {
    const stats: any = await query(
      `SELECT 
        payment_type,
        COUNT(*) as count,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount
       FROM payments
       GROUP BY payment_type`
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message,
    });
  }
});

export default router;
