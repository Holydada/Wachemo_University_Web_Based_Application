import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication to all student routes
router.use(authenticateToken);

// Get student profile
router.get('/profile', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const students: any = await query(
      `SELECT u.id, u.wcu_id, u.email, u.role, u.status, u.created_at,
              up.full_name, up.date_of_birth, up.gender, up.phone, up.address, up.photo_url,
              s.student_id, s.department_id, s.program, s.year_level, s.semester, s.enrollment_status
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN students s ON u.id = s.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (students.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
      return;
    }

    res.json({
      success: true,
      data: students[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student profile',
      error: error.message,
    });
  }
});

// Get student courses
router.get('/courses', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const courses: any = await query(
      `SELECT e.id, e.enrollment_date, e.status as enrollment_status,
              c.course_id, c.course_code, c.course_name, c.credits, c.semester,
              d.department_name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN departments d ON c.department_id = d.id
       WHERE e.student_id = (SELECT id FROM students WHERE user_id = ?)
       ORDER BY c.semester DESC, c.course_code`,
      [userId]
    );

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student courses',
      error: error.message,
    });
  }
});

// Get student grades
router.get('/grades', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const grades: any = await query(
      `SELECT g.id, g.grade, g.grade_point, g.letter_grade, g.status, g.recorded_date,
              c.course_code, c.course_name, c.credits, c.semester,
              e.enrollment_date
       FROM grades g
       JOIN enrollments e ON g.enrollment_id = e.id
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = (SELECT id FROM students WHERE user_id = ?)
       ORDER BY c.semester DESC, c.course_code`,
      [userId]
    );

    // Calculate GPA
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade: any) => {
      if (grade.grade_point && grade.credits) {
        totalPoints += grade.grade_point * grade.credits;
        totalCredits += grade.credits;
      }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

    res.json({
      success: true,
      count: grades.length,
      gpa,
      data: grades,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student grades',
      error: error.message,
    });
  }
});

// Update student profile
router.put('/profile', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { phone, address, photo_url } = req.body;

    await query(
      'UPDATE user_profiles SET phone = ?, address = ?, photo_url = ? WHERE user_id = ?',
      [phone, address, photo_url, userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
});

export default router;
