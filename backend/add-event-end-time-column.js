// Migration script to add event_end_time column to events table
import { initializeDatabase, query } from './database.js'
import dotenv from 'dotenv'
dotenv.config()

async function migrate() {
  try {
    await initializeDatabase()
    
    console.log('📝 Adding event_end_time column to events table...')
    await query('ALTER TABLE events ADD COLUMN IF NOT EXISTS event_end_time TEXT')
    
    console.log('✅ Migration complete!')
    console.log('   - event_end_time column added to events table')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
