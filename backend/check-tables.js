import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

async function checkTables() {
  try {
    // Check activities table structure
    const activitiesResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'activities'
      ORDER BY ordinal_position
    `);
    console.log('\n=== ACTIVITIES TABLE ===');
    activitiesResult.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`));

    // Check news table structure
    const newsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'news'
      ORDER BY ordinal_position
    `);
    console.log('\n=== NEWS TABLE ===');
    newsResult.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`));

    await pool.end();
  } catch (e) {
    console.error('Error:', e.message);
  }
}
checkTables();
