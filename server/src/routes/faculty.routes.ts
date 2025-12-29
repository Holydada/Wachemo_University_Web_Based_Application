import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Get faculty profile
router.get('/profile', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const faculty: any = await query(
      `SELECT u.id, u.wcu_id, u.email, u.role, u.status,
              up.full_name, up.date_of_birth, up.gender, up.phone, up.address, up.photo_url
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (faculty.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Faculty profile not found',
      });
      return;
    }

    res.json({
      success: true,
      data: faculty[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty profile',
      error: error.message,
    });
  }
});

// Get faculty courses
router.get('/courses', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const courses: any = await query(
      `SELECT c.id, c.course_code, c.course_name, c.credits, c.semester,
              d.department_name,
              COUNT(e.id) as enrolled_students
       FROM courses c
       JOIN departments d ON c.department_id = d.id
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = ?
       GROUP BY c.id
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
      message: 'Error fetching faculty courses',
      error: error.message,
    });
  }
});

// Get students in a course
router.get('/courses/:courseId/students', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    // Verify faculty teaches this course
    const courseCheck: any = await query(
      'SELECT id FROM courses WHERE id = ? AND instructor_id = ?',
      [courseId, userId]
    );

    if (courseCheck.length === 0) {
      res.status(403).json({
        success: false,
        message: 'You do not have access to this course',
      });
      return;
    }

    const students: any = await query(
      `SELECT s.student_id, u.wcu_id, up.full_name, up.photo_url,
              e.id as enrollment_id, e.enrollment_date, e.status,
              g.grade, g.letter_grade, g.grade_point
       FROM enrollments e
       JOIN students s ON e.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN grades g ON e.id = g.enrollment_id
       WHERE e.course_id = ?
       ORDER BY up.full_name`,
      [courseId]
    );

    res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course students',
      error: error.message,
    });
  }
});

// Submit/Update grade
router.post('/grades', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { enrollment_id, grade, letter_grade, grade_point } = req.body;

    // Verify faculty teaches this course
    const enrollmentCheck: any = await query(
      `SELECT e.id, c.instructor_id
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.id = ? AND c.instructor_id = ?`,
      [enrollment_id, userId]
    );

    if (enrollmentCheck.length === 0) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to grade this enrollment',
      });
      return;
    }

    // Check if grade exists
    const existingGrade: any = await query(
      'SELECT id FROM grades WHERE enrollment_id = ?',
      [enrollment_id]
    );

    if (existingGrade.length > 0) {
      // Update existing grade
      await query(
        'UPDATE grades SET grade = ?, letter_grade = ?, grade_point = ?, status = "final" WHERE enrollment_id = ?',
        [grade, letter_grade, grade_point, enrollment_id]
      );
    } else {
      // Insert new grade
      await query(
        'INSERT INTO grades (enrollment_id, grade, letter_grade, grade_point, status) VALUES (?, ?, ?, ?, "final")',
        [enrollment_id, grade, letter_grade, grade_point]
      );
    }

    res.json({
      success: true,
      message: 'Grade submitted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting grade',
      error: error.message,
    });
  }
});

export default router;
