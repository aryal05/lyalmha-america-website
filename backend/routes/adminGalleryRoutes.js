import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload, uploadToCloudinary } from '../utils/uploadHelper.js'

const router = express.Router()

// Get all events with their thumbnail images for gallery
router.get('/', async (req, res) => {
  try {
    // Get all events with their thumbnail image
    const events = await QueryHelper.all(`
      SELECT 
        e.id as event_id,
        e.title,
        e.description,
        e.event_date,
        e.location,
        e.event_type as category,
        COALESCE(ei.image_url, e.image) as image_url,
        COALESCE(ei.image_url, e.image) as image
      FROM events e
      LEFT JOIN event_images ei ON e.id = ei.event_id AND ei.is_thumbnail = 1
      ORDER BY e.event_date DESC
    `)
    res.json({ success: true, data: events })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const image = await QueryHelper.get('SELECT * FROM gallery WHERE id = ?', [req.params.id])
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' })
    }
    res.json({ success: true, data: image })
  } catch (error) {
    console.error('Error fetching image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Protected routes - require authentication
router.use(authenticateToken)

// Upload gallery image (Admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, active, order_index } = req.body

    if (!title || !req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and image are required' 
      })
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'gallery')

    const result = await QueryHelper.run(
      `INSERT INTO gallery (title, description, image, category, active, order_index) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || '', imageUrl, category || 'event', active !== undefined ? active : 1, order_index || 0]
    )

    const newImage = await QueryHelper.get('SELECT * FROM gallery WHERE id = ?', [result.lastID])
    res.status(201).json({ success: true, data: newImage })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update gallery image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, active, order_index } = req.body
    const galleryItem = await QueryHelper.get('SELECT * FROM gallery WHERE id = ?', [req.params.id])
    if (!galleryItem) {
      return res.status(404).json({ success: false, error: 'Image not found' })
    }

    // Upload to Cloudinary if new image uploaded
    let image = galleryItem.image
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, 'gallery')
    }

    await QueryHelper.run(
      `UPDATE gallery 
       SET title = ?, description = ?, image = ?, category = ?, active = ?, order_index = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title || galleryItem.title,
        description !== undefined ? description : galleryItem.description,
        image,
        category || galleryItem.category,
        active !== undefined ? active : galleryItem.active,
        order_index !== undefined ? order_index : galleryItem.order_index,
        req.params.id
      ]
    )

    const updatedImage = await QueryHelper.get('SELECT * FROM gallery WHERE id = ?', [req.params.id])
    res.json({ success: true, data: updatedImage })
  } catch (error) {
    console.error('Error updating image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete gallery image
router.delete('/:id', async (req, res) => {
  try {
    const galleryItem = await QueryHelper.get('SELECT * FROM gallery WHERE id = ?', [req.params.id])
    
    if (!galleryItem) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' })
    }

    await QueryHelper.run('DELETE FROM gallery WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
