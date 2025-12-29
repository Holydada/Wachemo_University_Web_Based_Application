import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Get all courses
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { department_id, semester, search } = req.query;

    let sql = `SELECT c.*, d.department_name, d.college,
                      u.wcu_id as instructor_id, up.full_name as instructor_name
               FROM courses c
               JOIN departments d ON c.department_id = d.id
               LEFT JOIN users u ON c.instructor_id = u.id
               LEFT JOIN user_profiles up ON u.id = up.user_id
               WHERE 1=1`;
    const params: any[] = [];

    if (department_id) {
      sql += ' AND c.department_id = ?';
      params.push(department_id);
    }
    if (semester) {
      sql += ' AND c.semester = ?';
      params.push(semester);
    }
    if (search) {
      sql += ' AND (c.course_code LIKE ? OR c.course_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY c.course_code';

    const courses = await query(sql, params);

    res.json({
      success: true,
      count: (courses as any[]).length,
      data: courses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
});

// Get course by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const courses: any = await query(
      `SELECT c.*, d.department_name, d.college,
              u.wcu_id as instructor_id, up.full_name as instructor_name,
              COUNT(e.id) as enrolled_count
       FROM courses c
       JOIN departments d ON c.department_id = d.id
       LEFT JOIN users u ON c.instructor_id = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (courses.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Course not found',
      });
      return;
    }

    res.json({
      success: true,
      data: courses[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message,
    });
  }
});

// Create new course (Admin/Registrar only)
router.post('/', authorizeRoles('admin', 'registrar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      course_code,
      course_name,
      credits,
      department_id,
      semester,
      year_level,
      instructor_id,
      description,
      prerequisites,
    } = req.body;

    const result: any = await query(
      `INSERT INTO courses (course_code, course_name, credits, department_id, semester, year_level, instructor_id, description, prerequisites)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [course_code, course_name, credits, department_id, semester, year_level, instructor_id, description, prerequisites]
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { id: result.insertId, course_code },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
    });
  }
});

// Update course
router.put('/:id', authorizeRoles('admin', 'registrar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      course_name,
      credits,
      semester,
      year_level,
      instructor_id,
      description,
      prerequisites,
    } = req.body;

    await query(
      `UPDATE courses SET course_name = ?, credits = ?, semester = ?, year_level = ?, 
       instructor_id = ?, description = ?, prerequisites = ? WHERE id = ?`,
      [course_name, credits, semester, year_level, instructor_id, description, prerequisites, id]
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message,
    });
  }
});

// Delete course
router.delete('/:id', authorizeRoles('admin', 'registrar'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await query('DELETE FROM courses WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message,
    });
  }
});

// Enroll student in course
router.post('/enroll', authorizeRoles('student', 'registrar', 'admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, course_id } = req.body;

    // Check if already enrolled
    const existing: any = await query(
      'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );

    if (existing.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Student already enrolled in this course',
      });
      return;
    }

    // Check prerequisites
    const course: any = await query(
      'SELECT prerequisites FROM courses WHERE id = ?',
      [course_id]
    );

    if (course[0]?.prerequisites) {
      // TODO: Implement prerequisite checking logic
    }

    const result: any = await query(
      'INSERT INTO enrollments (student_id, course_id, enrollment_date, status) VALUES (?, ?, NOW(), "active")',
      [student_id, course_id]
    );

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: { enrollment_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling student',
      error: error.message,
    });
  }
});

export default router;
