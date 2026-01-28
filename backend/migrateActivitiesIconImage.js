import { initializeDatabase } from './database.js'

async function migrateActivitiesIconImage() {
  try {
    const db = await initializeDatabase()
    
    // Add icon_image column
    await db.exec(`
      ALTER TABLE activities ADD COLUMN icon_image TEXT;
    `)
    
    console.log('✅ Migration completed: Added icon_image column to activities table')
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('✅ Column icon_image already exists')
    } else {
      console.error('❌ Migration failed:', error)
    }
  }
}

migrateActivitiesIconImage()
