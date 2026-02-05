import dotenv from 'dotenv';
import { initializeDatabase, query } from './database.js';

dotenv.config();

async function testConnection() {
  console.log('\n📦 Testing Supabase Connection...\n');
  
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized successfully\n');
    
    // Test query
    console.log('🔍 Running test query...');
    const result = await query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1',
      ['public']
    );
    
    console.log('\n📋 Tables in your database:');
    console.log('=============================');
    
    if (result.rows.length === 0) {
      console.log('\n⚠️  No tables found!');
      console.log('\nYou need to run the SQL schema:');
      console.log('1. Open Supabase SQL Editor');
      console.log('2. Copy content from backend/supabase-schema.sql');
      console.log('3. Paste and run in SQL Editor\n');
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
      console.log('=============================');
      console.log(`\n✅ Found ${result.rows.length} tables`);
      
      // Check for required tables
      const requiredTables = [
        'users', 'blogs', 'team_members', 'events', 'supporters',
        'banners', 'projects', 'activities', 'testimonials',
        'news', 'gallery', 'culture_festivals', 'culture_traditions',
        'contact_messages', 'event_rsvps'
      ];
      
      const existingTables = result.rows.map(r => r.table_name);
      const missingTables = requiredTables.filter(t => !existingTables.includes(t));
      
      if (missingTables.length > 0) {
        console.log('\n⚠️  Missing tables:');
        missingTables.forEach(table => console.log(`   - ${table}`));
        console.log('\n Run backend/supabase-schema.sql to create them.');
      } else {
        console.log('\n✅ All required tables exist!');
      }
    }
    
    console.log('\n✅ Connection test successful!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check DATABASE_URL is set correctly');
    console.error('2. Verify Supabase project is active (not paused)');
    console.error('3. Check your database password is correct');
    console.error('4. Ensure connection string format is: postgresql://...');
    console.error('\n');
    process.exit(1);
  }
}

testConnection();
