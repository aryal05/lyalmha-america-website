import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { initializeDatabase, getDatabase } from './database.js'

dotenv.config()

async function updateAdmin() {
  await initializeDatabase()
  const pool = getDatabase()

  // ⬇️ CHANGE THESE VALUES ⬇️
  const newUsername = 'lag2020'  // Change to your desired username
  const newPassword = 'LAG@am3rica2020!'  // Change to your desired password
  const newEmail = 'admin@lyaymhaamerica.org'  // Change to your desired email
  // ⬆️ CHANGE THESE VALUES ⬆️

  const client = await pool.connect()
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Check if user exists
    const result = await client.query('SELECT * FROM users WHERE role = $1', ['super_admin'])
    const existingUser = result.rows[0]

    if (existingUser) {
      // Update existing admin user
      await client.query(
        'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
        [newUsername, newEmail, hashedPassword, existingUser.id]
      )
      
      console.log('✅ Admin credentials updated successfully!')
      console.log(`   Username: ${newUsername}`)
      console.log(`   Password: ${newPassword}`)
      console.log('   ⚠️  Keep these credentials secure!')
    } else {
      // Create new admin if none exists
      await client.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
        [newUsername, newEmail, hashedPassword, 'super_admin']
      )
      
      console.log('✅ New admin user created!')
      console.log(`   Username: ${newUsername}`)
      console.log(`   Password: ${newPassword}`)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating admin:', error.message)
    process.exit(1)
  } finally {
    client.release()
  }
}

updateAdmin()
