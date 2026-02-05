import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'

const router = express.Router()

// GET all published blogs (public route)
router.get('/', async (req, res) => {
  try {
    console.log('📚 Fetching all published blogs...')
    const blogs = await QueryHelper.all(`
      SELECT * FROM blogs 
      WHERE status = $1 
      ORDER BY created_at DESC
    `, ['published'])
    
    console.log(`✅ Found ${blogs.length} published blogs`)
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single blog by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    console.log(`📖 Fetching blog with ID: ${req.params.id}`)
    const blog = await QueryHelper.get(
      'SELECT * FROM blogs WHERE id = $1 AND status = $2', 
      [req.params.id, 'published']
    )
    
    if (!blog) {
      console.log(`❌ Blog not found: ${req.params.id}`)
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    console.log(`✅ Found blog: ${blog.title}`)
    res.json({ success: true, data: blog })
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router

