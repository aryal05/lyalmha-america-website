import bcrypt from 'bcryptjs'
import { initializeDatabase, getDatabase } from './database.js'

async function seed() {
  // Initialize database
  await initializeDatabase()
  const db = getDatabase()

  // Check if admin user exists (by username)
  const existingAdmin = await db.get('SELECT * FROM users WHERE username = ?', ['admin'])

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    try {
      await db.run(`
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
      `, ['admin', 'admin@lyalmha.com', hashedPassword, 'super_admin'])
      
      console.log('✅ Default admin user created')
      console.log('   Username: admin')
      console.log('   Password: admin123')
      
    } catch (error) {
      console.log('ℹ  Admin user setup - checking existing user...')
      const existing = await db.get('SELECT * FROM users')
      if (existing) {
        console.log('✅ User already exists in database')
        console.log('   Username:', existing.username)
      }
    }
  } else {
    console.log('ℹ️  Admin user already exists')
    console.log('   Username:', existingAdmin.username)
  }

  // Seed initial site settings
  const settings = [
    { key: 'site_name', value: 'Lyalmha America', description: 'Website name' },
    { key: 'site_tagline', value: 'newari Culture Blog', description: 'Website tagline' },
    { key: 'contact_email', value: 'info@lyalmha-america.org', description: 'Contact email' },
    { key: 'contact_phone', value: '+1 (555) 123-4567', description: 'Contact phone' },
    { key: 'facebook_url', value: '#', description: 'Facebook page URL' },
    { key: 'instagram_url', value: '#', description: 'Instagram page URL' }
  ]

  for (const setting of settings) {
    const exists = await db.get('SELECT * FROM site_settings WHERE key = ?', [setting.key])
    if (!exists) {
      await db.run(`
        INSERT INTO site_settings (key, value, description)
        VALUES (?, ?, ?)
      `, [setting.key, setting.value, setting.description])
    }
  }

  console.log('✅ Site settings initialized')
  console.log('✅ Database seeding completed')
}

seed().catch(console.error)

