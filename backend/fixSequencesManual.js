/**
 * Manual script to fix PostgreSQL sequences
 * Run this if you encounter "duplicate key value violates unique constraint" errors
 * 
 * Usage: node fixSequencesManual.js
 */

import dotenv from 'dotenv'
import { initializeDatabase } from './database.js'
import { fixAllSequences } from './utils/fixSequences.js'

dotenv.config()

async function main() {
  console.log('🔧 PostgreSQL Sequence Fix Tool')
  console.log('================================\n')
  
  try {
    // Initialize database connection
    console.log('Connecting to database...')
    await initializeDatabase()
    
    // Fix all sequences
    await fixAllSequences()
    
    console.log('\n✅ All sequences have been fixed!')
    console.log('You can now add new records without duplicate key errors.')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

main()
