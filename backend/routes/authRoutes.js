import express from 'express'
import bcrypt from 'bcryptjs'
import { QueryHelper } from '../utils/queryHelper.js'
import { generateToken, authenticateToken } from '../middleware/auth.js'


// Starting express router
const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const user = await QueryHelper.get('SELECT * FROM users WHERE username = ?', [username])

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user)

    // Remove password from response
    delete user.password

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error during login' })
  }
})


// Verify token and get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await QueryHelper.get('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id])

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }

    const user = await QueryHelper.get('SELECT * FROM users WHERE id = ?', [req.user.id])

    const validPassword = await bcrypt.compare(currentPassword, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await QueryHelper.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, req.user.id]
    )

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Logout (client-side token removal is sufficient, but this can log activity)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

export default router
