import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import pkg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

let sqlite_db = null

async function uploadImagesToSupabase() {
  try {
    console.log('\n📸 Starting image migration to Supabase Storage...')

    const uploadDirs = [
      'banners',
      'blogs',
      'gallery',
      'news',
      'projects',
      'activities'
    ]

    for (const dir of uploadDirs) {
      const dirPath = path.join(__dirname, 'uploads', dir)

      if (!fs.existsSync(dirPath)) {
        console.log(`⏭️  ${dir} folder not found, skipping...`)
        continue
      }

      const files = fs.readdirSync(dirPath)
      console.log(`\n⏳ Uploading ${files.length} images from ${dir}...`)

      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const fileBuffer = fs.readFileSync(filePath)

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(`${dir}/${file}`, fileBuffer, {
            upsert: true,
            contentType: getContentType(file)
          })

        if (error) {
          console.error(`❌ Error uploading ${file}:`, error.message)
        } else {
          console.log(`✅ ${file}`)
        }
      }
    }

    console.log('\n✅ Image migration complete!')

  } catch (error) {
    console.error('❌ Image migration failed:', error)
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }
  return types[ext] || 'image/jpeg'
}

async function migrateSQLiteToSupabase() {
  try {
    console.log('🚀 Starting COMPLETE migration (Data + Images)...\n')

    // Open SQLite database
    sqlite_db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    })

    // Connect to Supabase
    const client = await pool.connect()
    console.log('✅ Connected to Supabase PostgreSQL')

    // Get all tables from SQLite
    const tables = await sqlite_db.all(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )

    console.log(`\n📊 Found ${tables.length} tables to migrate\n`)

    for (const table of tables) {
      const tableName = table.name
      console.log(`⏳ Migrating table: ${tableName}...`)

      // Get all rows from SQLite table
      const rows = await sqlite_db.all(`SELECT * FROM ${tableName}`)

      if (rows.length === 0) {
        console.log(`   ⏭️  Empty table, skipping...`)
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
        const values = columns.map(col => {
          // Update image paths to use Supabase URLs
          if ((col === 'image' || col === 'banner' || col === 'image_url' || col === 'logo') && row[col]) {
            const originalPath = row[col]
            // Convert local path to Supabase URL
            return getSupabaseImageUrl(originalPath)
          }
          return row[col]
        })
        
        try {
          await client.query(insertQuery, values)
          inserted++
        } catch (err) {
          console.error(`   Error inserting row in ${tableName}:`, err.message)
        }
      }

      console.log(`✅ ${tableName}: Migrated ${inserted}/${rows.length} rows`)
    }

    client.release()
    console.log('\n✅ Database migration complete!')

    // Now migrate images
    await uploadImagesToSupabase()

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    if (sqlite_db) await sqlite_db.close()
    await pool.end()
  }
}

function getSupabaseImageUrl(originalPath) {
  // Convert paths like "uploads/banners/image.jpg" to Supabase URL
  if (!originalPath) return null
  
  const pathParts = originalPath.split(/[\/\\]/)
  const lastTwo = pathParts.slice(-2).join('/')
  
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${lastTwo}`
}

migrateSQLiteToSupabase()
