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
    const uploadPath = path.join(__dirname, '../uploads/news')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname))
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

// Get all news
router.get('/', async (req, res) => {
  try {
    const db = getDatabase()
    const news = await db.all(
      'SELECT * FROM news WHERE active = 1 ORDER BY published_date DESC, order_index ASC'
    )
    res.json({ success: true, data: news })
  } catch (error) {
    console.error('Error fetching news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single news item
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase()
    const newsItem = await db.get('SELECT * FROM news WHERE id = ?', [req.params.id])
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'News not found' })
    }
    res.json({ success: true, data: newsItem })
  } catch (error) {
    console.error('Error fetching news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Protected routes - require authentication
router.use(authenticateToken)

// Create news
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, category, author, published_date, active, order_index } = req.body
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, excerpt, and content are required' 
      })
    }
    
    // Use local file path if image uploaded
    const image = req.file ? `/uploads/news/${req.file.filename}` : null
    
    const date = published_date || new Date().toISOString().split('T')[0]

    const db = getDatabase()
    const result = await db.run(
      `INSERT INTO news (title, excerpt, content, image, author, category, published_date, active, order_index) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        excerpt,
        content,
        image,
        author || 'Admin',
        category || 'announcement',
        date,
        active !== undefined ? active : 1,
        order_index || 0
      ]
    )

    const newNews = await db.get('SELECT * FROM news WHERE id = ?', result.lastID)
    res.status(201).json({ success: true, data: newNews })
  } catch (error) {
    console.error('Error creating news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update news
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, category, author, published_date, active, order_index } = req.body
    const db = getDatabase()

    const newsItem = await db.get('SELECT * FROM news WHERE id = ?', req.params.id)
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'News not found' })
    }

    // Use local file path if new image uploaded
    const image = req.file ? `/uploads/news/${req.file.filename}` : newsItem.image

    await db.run(
      `UPDATE news 
       SET title = ?, excerpt = ?, content = ?, image = ?, 
           category = ?, author = ?, published_date = ?, active = ?, order_index = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title || newsItem.title,
        excerpt || newsItem.excerpt,
        content || newsItem.content,
        image,
        category || newsItem.category,
        author || newsItem.author,
        published_date || newsItem.published_date,
        active !== undefined ? active : newsItem.active,
        order_index !== undefined ? order_index : newsItem.order_index,
        req.params.id
      ]
    )

    const updatedNews = await db.get('SELECT * FROM news WHERE id = ?', req.params.id)
    res.json({ success: true, data: updatedNews })
  } catch (error) {
    console.error('Error updating news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase()
    const newsItem = await db.get('SELECT * FROM news WHERE id = ?', req.params.id)
    
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'News item not found' })
    }

    await db.run('DELETE FROM news WHERE id = ?', req.params.id)
    
    res.json({ success: true, message: 'News item deleted successfully' })
  } catch (error) {
    console.error('Error deleting news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
