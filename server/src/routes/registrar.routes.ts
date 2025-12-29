import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles('registrar', 'admin'));

// Get all student registrations
router.get('/registrations', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, semester, year_level, department_id } = req.query;

    let sql = `SELECT s.*, u.wcu_id, u.email, up.full_name, up.photo_url,
                      d.department_name, d.college
               FROM students s
               JOIN users u ON s.user_id = u.id
               JOIN user_profiles up ON u.id = up.user_id
               LEFT JOIN departments d ON s.department_id = d.id
               WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      sql += ' AND s.enrollment_status = ?';
      params.push(status);
    }
    if (semester) {
      sql += ' AND s.semester = ?';
      params.push(semester);
    }
    if (year_level) {
      sql += ' AND s.year_level = ?';
      params.push(year_level);
    }
    if (department_id) {
      sql += ' AND s.department_id = ?';
      params.push(department_id);
    }

    sql += ' ORDER BY s.created_at DESC';

    const registrations = await query(sql, params);

    res.json({
      success: true,
      count: (registrations as any[]).length,
      data: registrations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations',
      error: error.message,
    });
  }
});

// Register new student
router.post('/register-student', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      wcu_id,
      email,
      full_name,
      date_of_birth,
      gender,
      phone,
      address,
      department_id,
      program,
      year_level,
      semester,
      grade_8_doc,
      grade_12_transcript,
      national_exam_result,
    } = req.body;

    // Create user account
    const userResult: any = await query(
      'INSERT INTO users (wcu_id, email, password_hash, role, status) VALUES (?, ?, ?, "student", "active")',
      [wcu_id, email, 'temp_password_hash']
    );

    const userId = userResult.insertId;

    // Create user profile
    await query(
      'INSERT INTO user_profiles (user_id, full_name, date_of_birth, gender, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, full_name, date_of_birth, gender, phone, address]
    );

    // Create student record
    const studentResult: any = await query(
      `INSERT INTO students (user_id, student_id, department_id, program, year_level, semester, enrollment_status)
       VALUES (?, ?, ?, ?, ?, ?, "active")`,
      [userId, wcu_id, department_id, program, year_level, semester]
    );

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: studentResult.insertId,
        wcu_id,
        user_id: userId,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message,
    });
  }
});

// Approve grade submission
router.post('/approve-grade', async (req: Request, res: Response): Promise<void> => {
  try {
    const { grade_id, approval_status, comments } = req.body;

    await query(
      'UPDATE grades SET status = ?, approval_comments = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
      [approval_status, comments, req.user?.id, grade_id]
    );

    res.json({
      success: true,
      message: 'Grade approval updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error approving grade',
      error: error.message,
    });
  }
});

// Generate registration slip
router.get('/registration-slip/:studentId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const studentData: any = await query(
      `SELECT s.*, u.wcu_id, up.full_name, d.department_name, d.college
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       JOIN departments d ON s.department_id = d.id
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

    // Get enrolled courses
    const courses: any = await query(
      `SELECT c.course_code, c.course_name, c.credits
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = ? AND e.status = "active"`,
      [studentId]
    );

    res.json({
      success: true,
      data: {
        student: studentData[0],
        courses,
        slip_generated_at: new Date(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error generating registration slip',
      error: error.message,
    });
  }
});

// Get pending grade approvals
router.get('/pending-grades', async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingGrades: any = await query(
      `SELECT g.*, e.student_id, c.course_code, c.course_name,
              u.wcu_id, up.full_name as student_name,
              fu.wcu_id as faculty_id, fup.full_name as faculty_name
       FROM grades g
       JOIN enrollments e ON g.enrollment_id = e.id
       JOIN courses c ON e.course_id = c.id
       JOIN students s ON e.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       JOIN users fu ON c.instructor_id = fu.id
       JOIN user_profiles fup ON fu.id = fup.user_id
       WHERE g.status = "pending"
       ORDER BY g.recorded_date DESC`
    );

    res.json({
      success: true,
      count: pendingGrades.length,
      data: pendingGrades,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending grades',
      error: error.message,
    });
  }
});

export default router;
