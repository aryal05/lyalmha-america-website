import express from 'express'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Public route - Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      })
    }

    const db = getDatabase()
    const result = await db.run(
      `INSERT INTO contact_messages (name, email, subject, message, status, created_at) 
       VALUES (?, ?, ?, ?, 'unread', datetime('now'))`,
      [name, email, subject, message]
    )

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      id: result.lastID
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    })
  }
})

// Admin routes - Protected
// Get all contact messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase()
    const messages = await db.all(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    )

    res.json({
      success: true,
      data: messages
    })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch messages' 
    })
  }
})

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const db = getDatabase()
    const result = await db.get(
      `SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'`
    )

    res.json({
      success: true,
      count: result.count
    })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch unread count' 
    })
  }
})

// Mark message as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const db = getDatabase()

    await db.run(
      `UPDATE contact_messages SET status = 'read', updated_at = datetime('now') WHERE id = ?`,
      [id]
    )

    res.json({
      success: true,
      message: 'Message marked as read'
    })
  } catch (error) {
    console.error('Error marking message as read:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update message status' 
    })
  }
})

// Delete a message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const db = getDatabase()

    await db.run(`DELETE FROM contact_messages WHERE id = ?`, [id])

    res.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete message' 
    })
  }
})

export default router
