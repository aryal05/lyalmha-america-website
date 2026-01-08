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

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/blogs')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname))
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

// GET all blogs (public - no auth)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    const blogs = await db.all(`
      SELECT * FROM blogs 
      WHERE status = 'published' 
      ORDER BY created_at DESC
    `)
    
    res.json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication (MUST be before /:id route)
router.use('/admin/*', authenticateToken)

// GET all blogs (admin - includes drafts)
router.get('/admin/all', async (req, res) => {
  const db = getDatabase()
  try {
    const blogs = await db.all('SELECT * FROM blogs ORDER BY created_at DESC')
    res.json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single blog (public - no auth)
router.get('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', req.params.id)
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Protected routes - require authentication
router.use(authenticateToken)

// POST create new blog
router.post('/', upload.single('banner'), async (req, res) => {
  const db = getDatabase()
  try {
    const { title, excerpt, content, category, author, status } = req.body
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, excerpt, and content are required' 
      })
    }
    
    // Use local file path if image provided
    const banner = req.file ? `/uploads/blogs/${req.file.filename}` : null
    
    const readTime = Math.ceil(content.split(' ').length / 200)
    const date = new Date().toISOString().split('T')[0]
    
    const result = await db.run(`
      INSERT INTO blogs (title, excerpt, content, banner, category, author, date, read_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      excerpt,
      content,
      banner,
      category || 'General',
      author || 'Admin',
      date,
      readTime,
      status || 'draft'
    ])
    
    const newBlog = await db.get('SELECT * FROM blogs WHERE id = ?', result.lastID)
    
    res.status(201).json({ success: true, data: newBlog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update blog
router.put('/:id', upload.single('banner'), async (req, res) => {
  const db = getDatabase()
  try {
    const { title, excerpt, content, category, author, status } = req.body
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', req.params.id)
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    // Use local file path if new image provided
    const banner = req.file ? `/uploads/blogs/${req.file.filename}` : blog.banner
    const readTime = content ? Math.ceil(content.split(' ').length / 200) : blog.read_time
    
    await db.run(`
      UPDATE blogs 
      SET title = ?, excerpt = ?, content = ?, banner = ?, 
          category = ?, author = ?, read_time = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || blog.title,
      excerpt || blog.excerpt,
      content || blog.content,
      banner,
      category || blog.category,
      author || blog.author,
      readTime,
      status || blog.status,
      req.params.id
    ])
    
    const updatedBlog = await db.get('SELECT * FROM blogs WHERE id = ?', req.params.id)
    
    res.json({ success: true, data: updatedBlog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE blog
router.delete('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const blog = await db.get('SELECT * FROM blogs WHERE id = ?', req.params.id)
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    await db.run('DELETE FROM blogs WHERE id = ?', req.params.id)
    
    res.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
