import express from 'express'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/banners')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

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
    
    const image = `/uploads/banners/${req.file.filename}`
    
    const result = await db.run(`
      INSERT INTO banners (title, description, image, position, order_index, link, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      title,
      description,
      image,
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
    
    const image = req.file ? `/uploads/banners/${req.file.filename}` : banner.image
    
    await db.run(`
      UPDATE banners 
      SET title = ?, description = ?, image = ?, 
          position = ?, order_index = ?, link = ?, active = ?
      WHERE id = ?
    `,
      title || banner.title,
      description || banner.description,
      image,
      position || banner.position,
      order_index !== undefined ? order_index : banner.order_index,
      link !== undefined ? link : banner.link,
      active !== undefined ? (active === 'true' || active === true || active === 1 ? 1 : 0) : banner.active,
      req.params.id
    )
    
    // Delete old image if new one uploaded
    if (req.file && banner.image) {
      const oldImagePath = path.join(__dirname, '..', banner.image)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }
    
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
    
    // Delete image file
    if (banner.image) {
      const imagePath = path.join(__dirname, '..', banner.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }
    
    await db.run('DELETE FROM banners WHERE id = ?', req.params.id)
    
    res.json({ success: true, message: 'Banner deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
