import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateToken } from '../middleware/auth.js'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

// Configure multer for memory storage (upload to Cloudinary)
const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'lyalmha-america/banners' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}

// GET all banners (public - no auth)
router.get('/', async (req, res) => {
  try {
    const banners = await QueryHelper.all(`
      SELECT * FROM banners 
      WHERE active = 1 
      ORDER BY order_index ASC
    `)
    res.json({ success: true, data: banners })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET banners by location
router.get('/location/:location', async (req, res) => {
  try {
    const banners = await QueryHelper.all(`
      SELECT * FROM banners 
      WHERE position = $1 AND active = 1 
      ORDER BY order_index ASC
    `, [req.params.location])
    res.json({ success: true, data: banners })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// GET all banners (admin - includes inactive)
router.get('/admin/all', async (req, res) => {
  try {
    const banners = await QueryHelper.all('SELECT * FROM banners ORDER BY position, order_index ASC')
    res.json({ success: true, data: banners })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create banner
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, position, active } = req.body
    const order_index_raw = req.body.order_index
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image is required' 
      })
    }
    
    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer)
    
    // Use provided order_index or auto-calculate
    let nextOrder
    if (order_index_raw !== undefined && order_index_raw !== '' && order_index_raw !== null) {
      nextOrder = Math.max(1, parseInt(order_index_raw) || 1)
    } else {
      const maxOrder = await QueryHelper.get(
        'SELECT MAX(order_index) as max FROM banners WHERE position = ?', 
        [position || 'home']
      )
      nextOrder = (maxOrder?.max || 0) + 1
    }
    
    // Resolve order conflicts: bump existing banners with same or higher order
    await QueryHelper.run(
      'UPDATE banners SET order_index = order_index + 1 WHERE position = ? AND order_index >= ?',
      [position || 'home', nextOrder]
    )
    
    const result = await QueryHelper.run(`
      INSERT INTO banners (title, description, image, position, order_index, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      title || '',
      description || '',
      imageUrl,
      position || 'home',
      nextOrder,
      (active === undefined || active === 'true' || active === '1' || active === true || active === 1) ? 1 : 0
    ])
    
    const newBanner = await QueryHelper.get('SELECT * FROM banners WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newBanner })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update banner
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, position, active } = req.body
    
    const banner = await QueryHelper.get('SELECT * FROM banners WHERE id = ?', [req.params.id])
    
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }
    
    // Upload to Cloudinary if new image provided
    let imageUrl = banner.image
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer)
      } catch (uploadError) {
        return res.status(500).json({ 
          success: false, 
          error: 'Image upload failed: ' + uploadError.message 
        })
      }
    }
    
    // If position changed, recalculate order_index
    // Use provided order_index, or recalculate if position changed, or keep existing
    const order_index_raw = req.body.order_index
    let order_index
    if (order_index_raw !== undefined && order_index_raw !== '' && order_index_raw !== null) {
      order_index = Math.max(1, parseInt(order_index_raw) || 1)
    } else if (position && position !== banner.position) {
      const maxOrder = await QueryHelper.get(
        'SELECT MAX(order_index) as max FROM banners WHERE position = ?', 
        [position]
      )
      order_index = (maxOrder?.max || 0) + 1
    } else {
      order_index = banner.order_index
    }
    
    // Determine final values - use provided or keep existing
    const finalTitle = title || banner.title
    const finalDescription = description !== undefined ? description : banner.description
    const finalPosition = position || banner.position
    const finalActive = active !== undefined ? (active === 'true' || active === '1' || active === true || active === 1 ? 1 : 0) : banner.active
    
    // Resolve order conflicts: bump other banners with same or higher order (exclude current banner)
    if (order_index !== banner.order_index || finalPosition !== banner.position) {
      await QueryHelper.run(
        'UPDATE banners SET order_index = order_index + 1 WHERE position = ? AND order_index >= ? AND id != ?',
        [finalPosition, order_index, req.params.id]
      )
    }
    
    const result = await QueryHelper.run(`
      UPDATE banners 
      SET title = ?, description = ?, image = ?, 
          position = ?, order_index = ?, active = ?
      WHERE id = ?
    `, [
      finalTitle,
      finalDescription,
      imageUrl,
      finalPosition,
      order_index,
      finalActive,
      req.params.id
    ])
    
    const updatedBanner = await QueryHelper.get('SELECT * FROM banners WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedBanner })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE banner
router.delete('/:id', async (req, res) => {
  try {
    const banner = await QueryHelper.get('SELECT * FROM banners WHERE id = ?', [req.params.id])
    
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }
    
    await QueryHelper.run('DELETE FROM banners WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Banner deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
