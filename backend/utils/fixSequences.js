import { getDatabase } from '../database.js'

/**
 * Reset PostgreSQL sequences to the correct values
 * This fixes the "duplicate key value violates unique constraint" error
 * that occurs when data was migrated with explicit IDs
 */
export async function fixAllSequences() {
  const db = getDatabase()
  const client = await db.connect()
  
  console.log('🔧 Checking and fixing PostgreSQL sequences...')
  
  const tables = [
    'users',
    'blogs',
    'team_members',
    'events',
    'event_images',
    'supporters',
    'banners',
    'site_settings',
    'projects',
    'project_team',
    'activities',
    'testimonials',
    'traditions',
    'page_banners'
  ]
  
  try {
    for (const table of tables) {
      try {
        // Check if table exists
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          )
        `, [table])
        
        if (!tableExists.rows[0].exists) {
          continue
        }
        
        // Get the max ID from the table
        const maxResult = await client.query(`SELECT MAX(id) as max_id FROM ${table}`)
        const maxId = maxResult.rows[0].max_id
        
        if (maxId) {
          // Reset the sequence to max + 1
          const sequenceName = `${table}_id_seq`
          await client.query(`SELECT setval($1, $2, true)`, [sequenceName, maxId])
          console.log(`  ✅ Fixed sequence for ${table}: set to ${maxId}`)
        }
      } catch (err) {
        // Table might not exist or have no sequence - that's ok
        if (!err.message.includes('does not exist')) {
          console.log(`  ⚠️  Could not fix sequence for ${table}: ${err.message}`)
        }
      }
    }
    
    console.log('✅ Sequence check complete')
  } finally {
    client.release()
  }
}

/**
 * Fix sequence for a specific table
 */
export async function fixSequence(tableName) {
  const db = getDatabase()
  const client = await db.connect()
  
  try {
    const maxResult = await client.query(`SELECT MAX(id) as max_id FROM ${tableName}`)
    const maxId = maxResult.rows[0].max_id
    
    if (maxId) {
      const sequenceName = `${tableName}_id_seq`
      await client.query(`SELECT setval($1, $2, true)`, [sequenceName, maxId])
      console.log(`✅ Fixed sequence for ${tableName}: set to ${maxId}`)
    }
  } finally {
    client.release()
  }
}
