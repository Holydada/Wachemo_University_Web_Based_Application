import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

// Public: Submit partnership request
router.post('/request', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      website,
      partnership_type,
      message,
      proposed_benefits,
    } = req.body;

    const result: any = await query(
      `INSERT INTO partnership_requests (company_name, contact_person, email, phone, website,
       partnership_type, message, proposed_benefits, status, submitted_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())`,
      [company_name, contact_person, email, phone, website, partnership_type, message, proposed_benefits]
    );

    res.status(201).json({
      success: true,
      message: 'Partnership request submitted successfully',
      data: { request_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error submitting partnership request',
      error: error.message,
    });
  }
});

// Admin: Get all partnership requests
router.get('/requests', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    let sql = 'SELECT * FROM partnership_requests WHERE 1=1';
    const params: any[] = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY submitted_date DESC';

    const requests = await query(sql, params);

    res.json({
      success: true,
      count: (requests as any[]).length,
      data: requests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching partnership requests',
      error: error.message,
    });
  }
});

// Admin: Update partnership request status
router.put('/requests/:id', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, admin_response, admin_notes } = req.body;

    await query(
      `UPDATE partnership_requests SET status = ?, admin_response = ?, admin_notes = ?,
       reviewed_by = ?, reviewed_date = NOW() WHERE id = ?`,
      [status, admin_response, admin_notes, req.user?.id, id]
    );

    res.json({
      success: true,
      message: 'Partnership request updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating partnership request',
      error: error.message,
    });
  }
});

// Admin: Add active partner
router.post('/partners', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company_name,
      logo_url,
      website,
      partnership_type,
      start_date,
      description,
      is_featured,
    } = req.body;

    const result: any = await query(
      `INSERT INTO partners (company_name, logo_url, website, partnership_type, start_date,
       description, is_featured, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, "active")`,
      [company_name, logo_url, website, partnership_type, start_date, description, is_featured]
    );

    res.status(201).json({
      success: true,
      message: 'Partner added successfully',
      data: { partner_id: result.insertId },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding partner',
      error: error.message,
    });
  }
});

// Public: Get active partners
router.get('/partners', async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured_only } = req.query;

    let sql = 'SELECT * FROM partners WHERE status = "active"';

    if (featured_only === 'true') {
      sql += ' AND is_featured = 1';
    }

    sql += ' ORDER BY company_name';

    const partners = await query(sql);

    res.json({
      success: true,
      count: (partners as any[]).length,
      data: partners,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching partners',
      error: error.message,
    });
  }
});

// Admin: Update partner
router.put('/partners/:id', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      company_name,
      logo_url,
      website,
      partnership_type,
      description,
      is_featured,
      status,
    } = req.body;

    await query(
      `UPDATE partners SET company_name = ?, logo_url = ?, website = ?, partnership_type = ?,
       description = ?, is_featured = ?, status = ? WHERE id = ?`,
      [company_name, logo_url, website, partnership_type, description, is_featured, status, id]
    );

    res.json({
      success: true,
      message: 'Partner updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating partner',
      error: error.message,
    });
  }
});

// Admin: Delete partner
router.delete('/partners/:id', authenticateToken, authorizeRoles('admin'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await query('DELETE FROM partners WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Partner deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting partner',
      error: error.message,
    });
  }
});

export default router;
