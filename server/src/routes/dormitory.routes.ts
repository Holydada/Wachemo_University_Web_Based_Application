import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Get all dormitory blocks
router.get('/blocks', async (req: Request, res: Response): Promise<void> => {
  try {
    const blocks: any = await query(
      `SELECT db.*, 
              (SELECT COUNT(*) FROM dormitory_rooms WHERE block_id = db.id) as total_rooms,
              (SELECT SUM(capacity) FROM dormitory_rooms WHERE block_id = db.id) as total_capacity,
              (SELECT COUNT(*) FROM dormitory_assignments da 
               JOIN dormitory_rooms dr ON da.room_id = dr.id 
               WHERE dr.block_id = db.id AND da.status = "active") as occupied
       FROM dormitory_blocks db
       ORDER BY db.block_name`
    );

    res.json({
      success: true,
      count: blocks.length,
      data: blocks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dormitory blocks',
      error: error.message,
    });
  }
});

// Get rooms in a block
router.get('/blocks/:blockId/rooms', async (req: Request, res: Response): Promise<void> => {
  try {
    const { blockId } = req.params;

    const rooms: any = await query(
      `SELECT dr.*,
              (SELECT COUNT(*) FROM dormitory_assignments WHERE room_id = dr.id AND status = "active") as occupied
       FROM dormitory_rooms dr
       WHERE dr.block_id = ?
       ORDER BY dr.room_number`,
      [blockId]
    );

    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message,
    });
  }
});

// Admin: Assign student to room
router.post('/assign', authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, room_id, academic_year, semester } = req.body;

    // Check room capacity
    const room: any = await query(
      `SELECT capacity,
              (SELECT COUNT(*) FROM dormitory_assignments WHERE room_id = ? AND status = "active") as occupied
       FROM dormitory_rooms WHERE id = ?`,
      [room_id, room_id]
    );

    if (room[0].occupied >= room[0].capacity) {
      res.status(400).json({
        success: false,
        message: 'Room is full',
      });
      return;
    }

    // Check if student already has assignment
    const existing: any = await query(
      'SELECT id FROM dormitory_assignments WHERE student_id = ? AND status = "active"',
      [student_id]
    );

    if (existing.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Student already has an active room assignment',
      });
      return;
    }

    const result: any = await query(
      `INSERT INTO dormitory_assignments (student_id, room_id, academic_year, semester, 
       assignment_date, status)
       VALUES (?, ?, ?, ?, NOW(), "active")`,
      [student_id, room_id, academic_year, semester]
    );

    res.status(201).json({
      success: true,
      message: 'Student assigned to room successfully',
      data: { assignment_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error assigning student',
      error: error.message,
    });
  }
});

// Student: Get my dormitory assignment
router.get('/my-assignment', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const assignment: any = await query(
      `SELECT da.*, dr.room_number, dr.floor, dr.capacity,
              db.block_name, db.gender_type
       FROM dormitory_assignments da
       JOIN students s ON da.student_id = s.id
       JOIN dormitory_rooms dr ON da.room_id = dr.id
       JOIN dormitory_blocks db ON dr.block_id = db.id
       WHERE s.user_id = ? AND da.status = "active"`,
      [userId]
    );

    res.json({
      success: true,
      data: assignment.length > 0 ? assignment[0] : null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment',
      error: error.message,
    });
  }
});

// Student: Get roommates
router.get('/my-roommates', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Get my room
    const myRoom: any = await query(
      `SELECT da.room_id
       FROM dormitory_assignments da
       JOIN students s ON da.student_id = s.id
       WHERE s.user_id = ? AND da.status = "active"`,
      [userId]
    );

    if (myRoom.length === 0) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const roomId = myRoom[0].room_id;

    // Get roommates
    const roommates: any = await query(
      `SELECT u.wcu_id, up.full_name, up.photo_url, d.department_name, s.year_level
       FROM dormitory_assignments da
       JOIN students s ON da.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE da.room_id = ? AND da.status = "active" AND u.id != ?`,
      [roomId, userId]
    );

    res.json({
      success: true,
      count: roommates.length,
      data: roommates,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roommates',
      error: error.message,
    });
  }
});

// Request clearance for holiday
router.post('/clearance/request', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { items, clearance_type, destination } = req.body;

    const students: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = students[0]?.id;

    const result: any = await query(
      `INSERT INTO dormitory_clearances (student_id, clearance_type, items, destination, 
       request_date, status)
       VALUES (?, ?, ?, ?, NOW(), "pending")`,
      [studentId, clearance_type, JSON.stringify(items), destination]
    );

    res.status(201).json({
      success: true,
      message: 'Clearance request submitted successfully',
      data: { clearance_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error requesting clearance',
      error: error.message,
    });
  }
});

// Admin: Approve clearance
router.put('/clearance/:id/approve', authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    await query(
      'UPDATE dormitory_clearances SET status = "approved", approved_by = ?, approval_date = NOW(), notes = ? WHERE id = ?',
      [req.user?.id, notes, id]
    );

    res.json({
      success: true,
      message: 'Clearance approved successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error approving clearance',
      error: error.message,
    });
  }
});

// Get my clearances
router.get('/my-clearances', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const clearances: any = await query(
      `SELECT dc.*
       FROM dormitory_clearances dc
       JOIN students s ON dc.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY dc.request_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: clearances.length,
      data: clearances,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clearances',
      error: error.message,
    });
  }
});

export default router;
