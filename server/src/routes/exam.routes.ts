import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Faculty: Create exam
router.post('/create', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      course_id,
      exam_title,
      exam_type,
      start_time,
      duration_minutes,
      total_marks,
      passing_marks,
      instructions,
      proctoring_enabled,
      allow_tab_switch,
      max_attempts,
    } = req.body;

    const result: any = await query(
      `INSERT INTO exams (course_id, created_by, exam_title, exam_type, start_time, duration_minutes,
       total_marks, passing_marks, instructions, proctoring_enabled, allow_tab_switch, max_attempts, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "draft")`,
      [
        course_id,
        req.user?.id,
        exam_title,
        exam_type,
        start_time,
        duration_minutes,
        total_marks,
        passing_marks,
        instructions,
        proctoring_enabled,
        allow_tab_switch,
        max_attempts,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: { exam_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating exam',
      error: error.message,
    });
  }
});

// Faculty: Add question to exam
router.post('/questions', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      exam_id,
      question_type,
      question_text,
      options,
      correct_answer,
      marks,
      order_number,
    } = req.body;

    const result: any = await query(
      `INSERT INTO exam_questions (exam_id, question_type, question_text, options, correct_answer, marks, order_number)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [exam_id, question_type, question_text, JSON.stringify(options), correct_answer, marks, order_number]
    );

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: { question_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding question',
      error: error.message,
    });
  }
});

// Faculty: Publish exam
router.put('/:examId/publish', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;

    await query('UPDATE exams SET status = "published" WHERE id = ? AND created_by = ?', [examId, req.user?.id]);

    res.json({
      success: true,
      message: 'Exam published successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error publishing exam',
      error: error.message,
    });
  }
});

// Student: Get available exams
router.get('/available', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const exams: any = await query(
      `SELECT e.*, c.course_code, c.course_name,
              (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.student_id = 
               (SELECT id FROM students WHERE user_id = ?)) as attempts_taken
       FROM exams e
       JOIN courses c ON e.course_id = c.id
       JOIN enrollments en ON c.id = en.course_id
       WHERE en.student_id = (SELECT id FROM students WHERE user_id = ?)
       AND e.status = "published"
       AND e.start_time <= NOW()
       ORDER BY e.start_time DESC`,
      [userId, userId]
    );

    res.json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available exams',
      error: error.message,
    });
  }
});

// Student: Start exam
router.post('/:examId/start', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const userId = req.user?.id;

    // Get student ID
    const studentData: any = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    const studentId = studentData[0]?.id;

    // Check attempts
    const attempts: any = await query(
      'SELECT COUNT(*) as count FROM exam_attempts WHERE exam_id = ? AND student_id = ?',
      [examId, studentId]
    );

    const exam: any = await query('SELECT max_attempts FROM exams WHERE id = ?', [examId]);

    if (attempts[0].count >= exam[0].max_attempts) {
      res.status(400).json({
        success: false,
        message: 'Maximum attempts reached',
      });
      return;
    }

    // Create attempt
    const result: any = await query(
      'INSERT INTO exam_attempts (exam_id, student_id, start_time, status) VALUES (?, ?, NOW(), "in_progress")',
      [examId, studentId]
    );

    // Get questions
    const questions: any = await query(
      'SELECT id, question_type, question_text, options, marks, order_number FROM exam_questions WHERE exam_id = ? ORDER BY order_number',
      [examId]
    );

    res.json({
      success: true,
      data: {
        attempt_id: result.insertId,
        questions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error starting exam',
      error: error.message,
    });
  }
});

// Student: Save answer (autosave)
router.post('/answers/save', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { attempt_id, question_id, answer } = req.body;

    // Check if answer exists
    const existing: any = await query(
      'SELECT id FROM exam_answers WHERE attempt_id = ? AND question_id = ?',
      [attempt_id, question_id]
    );

    if (existing.length > 0) {
      await query(
        'UPDATE exam_answers SET answer = ?, saved_at = NOW() WHERE attempt_id = ? AND question_id = ?',
        [answer, attempt_id, question_id]
      );
    } else {
      await query(
        'INSERT INTO exam_answers (attempt_id, question_id, answer, saved_at) VALUES (?, ?, ?, NOW())',
        [attempt_id, question_id, answer]
      );
    }

    res.json({
      success: true,
      message: 'Answer saved',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error saving answer',
      error: error.message,
    });
  }
});

// Student: Submit exam
router.post('/:attemptId/submit', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { attemptId } = req.params;

    await query(
      'UPDATE exam_attempts SET end_time = NOW(), status = "submitted" WHERE id = ?',
      [attemptId]
    );

    // Auto-grade objective questions
    const answers: any = await query(
      `SELECT ea.*, eq.correct_answer, eq.marks
       FROM exam_answers ea
       JOIN exam_questions eq ON ea.question_id = eq.id
       WHERE ea.attempt_id = ? AND eq.question_type IN ("mcq", "true_false")`,
      [attemptId]
    );

    let totalScore = 0;
    for (const answer of answers) {
      if (answer.answer === answer.correct_answer) {
        totalScore += answer.marks;
        await query('UPDATE exam_answers SET is_correct = 1, marks_obtained = ? WHERE id = ?', [
          answer.marks,
          answer.id,
        ]);
      } else {
        await query('UPDATE exam_answers SET is_correct = 0, marks_obtained = 0 WHERE id = ?', [answer.id]);
      }
    }

    await query('UPDATE exam_attempts SET score = ? WHERE id = ?', [totalScore, attemptId]);

    res.json({
      success: true,
      message: 'Exam submitted successfully',
      data: { score: totalScore },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting exam',
      error: error.message,
    });
  }
});

// Faculty: Get exam results
router.get('/:examId/results', authorizeRoles('faculty'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;

    const results: any = await query(
      `SELECT ea.*, s.student_id, u.wcu_id, up.full_name,
              e.total_marks, e.passing_marks
       FROM exam_attempts ea
       JOIN students s ON ea.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       JOIN exams e ON ea.exam_id = e.id
       WHERE ea.exam_id = ?
       ORDER BY ea.score DESC`,
      [examId]
    );

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exam results',
      error: error.message,
    });
  }
});

// Log security violation
router.post('/violations', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { attempt_id, violation_type, details } = req.body;

    await query(
      'INSERT INTO exam_violations (attempt_id, violation_type, details, detected_at) VALUES (?, ?, ?, NOW())',
      [attempt_id, violation_type, details]
    );

    res.json({
      success: true,
      message: 'Violation logged',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error logging violation',
      error: error.message,
    });
  }
});

export default router;
