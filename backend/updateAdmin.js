import bcrypt from 'bcryptjs'
import { initializeDatabase, getDatabase } from './database.js'

async function updateAdmin() {
  await initializeDatabase()
  const db = getDatabase()

  // ⬇️ CHANGE THESE VALUES ⬇️
  const newUsername = 'admin'  // Change to your desired username
  const newPassword = 'admin123'  // Change to your desired password
  const newEmail = 'admin@lyalmha.com'  // Change to your desired email
  // ⬆️ CHANGE THESE VALUES ⬆️

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Check if user exists
    const existingUser = await db.get('SELECT * FROM users WHERE role = ?', ['super_admin'])

    if (existingUser) {
      // Update existing admin user
      await db.run(`
        UPDATE users 
        SET username = ?, email = ?, password = ?
        WHERE id = ?
      `, [newUsername, newEmail, hashedPassword, existingUser.id])
      
      console.log('✅ Admin credentials updated successfully!')
      console.log(`   Username: ${newUsername}`)
      console.log(`   Password: ${newPassword}`)
      console.log('   ⚠️  Keep these credentials secure!')
    } else {
      // Create new admin if none exists
      await db.run(`
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
      `, [newUsername, newEmail, hashedPassword, 'super_admin'])
      
      console.log('✅ New admin user created!')
      console.log(`   Username: ${newUsername}`)
      console.log(`   Password: ${newPassword}`)
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating admin:', error.message)
    process.exit(1)
  }
}

updateAdmin()
