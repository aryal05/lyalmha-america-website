import pkg from 'pg';

const { Pool } = pkg;

let db = null;

export async function initializeDatabase() {
  if (db) return db;

  // Require DATABASE_URL for production
  if (!process.env.DATABASE_URL) {
    throw new Error(
      '❌ DATABASE_URL environment variable is required. ' +
      'Please set up Supabase or Vercel Postgres and add the connection string to your environment variables.'
    );
  }

  // Connect to Supabase PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    // Connection pool settings for serverless
    max: 10, // Maximum number of clients
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Return an error if connection takes longer than 10 seconds
  });
  
  db = pool;
  
  // Test connection
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Connected to Supabase PostgreSQL at', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to Supabase PostgreSQL:', err.message);
    console.error('Make sure your DATABASE_URL is correct and your Supabase database is accessible.');
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
