import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await QueryHelper.all(
      'SELECT * FROM testimonials WHERE active = 1 ORDER BY order_index ASC, created_at DESC'
    )
    res.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await QueryHelper.get('SELECT * FROM testimonials WHERE id = ?', [req.params.id])
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' })
    }
    res.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create new testimonial (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { parent, quote, rating, children } = req.body

    if (!parent || !quote) {
      return res.status(400).json({ success: false, error: 'Parent name and quote are required' })
    }

    const result = await QueryHelper.run(
      `INSERT INTO testimonials (parent, quote, rating, children) 
       VALUES (?, ?, ?, ?)`,
      [parent, quote, rating || 5, children || '']
    )

    const newTestimonial = await QueryHelper.get('SELECT * FROM testimonials WHERE id = ?', [result.lastID])
    res.status(201).json({ success: true, data: newTestimonial })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update testimonial (Admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { parent, quote, rating, children, orderIndex } = req.body
    const existingTestimonial = await QueryHelper.get('SELECT * FROM testimonials WHERE id = ?', [req.params.id])
    if (!existingTestimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' })
    }

    await QueryHelper.run(
      `UPDATE testimonials 
       SET parent = ?, quote = ?, rating = ?, children = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [parent, quote, rating, children, orderIndex || 0, req.params.id]
    )

    const updatedTestimonial = await QueryHelper.get('SELECT * FROM testimonials WHERE id = ?', [req.params.id])
    res.json({ success: true, data: updatedTestimonial })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete testimonial (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const testimonial = await QueryHelper.get('SELECT * FROM testimonials WHERE id = ?', [req.params.id])
    
    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' })
    }

    // Soft delete
    await QueryHelper.run('UPDATE testimonials SET active = 0 WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
