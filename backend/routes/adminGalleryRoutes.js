import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Only image files are allowed!'))
  },
})

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const db = getDatabase()
    const images = await db.all(
      'SELECT * FROM gallery WHERE active = 1 ORDER BY order_index ASC, created_at DESC'
    )
    res.json({ success: true, data: images })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase()
    const image = await db.get('SELECT * FROM gallery WHERE id = ?', [req.params.id])
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

    // Use local file path
    const imageUrl = `/uploads/gallery/${req.file.filename}`

    const db = getDatabase()
    const result = await db.run(
      `INSERT INTO gallery (title, description, image, category, active, order_index) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || '', imageUrl, category || 'event', active !== undefined ? active : 1, order_index || 0]
    )

    const newImage = await db.get('SELECT * FROM gallery WHERE id = ?', result.lastID)
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
    const db = getDatabase()

    const galleryItem = await db.get('SELECT * FROM gallery WHERE id = ?', req.params.id)
    if (!galleryItem) {
      return res.status(404).json({ success: false, error: 'Image not found' })
    }

    // Use local file path if new image uploaded
    const image = req.file ? `/uploads/gallery/${req.file.filename}` : galleryItem.image

    await db.run(
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

    const updatedImage = await db.get('SELECT * FROM gallery WHERE id = ?', req.params.id)
    res.json({ success: true, data: updatedImage })
  } catch (error) {
    console.error('Error updating image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete gallery image
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase()
    const galleryItem = await db.get('SELECT * FROM gallery WHERE id = ?', req.params.id)
    
    if (!galleryItem) {
      return res.status(404).json({ success: false, error: 'Gallery image not found' })
    }

    await db.run('DELETE FROM gallery WHERE id = ?', req.params.id)
    
    res.json({ success: true, message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
