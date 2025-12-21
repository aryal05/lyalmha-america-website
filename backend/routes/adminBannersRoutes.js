import express from 'express'
import { getDatabase } from '../database.js'
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
    const db = await getDatabase()
    const banners = await db.all(`
      SELECT * FROM banners 
      WHERE active = 1 
      ORDER BY order_index
    `)
    res.json({ success: true, data: banners })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET banners by location
router.get('/location/:location', async (req, res) => {
  try {
    const db = await getDatabase()
    const banners = await db.all(`
      SELECT * FROM banners 
      WHERE position = ? AND active = 1 
      ORDER BY order_index
    `, req.params.location)
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
    const db = await getDatabase()
    const banners = await db.all('SELECT * FROM banners ORDER BY position, order_index')
    res.json({ success: true, data: banners })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create banner
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const db = await getDatabase()
    const { title, description, position, order_index, link, active } = req.body
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image is required' 
      })
    }
    
    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer)
    
    const result = await db.run(`
      INSERT INTO banners (title, description, image, position, order_index, link, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      title,
      description,
      imageUrl,
      position || 'hero',
      order_index || 0,
      link,
      active === 'true' || active === true || active === 1 ? 1 : 0
    )
    
    const newBanner = await db.get('SELECT * FROM banners WHERE id = ?', result.lastID)
    
    res.status(201).json({ success: true, data: newBanner })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update banner
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const db = await getDatabase()
    const { title, description, position, order_index, link, active } = req.body
    const banner = await db.get('SELECT * FROM banners WHERE id = ?', req.params.id)
    
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }
    
    // Upload to Cloudinary if new image provided
    const imageUrl = req.file ? await uploadToCloudinary(req.file.buffer) : banner.image
    
    await db.run(`
      UPDATE banners 
      SET title = ?, description = ?, image = ?, 
          position = ?, order_index = ?, link = ?, active = ?
      WHERE id = ?
    `,
      title || banner.title,
      description || banner.description,
      imageUrl,
      position || banner.position,
      order_index !== undefined ? order_index : banner.order_index,
      link !== undefined ? link : banner.link,
      active !== undefined ? (active === 'true' || active === true || active === 1 ? 1 : 0) : banner.active,
      req.params.id
    )
    
    const updatedBanner = await db.get('SELECT * FROM banners WHERE id = ?', req.params.id)
    
    res.json({ success: true, data: updatedBanner })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE banner
router.delete('/:id', async (req, res) => {
  try {
    const db = await getDatabase()
    const banner = await db.get('SELECT * FROM banners WHERE id = ?', req.params.id)
    
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }
    
    await db.run('DELETE FROM banners WHERE id = ?', req.params.id)
    
    res.json({ success: true, message: 'Banner deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
