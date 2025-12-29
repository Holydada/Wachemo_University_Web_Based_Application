import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Student: Request ID card
router.post('/request', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { photo_url, request_type } = req.body; // request_type: 'new' or 'replacement'

    const students: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = students[0]?.id;

    // Check if already has active request
    const existing: any = await query(
      'SELECT id FROM student_id_requests WHERE student_id = ? AND status = "pending"',
      [studentId]
    );

    if (existing.length > 0) {
      res.status(400).json({
        success: false,
        message: 'You already have a pending ID request',
      });
      return;
    }

    const result: any = await query(
      `INSERT INTO student_id_requests (student_id, request_type, photo_url, status, request_date)
       VALUES (?, ?, ?, "pending", NOW())`,
      [studentId, request_type, photo_url]
    );

    res.status(201).json({
      success: true,
      message: 'ID card request submitted successfully',
      data: { request_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting ID request',
      error: error.message,
    });
  }
});

// Student: Request replacement with penalty payment
router.post('/request-replacement', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { photo_url, payment_receipt, reason } = req.body;

    const students: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = students[0]?.id;

    const result: any = await query(
      `INSERT INTO student_id_requests (student_id, request_type, photo_url, payment_receipt, 
       reason, status, request_date)
       VALUES (?, "replacement", ?, ?, ?, "pending", NOW())`,
      [studentId, photo_url, payment_receipt, reason]
    );

    res.status(201).json({
      success: true,
      message: 'Replacement request submitted successfully',
      data: { request_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting replacement request',
      error: error.message,
    });
  }
});

// Admin: Get all ID requests
router.get('/requests', authorizeRoles('admin', 'registrar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    let sql = `SELECT sir.*, s.student_id, u.wcu_id, up.full_name, up.gender,
                      d.department_name, d.college
               FROM student_id_requests sir
               JOIN students s ON sir.student_id = s.id
               JOIN users u ON s.user_id = u.id
               JOIN user_profiles up ON u.id = up.user_id
               LEFT JOIN departments d ON s.department_id = d.id
               WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      sql += ' AND sir.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY sir.request_date DESC';

    const requests = await query(sql, params);

    res.json({
      success: true,
      count: (requests as any[]).length,
      data: requests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ID requests',
      error: error.message,
    });
  }
});

// Admin: Approve/Reject ID request
router.put('/requests/:id', authorizeRoles('admin', 'registrar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    await query(
      'UPDATE student_id_requests SET status = ?, rejection_reason = ?, processed_by = ?, processed_date = NOW() WHERE id = ?',
      [status, rejection_reason, req.user?.id, id]
    );

    // If approved and it's a replacement, revoke old ID
    if (status === 'approved') {
      const request: any = await query('SELECT student_id, request_type FROM student_id_requests WHERE id = ?', [id]);
      
      if (request[0]?.request_type === 'replacement') {
        await query(
          'UPDATE student_id_cards SET status = "revoked", revoked_date = NOW() WHERE student_id = ? AND status = "active"',
          [request[0].student_id]
        );
      }

      // Create new ID card record
      await query(
        'INSERT INTO student_id_cards (student_id, issue_date, status) VALUES (?, NOW(), "active")',
        [request[0].student_id]
      );
    }

    res.json({
      success: true,
      message: `ID request ${status} successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error processing ID request',
      error: error.message,
    });
  }
});

// Admin: Print ID card data
router.get('/print/:studentId', authorizeRoles('admin', 'registrar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const studentData: any = await query(
      `SELECT s.*, u.wcu_id, u.email, up.full_name, up.gender, up.photo_url,
              d.department_name, d.college, s.year_level, s.semester
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = ?`,
      [studentId]
    );

    if (studentData.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    // Generate QR code data
    const qrData = {
      wcu_id: studentData[0].wcu_id,
      name: studentData[0].full_name,
      department: studentData[0].department_name,
      college: studentData[0].college,
    };

    res.json({
      success: true,
      data: {
        ...studentData[0],
        qr_code_data: JSON.stringify(qrData),
        print_date: new Date(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching print data',
      error: error.message,
    });
  }
});

// Student: Get my ID card status
router.get('/my-card', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const cards: any = await query(
      `SELECT sic.*
       FROM student_id_cards sic
       JOIN students s ON sic.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY sic.issue_date DESC
       LIMIT 1`,
      [userId]
    );

    res.json({
      success: true,
      data: cards.length > 0 ? cards[0] : null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ID card status',
      error: error.message,
    });
  }
});

// Revoke ID card (Admin - for lost/stolen cards)
router.post('/revoke', authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { card_id, reason } = req.body;

    await query(
      'UPDATE student_id_cards SET status = "revoked", revoked_date = NOW(), revoke_reason = ? WHERE id = ?',
      [reason, card_id]
    );

    res.json({
      success: true,
      message: 'ID card revoked successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error revoking ID card',
      error: error.message,
    });
  }
});

export default router;
