import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Not set ❌');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔌 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW(), version()');
    console.log('⏰ Server time:', result.rows[0].now);
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    // Test if tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables in database:');
    if (tables.rows.length === 0) {
      console.log('⚠️  No tables found! Database needs to be set up.');
    } else {
      tables.rows.forEach(row => {
        console.log('  -', row.table_name);
      });
    }
    
    client.release();
    await pool.end();
    
    console.log('\n✅ Database connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Database is paused (check Supabase dashboard)');
    console.error('2. Wrong connection string');
    console.error('3. Network/firewall issues');
    console.error('4. Database was deleted');
    await pool.end();
    process.exit(1);
  }
}

testConnection();
