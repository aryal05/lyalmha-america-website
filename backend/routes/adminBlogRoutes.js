import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads')
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
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// GET all blogs (public)
router.get('/', async (req, res) => {
  try {
    const { status = 'published', category, limit = 100 } = req.query

    let query = 'SELECT * FROM blogs WHERE status = ?'
    const params = [status]

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    query += ' ORDER BY date DESC LIMIT ?'
    params.push(parseInt(limit))

    const blogs = await QueryHelper.all(query, params)

    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    console.error('Get blogs error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET single blog (public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    res.json({ success: true, data: blog })
  } catch (error) {
    console.error('Get blog error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// CREATE blog (admin only)
router.post('/', authenticateToken, isAdmin, upload.single('banner'), async (req, res) => {
  try {
    const { title, excerpt, content, category, author, date, readTime, status = 'published' } = req.body

    if (!title || !excerpt || !content || !category || !author) {
      return res.status(400).json({ error: 'Required fields missing' })
    }

    const banner = req.file ? `/uploads/${req.file.filename}` : null

    const result = await QueryHelper.run(
      `INSERT INTO blogs (title, excerpt, content, banner, category, author, date, read_time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, excerpt, content, banner, category, author, date || new Date().toISOString().split('T')[0], readTime || 5, status]
    )

    const newBlog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [result.lastID])

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    })
  } catch (error) {
    console.error('Create blog error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// UPDATE blog (admin only)
router.put('/:id', authenticateToken, isAdmin, upload.single('banner'), async (req, res) => {
  try {
    const { title, excerpt, content, category, author, date, readTime, status } = req.body

    const existingBlog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])

    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const banner = req.file ? `/uploads/${req.file.filename}` : existingBlog.banner

    await QueryHelper.run(
      `UPDATE blogs SET 
        title = ?, excerpt = ?, content = ?, banner = ?, category = ?, 
        author = ?, date = ?, read_time = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title || existingBlog.title,
        excerpt || existingBlog.excerpt,
        content || existingBlog.content,
        banner,
        category || existingBlog.category,
        author || existingBlog.author,
        date || existingBlog.date,
        readTime || existingBlog.read_time,
        status || existingBlog.status,
        req.params.id
      ]
    )

    const updatedBlog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    })
  } catch (error) {
    console.error('Update blog error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE blog (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const blog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Delete associated image file if exists
    if (blog.banner && blog.banner.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', blog.banner)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await QueryHelper.run('DELETE FROM blogs WHERE id = ?', [req.params.id])

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    console.error('Delete blog error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
