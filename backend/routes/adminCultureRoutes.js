import express from 'express'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET all festivals (public - no auth)
router.get('/festivals', async (req, res) => {
  try {
    const db = await getDatabase()
    const festivals = await db.all('SELECT * FROM culture_festivals WHERE active = 1 ORDER BY order_index')
    res.json({ success: true, data: festivals })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET all traditions (public - no auth)
router.get('/traditions', async (req, res) => {
  try {
    const db = await getDatabase()
    const traditions = await db.all('SELECT * FROM culture_traditions WHERE active = 1 ORDER BY order_index')
    res.json({ success: true, data: traditions })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create festival
router.post('/festivals', async (req, res) => {
  try {
    const db = await getDatabase()
    const { title, description, highlights, order_index } = req.body
    
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and description are required' 
      })
    }
    
    const result = await db.run(`
      INSERT INTO culture_festivals (title, description, highlights, order_index)
      VALUES (?, ?, ?, ?)
    `, [title, description, highlights, order_index || 0])
    
    const newFestival = await db.get('SELECT * FROM culture_festivals WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newFestival })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update festival
router.put('/festivals/:id', async (req, res) => {
  try {
    const db = await getDatabase()
    const { title, description, highlights, order_index, active } = req.body
    const festival = await db.get('SELECT * FROM culture_festivals WHERE id = ?', [req.params.id])
    
    if (!festival) {
      return res.status(404).json({ success: false, error: 'Festival not found' })
    }
    
    await db.run(`
      UPDATE culture_festivals 
      SET title = ?, description = ?, highlights = ?, order_index = ?, active = ?
      WHERE id = ?
    `, [
      title || festival.title,
      description || festival.description,
      highlights || festival.highlights,
      order_index !== undefined ? order_index : festival.order_index,
      active !== undefined ? active : festival.active,
      req.params.id
    ])
    
    const updatedFestival = await db.get('SELECT * FROM culture_festivals WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedFestival })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE festival
router.delete('/festivals/:id', async (req, res) => {
  try {
    const db = await getDatabase()
    const festival = await db.get('SELECT * FROM culture_festivals WHERE id = ?', [req.params.id])
    
    if (!festival) {
      return res.status(404).json({ success: false, error: 'Festival not found' })
    }
    
    await db.run('DELETE FROM culture_festivals WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Festival deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create tradition
router.post('/traditions', async (req, res) => {
  try {
    const db = await getDatabase()
    const { icon, title, description, order_index } = req.body
    
    if (!icon || !title || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Icon, title and description are required' 
      })
    }
    
    const result = await db.run(`
      INSERT INTO culture_traditions (icon, title, description, order_index)
      VALUES (?, ?, ?, ?)
    `, [icon, title, description, order_index || 0])
    
    const newTradition = await db.get('SELECT * FROM culture_traditions WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newTradition })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update tradition
router.put('/traditions/:id', async (req, res) => {
  try {
    const db = await getDatabase()
    const { icon, title, description, order_index, active } = req.body
    const tradition = await db.get('SELECT * FROM culture_traditions WHERE id = ?', [req.params.id])
    
    if (!tradition) {
      return res.status(404).json({ success: false, error: 'Tradition not found' })
    }
    
    await db.run(`
      UPDATE culture_traditions 
      SET icon = ?, title = ?, description = ?, order_index = ?, active = ?
      WHERE id = ?
    `, [
      icon || tradition.icon,
      title || tradition.title,
      description || tradition.description,
      order_index !== undefined ? order_index : tradition.order_index,
      active !== undefined ? active : tradition.active,
      req.params.id
    ])
    
    const updatedTradition = await db.get('SELECT * FROM culture_traditions WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedTradition })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE tradition
router.delete('/traditions/:id', async (req, res) => {
  try {
    const db = await getDatabase()
    const tradition = await db.get('SELECT * FROM culture_traditions WHERE id = ?', [req.params.id])
    
    if (!tradition) {
      return res.status(404).json({ success: false, error: 'Tradition not found' })
    }
    
    await db.run('DELETE FROM culture_traditions WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Tradition deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
