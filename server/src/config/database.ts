import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration with optimized settings
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wcu_digital_campus',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20'),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Performance optimizations
  multipleStatements: false, // Security: prevent SQL injection
  dateStrings: false,
  timezone: '+00:00',
  // Connection timeout settings
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000,
  timeout: 60000, // 60 seconds for query execution
  // Character set
  charset: 'utf8mb4',
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established successfully');
    console.log(`📊 Connected to database: ${dbConfig.database}`);
    console.log(`🔗 Connection pool size: ${dbConfig.connectionLimit}`);
    
    // Test query
    const [result] = await connection.execute('SELECT VERSION() as version');
    console.log(`🗄️  MySQL version: ${(result as any)[0].version}`);
    
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Health check function
export async function healthCheck(): Promise<{
  status: string;
  database: string;
  connections: {
    total: number;
    active: number;
    idle: number;
  };
  uptime: number;
}> {
  try {
    const connection = await pool.getConnection();
    
    // Get connection stats
    const [statusResult] = await connection.execute('SHOW STATUS LIKE "Threads_connected"');
    const [uptimeResult] = await connection.execute('SHOW STATUS LIKE "Uptime"');
    
    connection.release();
    
    return {
      status: 'healthy',
      database: dbConfig.database,
      connections: {
        total: dbConfig.connectionLimit,
        active: (statusResult as any)[0]?.Value || 0,
        idle: dbConfig.connectionLimit - ((statusResult as any)[0]?.Value || 0),
      },
      uptime: parseInt((uptimeResult as any)[0]?.Value || '0'),
    };
  } catch (error) {
    throw new Error('Database health check failed');
  }
}

// Execute query helper
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
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

export default pool;