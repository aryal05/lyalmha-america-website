import express from 'express'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET all supporters (public - no auth)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    const supporters = await db.all('SELECT * FROM supporters ORDER BY type, name')
    res.json({ success: true, data: supporters })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET supporters by type
router.get('/type/:type', async (req, res) => {
  const db = getDatabase()
  try {
    const supporters = await db.all('SELECT * FROM supporters WHERE type = ? ORDER BY name', [req.params.type])
    res.json({ success: true, data: supporters })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create supporter
router.post('/', async (req, res) => {
  const db = getDatabase()
  try {
    const { name, type, contact_person, description } = req.body
    
    if (!name || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and type are required' 
      })
    }
    
    const result = await db.run(`
      INSERT INTO supporters (name, type, contact_person, description)
      VALUES (?, ?, ?, ?)
    `, [name, type, contact_person, description])
    
    const newSupporter = await db.get('SELECT * FROM supporters WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newSupporter })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update supporter
router.put('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const { name, type, contact_person, description } = req.body
    const supporter = await db.get('SELECT * FROM supporters WHERE id = ?', [req.params.id])
    
    if (!supporter) {
      return res.status(404).json({ success: false, error: 'Supporter not found' })
    }
    
    await db.run(`
      UPDATE supporters 
      SET name = ?, type = ?, contact_person = ?, description = ?
      WHERE id = ?
    `, [
      name || supporter.name,
      type || supporter.type,
      contact_person || supporter.contact_person,
      description || supporter.description,
      req.params.id
    ])
    
    const updatedSupporter = await db.get('SELECT * FROM supporters WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedSupporter })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE supporter
router.delete('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const supporter = await db.get('SELECT * FROM supporters WHERE id = ?', [req.params.id])
    
    if (!supporter) {
      return res.status(404).json({ success: false, error: 'Supporter not found' })
    }
    
    await db.run('DELETE FROM supporters WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Supporter deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
