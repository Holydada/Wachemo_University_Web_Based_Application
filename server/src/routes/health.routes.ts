import { Router, Request, Response } from 'express';
import { query, healthCheck } from '../config/database';

const router = Router();

// Comprehensive health check
router.get('/health', async (req: Request, res: Response): Promise<void> => {
  try {
    const dbHealth = await healthCheck();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth.status,
        api: 'healthy'
      },
      database: {
        name: dbHealth.database,
        connections: dbHealth.connections,
        uptime: dbHealth.uptime
      },
      system: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB'
        },
        cpu: {
          usage: process.cpuUsage()
        }
      }
    };

    res.status(200).json(health);
  } catch (error) {
    const health = {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'unhealthy',
        api: 'healthy'
      },
      system: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB'
        }
      }
    };
    
    res.status(503).json(health);
  }
});

// Readiness probe (for Kubernetes/Docker)
router.get('/health/ready', async (req: Request, res: Response): Promise<void> => {
  try {
    await query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: 'Database not ready' });
  }
});

// Liveness probe (for Kubernetes/Docker)
router.get('/health/live', (req: Request, res: Response): void => {
  res.status(200).json({ alive: true, timestamp: new Date().toISOString() });
});

// Detailed system metrics
router.get('/health/metrics', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get database stats
    const dbStats: any = await query('SHOW STATUS LIKE "Threads_connected"');
    const dbVersion: any = await query('SELECT VERSION() as version');
    
    // Get table counts
    const userCount: any = await query('SELECT COUNT(*) as count FROM users');
    const studentCount: any = await query('SELECT COUNT(*) as count FROM students');
    const courseCount: any = await query('SELECT COUNT(*) as count FROM courses');
    
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        version: dbVersion[0]?.version,
        connections: dbStats[0]?.Value,
        tables: {
          users: userCount[0]?.count,
          students: studentCount[0]?.count,
          courses: courseCount[0]?.count
        }
      },
      system: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };
    
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching metrics',
      error: error.message
    });
  }
});

export default router;
