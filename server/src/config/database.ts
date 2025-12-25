import mysql from 'mysql2/promise';
import { createClient } from 'redis';
import { DatabaseConfig } from '@/types';
import logger from '@/utils/logger';

// MySQL Database Configuration
const dbConfig: DatabaseConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'wcu_user',
  password: process.env.DATABASE_PASSWORD || 'wcu_password_2024',
  database: process.env.DATABASE_NAME || 'wcu_digital_campus',
  connectionLimit: 20,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create MySQL connection pool
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  queueLimit: 0,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+03:00', // Ethiopian timezone
  dateStrings: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
  multipleStatements: false,
  namedPlaceholders: true,
});

// Redis Client Configuration
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://:wcu_redis_2024@localhost:6379',
  socket: {
    reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
  },
};

export const redisClient = createClient(redisConfig);

// Database Connection Functions
export async function connectDatabase(): Promise<void> {
  try {
    // Test MySQL connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    logger.info('✅ MySQL database connected successfully');

    // Test Redis connection
    await redisClient.connect();
    logger.info('✅ Redis cache connected successfully');

    // Set up Redis error handling
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis Client Reconnecting...');
    });

  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await pool.end();
    await redisClient.quit();
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database connections:', error);
  }
}

// Database Query Helper Functions
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    logger.error('Database query error:', { query, params, error });
    throw error;
  }
}

export async function executeTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Cache Helper Functions
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error('Cache get error:', { key, error });
    return null;
  }
}

export async function setCache(
  key: string, 
  value: any, 
  ttlSeconds: number = 3600
): Promise<void> {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    logger.error('Cache set error:', { key, error });
  }
}

export async function deleteFromCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Cache delete error:', { key, error });
  }
}

export async function clearCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.error('Cache pattern clear error:', { pattern, error });
  }
}

// Database Health Check
export async function checkDatabaseHealth(): Promise<{
  mysql: boolean;
  redis: boolean;
  details: any;
}> {
  const health = {
    mysql: false,
    redis: false,
    details: {
      mysql: null as any,
      redis: null as any,
    },
  };

  try {
    // Check MySQL
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    connection.release();
    health.mysql = true;
    health.details.mysql = { status: 'connected', test: rows };
  } catch (error) {
    health.details.mysql = { status: 'error', error: error.message };
  }

  try {
    // Check Redis
    const pong = await redisClient.ping();
    health.redis = pong === 'PONG';
    health.details.redis = { status: 'connected', ping: pong };
  } catch (error) {
    health.details.redis = { status: 'error', error: error.message };
  }

  return health;
}

// Database Migration Helper
export async function runMigration(migrationSQL: string): Promise<void> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Split SQL by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await connection.execute(statement);
    }
    
    await connection.commit();
    logger.info('Migration completed successfully');
  } catch (error) {
    await connection.rollback();
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Performance Monitoring
export async function getConnectionStats(): Promise<any> {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        VARIABLE_NAME,
        VARIABLE_VALUE
      FROM INFORMATION_SCHEMA.SESSION_STATUS 
      WHERE VARIABLE_NAME IN (
        'Connections',
        'Threads_connected',
        'Threads_running',
        'Queries',
        'Slow_queries'
      )
    `);
    
    return rows;
  } catch (error) {
    logger.error('Error getting connection stats:', error);
    return null;
  }
}

export default {
  pool,
  redisClient,
  connectDatabase,
  disconnectDatabase,
  executeQuery,
  executeTransaction,
  getFromCache,
  setCache,
  deleteFromCache,
  clearCachePattern,
  checkDatabaseHealth,
  runMigration,
  getConnectionStats,
};