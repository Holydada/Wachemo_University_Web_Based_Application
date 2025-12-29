import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Get all news (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, visibility, search } = req.query;
    const userRole = req.user?.role || 'public';

    let sql = `SELECT n.*, u.wcu_id as author_id, up.full_name as author_name
               FROM news n
               JOIN users u ON n.created_by = u.id
               JOIN user_profiles up ON u.id = up.user_id
               WHERE n.status = "published"`;
    const params: any[] = [];

    // Filter by visibility based on user role
    if (userRole === 'public') {
      sql += ' AND n.visibility = "all"';
    } else if (userRole === 'student') {
      sql += ' AND n.visibility IN ("all", "students")';
    } else if (userRole === 'faculty') {
      sql += ' AND n.visibility IN ("all", "faculty", "staff")';
    }
    // Admin can see all

    if (category) {
      sql += ' AND n.category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (n.title LIKE ? OR n.content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY n.published_date DESC LIMIT 50';

    const news = await query(sql, params);

    res.json({
      success: true,
      count: (news as any[]).length,
      data: news,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message,
    });
  }
});

// Get news by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const newsItems: any = await query(
      `SELECT n.*, u.wcu_id as author_id, up.full_name as author_name
       FROM news n
       JOIN users u ON n.created_by = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE n.id = ?`,
      [id]
    );

    if (newsItems.length === 0) {
      res.status(404).json({
        success: false,
        message: 'News not found',
      });
      return;
    }

    // Increment view count
    await query('UPDATE news SET views = views + 1 WHERE id = ?', [id]);

    res.json({
      success: true,
      data: newsItems[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message,
    });
  }
});

// Create news (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      content,
      category,
      visibility,
      featured_image,
      attachments,
      tags,
      status,
    } = req.body;

    const result: any = await query(
      `INSERT INTO news (title, content, category, visibility, featured_image, attachments, tags, 
       created_by, status, published_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        content,
        category,
        visibility,
        featured_image,
        JSON.stringify(attachments),
        JSON.stringify(tags),
        req.user?.id,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: { news_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: error.message,
    });
  }
});

// Update news
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      category,
      visibility,
      featured_image,
      attachments,
      tags,
      status,
    } = req.body;

    await query(
      `UPDATE news SET title = ?, content = ?, category = ?, visibility = ?, featured_image = ?,
       attachments = ?, tags = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        content,
        category,
        visibility,
        featured_image,
        JSON.stringify(attachments),
        JSON.stringify(tags),
        status,
        id,
      ]
    );

    res.json({
      success: true,
      message: 'News updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: error.message,
    });
  }
});

// Delete news
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await query('DELETE FROM news WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message,
    });
  }
});

// Get featured news
router.get('/featured/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const featured: any = await query(
      `SELECT n.*, u.wcu_id as author_id, up.full_name as author_name
       FROM news n
       JOIN users u ON n.created_by = u.id
       JOIN user_profiles up ON u.id = up.user_id
       WHERE n.status = "published" AND n.is_featured = 1
       ORDER BY n.published_date DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      count: featured.length,
      data: featured,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured news',
      error: error.message,
    });
  }
});

export default router;
