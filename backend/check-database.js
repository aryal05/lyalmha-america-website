import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

async function checkDatabase() {
  // Try direct connection first
  const directUrl = process.env.DATABASE_URL
  
  // Also try pooler connection (port 6543)
  const poolerUrl = directUrl?.replace(':5432/', ':6543/')
  
  console.log('🔍 Testing Supabase database connection...\n')
  
  // Try direct connection
  console.log('📡 Trying direct connection (port 5432)...')
  try {
    const pool = new Pool({ 
      connectionString: directUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    })
    const client = await pool.connect()
    console.log('✅ Direct connection successful!\n')
    
    // Check tables
    console.log('📋 Checking database tables...')
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    if (tables.rows.length === 0) {
      console.log('⚠️ No tables found in database!')
    } else {
      console.log(`Found ${tables.rows.length} tables:`)
      tables.rows.forEach(t => console.log(`  - ${t.table_name}`))
    }
    
    // Check specific tables
    console.log('\n🔎 Checking required tables...')
    const requiredTables = ['activities', 'news', 'blogs', 'events', 'event_rsvps', 'team_members', 'supporters', 'banners', 'contact_messages']
    
    for (const tableName of requiredTables) {
      const exists = await client.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`,
        [tableName]
      )
      const status = exists.rows[0].exists ? '✅' : '❌'
      console.log(`  ${status} ${tableName}`)
    }
    
    client.release()
    await pool.end()
    
  } catch (err) {
    console.log('❌ Direct connection failed:', err.message)
    
    // Try pooler
    console.log('\n📡 Trying pooler connection (port 6543)...')
    try {
      const pool = new Pool({ 
        connectionString: poolerUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
      })
      const client = await pool.connect()
      console.log('✅ Pooler connection successful!')
      client.release()
      await pool.end()
      console.log('\n⚠️ You should update DATABASE_URL to use port 6543 instead of 5432')
    } catch (err2) {
      console.log('❌ Pooler connection also failed:', err2.message)
      console.log('\n🚨 Please check:')
      console.log('  1. Is your Supabase project active? (not paused)')
      console.log('  2. Is the DATABASE_URL correct?')
      console.log('  3. Check Supabase Dashboard > Settings > Database')
    }
  }
}

checkDatabase()
