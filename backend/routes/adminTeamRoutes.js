import express from 'express'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET all team members (public - no auth)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    const team = await db.all('SELECT * FROM team_members ORDER BY category, order_index, name')
    res.json({ success: true, data: team })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET team by category
router.get('/category/:category', async (req, res) => {
  const db = getDatabase()
  try {
    const team = await db.all('SELECT * FROM team_members WHERE category = ? ORDER BY order_index, name', [req.params.category])
    res.json({ success: true, data: team })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create team member
router.post('/', async (req, res) => {
  const db = getDatabase()
  try {
    const { name, role, category, bio, order_index } = req.body
    
    if (!name || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and category are required' 
      })
    }
    
    const result = await db.run(`
      INSERT INTO team_members (name, role, category, bio, order_index)
      VALUES (?, ?, ?, ?, ?)
    `, [name, role, category, bio, order_index || 0])
    
    const newMember = await db.get('SELECT * FROM team_members WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newMember })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update team member
router.put('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const { name, role, category, bio, order_index } = req.body
    const member = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    
    await db.run(`
      UPDATE team_members 
      SET name = ?, role = ?, category = ?, bio = ?, order_index = ?
      WHERE id = ?
    `, [
      name || member.name,
      role || member.role,
      category || member.category,
      bio || member.bio,
      order_index !== undefined ? order_index : member.order_index,
      req.params.id
    ])
    
    const updatedMember = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedMember })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE team member
router.delete('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const member = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    
    await db.run('DELETE FROM team_members WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
