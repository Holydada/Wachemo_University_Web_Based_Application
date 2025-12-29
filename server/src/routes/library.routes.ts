import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

// Get all books
router.get('/books', async (req: Request, res: Response): Promise<void> => {
  try {
    const { library_type, category, search, available_only } = req.query;

    let sql = `SELECT * FROM library_books WHERE 1=1`;
    const params: any[] = [];

    if (library_type) {
      sql += ' AND library_type = ?';
      params.push(library_type);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (available_only === 'true') {
      sql += ' AND available_copies > 0';
    }

    sql += ' ORDER BY title';

    const books = await query(sql, params);

    res.json({
      success: true,
      count: (books as any[]).length,
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message,
    });
  }
});

// Add new book (Librarian/Admin only)
router.post('/books', authorizeRoles('admin', 'librarian'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      publication_year,
      category,
      library_type,
      total_copies,
      available_copies,
      shelf_location,
    } = req.body;

    const result: any = await query(
      `INSERT INTO library_books (title, author, isbn, publisher, publication_year, category, 
       library_type, total_copies, available_copies, shelf_location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, publisher, publication_year, category, library_type, total_copies, available_copies, shelf_location]
    );

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: { book_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding book',
      error: error.message,
    });
  }
});

// Borrow book
router.post('/borrow', authorizeRoles('student', 'faculty', 'librarian'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { book_id, student_wcu_id, due_date } = req.body;

    // Get student info
    const students: any = await query(
      'SELECT s.id, u.wcu_id, up.full_name FROM students s JOIN users u ON s.user_id = u.id JOIN user_profiles up ON u.id = up.user_id WHERE u.wcu_id = ?',
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

    // Check book availability
    const books: any = await query('SELECT available_copies FROM library_books WHERE id = ?', [book_id]);

    if (books.length === 0 || books[0].available_copies <= 0) {
      res.status(400).json({
        success: false,
        message: 'Book not available',
      });
      return;
    }

    // Create borrow record
    const result: any = await query(
      `INSERT INTO library_borrows (book_id, student_id, borrowed_by, borrow_date, due_date, status)
       VALUES (?, ?, ?, NOW(), ?, "borrowed")`,
      [book_id, studentId, req.user?.id, due_date]
    );

    // Update available copies
    await query('UPDATE library_books SET available_copies = available_copies - 1 WHERE id = ?', [book_id]);

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: { borrow_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error borrowing book',
      error: error.message,
    });
  }
});

// Return book
router.post('/return', authorizeRoles('librarian', 'admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { borrow_id } = req.body;

    // Get borrow record
    const borrows: any = await query('SELECT book_id FROM library_borrows WHERE id = ?', [borrow_id]);

    if (borrows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Borrow record not found',
      });
      return;
    }

    const bookId = borrows[0].book_id;

    // Update borrow record
    await query(
      'UPDATE library_borrows SET return_date = NOW(), status = "returned" WHERE id = ?',
      [borrow_id]
    );

    // Update available copies
    await query('UPDATE library_books SET available_copies = available_copies + 1 WHERE id = ?', [bookId]);

    res.json({
      success: true,
      message: 'Book returned successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error returning book',
      error: error.message,
    });
  }
});

// Get borrowed books by student
router.get('/my-books', authorizeRoles('student'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const books: any = await query(
      `SELECT lb.*, b.title, b.author, b.isbn, lb.borrow_date, lb.due_date, lb.status
       FROM library_borrows lb
       JOIN library_books b ON lb.book_id = b.id
       JOIN students s ON lb.student_id = s.id
       WHERE s.user_id = ?
       ORDER BY lb.borrow_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching borrowed books',
      error: error.message,
    });
  }
});

// Get all active borrows (Librarian)
router.get('/active-borrows', authorizeRoles('librarian', 'admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const borrows: any = await query(
      `SELECT lb.*, b.title, b.author, s.student_id, u.wcu_id, up.full_name
       FROM library_borrows lb
       JOIN library_books b ON lb.book_id = b.id
       JOIN students s ON lb.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE lb.status = "borrowed"
       ORDER BY lb.due_date ASC`
    );

    res.json({
      success: true,
      count: borrows.length,
      data: borrows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active borrows',
      error: error.message,
    });
  }
});

// Get overdue books
router.get('/overdue', authorizeRoles('librarian', 'admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const overdue: any = await query(
      `SELECT lb.*, b.title, b.author, s.student_id, u.wcu_id, up.full_name, up.phone,
              DATEDIFF(NOW(), lb.due_date) as days_overdue
       FROM library_borrows lb
       JOIN library_books b ON lb.book_id = b.id
       JOIN students s ON lb.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE lb.status = "borrowed" AND lb.due_date < NOW()
       ORDER BY days_overdue DESC`
    );

    res.json({
      success: true,
      count: overdue.length,
      data: overdue,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue books',
      error: error.message,
    });
  }
});

export default router;
