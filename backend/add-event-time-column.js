// Migration script to add event_time column to events table
import 'dotenv/config'
import { initializeDatabase, query } from './database.js'

async function migrate() {
  try {
    console.log('🔄 Initializing database connection...')
    await initializeDatabase()
    
    console.log('📝 Adding event_time column to events table...')
    await query('ALTER TABLE events ADD COLUMN IF NOT EXISTS event_time TEXT')
    
    console.log('✅ Migration completed successfully!')
    console.log('   - event_time column added to events table')
    console.log('   - All times should be entered in US Eastern Time (ET)')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
