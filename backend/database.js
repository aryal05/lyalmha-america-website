import pkg from 'pg';
import dns from 'dns';

const { Pool } = pkg;

// Force IPv4 lookups
dns.setDefaultResultOrder('ipv4first');

let db = null;

export async function initializeDatabase() {
  if (db) return db;

  // Require DATABASE_URL for production
  if (!process.env.DATABASE_URL) {
    const error = new Error(
      '❌ DATABASE_URL environment variable is required. ' +
      'Please set up Supabase or Vercel Postgres and add the connection string to your environment variables.'
    );
    console.error(error.message);
    throw error;
  }

  console.log('🔗 Connecting to PostgreSQL...');
  
  // Clean up the DATABASE_URL (remove any trailing whitespace/newlines)
  const connectionUrl = process.env.DATABASE_URL.trim();
  
  // Parse to extract connection parameters
  let poolConfig;
  try {
    const url = new URL(connectionUrl);
    console.log('Database Host:', url.hostname);
    console.log('Database Port:', url.port || '5432');
    
    // Use individual parameters for better compatibility with serverless
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1), // Remove leading /
      ssl: {
        rejectUnauthorized: false
      },
      // Connection pool settings for serverless
      max: 5, // Reduced for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  } catch (e) {
    console.log('Error parsing DATABASE_URL, falling back to connection string');
    poolConfig = {
      connectionString: connectionUrl,
      ssl: {
        rejectUnauthorized: false
      },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }

  // Connect to Supabase PostgreSQL
  const pool = new Pool(poolConfig);
  
  // Handle pool errors to prevent process crashes
  pool.on('error', (err) => {
    console.error('⚠️ Unexpected PostgreSQL pool error:', err.message);
    // Don't crash - the pool will try to reconnect automatically
  });
  
  db = pool;
  
  // Test connection
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL at', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.error('Full error:', err);
    console.error('Make sure your DATABASE_URL is correct and your database is accessible.');
    db = null; // Reset db so it can retry
    throw err;
  }

  console.log('✅ Database initialized successfully');
  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export function isPostgresDB() {
  return true; // Always using PostgreSQL
}

// Helper function to execute queries
export async function query(text, params) {
  const client = await db.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export default { initializeDatabase, getDatabase, isPostgresDB, query };
