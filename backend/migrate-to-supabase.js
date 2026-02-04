import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import pkg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Your Supabase connection string should be in .env file
// DATABASE_URL=postgresql://user:password@host/database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

let sqlite_db = null

async function migrateSQLiteToSupabase() {
  try {
    console.log('🚀 Starting migration from SQLite to Supabase...')

    // Open SQLite database
    sqlite_db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    })

    // Connect to Supabase
    const client = await pool.connect()
    console.log('✅ Connected to Supabase')

    // Get all tables from SQLite
    const tables = await sqlite_db.all(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )

    console.log(`\n📊 Found ${tables.length} tables to migrate`)

    for (const table of tables) {
      const tableName = table.name
      console.log(`\n⏳ Migrating table: ${tableName}...`)

      // Get all rows from SQLite table
      const rows = await sqlite_db.all(`SELECT * FROM ${tableName}`)

      if (rows.length === 0) {
        console.log(`⏭️  Table ${tableName} is empty, skipping...`)
        continue
      }

      // Get column names
      const columns = Object.keys(rows[0])

      // Build insert query
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(',')
      const insertQuery = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`

      // Insert rows into Supabase
      let inserted = 0
      for (const row of rows) {
        const values = columns.map(col => row[col])
        try {
          await client.query(insertQuery, values)
          inserted++
        } catch (err) {
          console.error(`Error inserting row in ${tableName}:`, err.message)
        }
      }

      console.log(`✅ ${tableName}: Migrated ${inserted}/${rows.length} rows`)
    }

    client.release()
    console.log('\n🎉 Migration complete!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    if (sqlite_db) await sqlite_db.close()
    await pool.end()
  }
}

migrateSQLiteToSupabase()
