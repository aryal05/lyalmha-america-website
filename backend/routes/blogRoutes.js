import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'

const router = express.Router()

// GET all published blogs (public route)
router.get('/', async (req, res) => {
  try {
    const blogs = await QueryHelper.all(`
      SELECT * FROM blogs 
      WHERE status = ? 
      ORDER BY created_at DESC
    `, ['published'])
    
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single blog by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const blog = await QueryHelper.get(
      'SELECT * FROM blogs WHERE id = ? AND status = ?', 
      [req.params.id, 'published']
    )
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router

