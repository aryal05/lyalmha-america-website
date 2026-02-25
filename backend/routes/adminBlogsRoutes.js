import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload, uploadToCloudinary } from '../utils/uploadHelper.js'

const router = express.Router()

// GET all blogs (public - no auth)
router.get('/', async (req, res) => {
  try {
    const blogs = await QueryHelper.all(`
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
  try {
    const blogs = await QueryHelper.all('SELECT * FROM blogs ORDER BY created_at DESC')
    res.json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single blog (public - no auth)
router.get('/:id', async (req, res) => {
  try {
    const blog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    
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
  try {
    console.log('Creating new blog...')
    console.log('Request body:', req.body)
    console.log('Has file:', !!req.file)
    
    const { title, excerpt, content, category, author, status, link } = req.body
    
    if (!title || !excerpt || !content) {
      console.log('Validation failed - missing required fields')
      return res.status(400).json({ 
        success: false, 
        error: 'Title, excerpt, and content are required' 
      })
    }
    
    // Upload to Cloudinary if image provided
    let banner = null
    if (req.file) {
      try {
        console.log('Uploading image to Cloudinary...')
        banner = await uploadToCloudinary(req.file.buffer, 'blogs')
        console.log('Image uploaded:', banner)
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError)
        return res.status(500).json({ success: false, error: 'Image upload failed: ' + uploadError.message })
      }
    }
    
    const readTime = Math.ceil(content.split(' ').length / 200) || 5
    const date = new Date().toISOString().split('T')[0]
    const finalStatus = status || 'published'
    
    console.log('Inserting blog with status:', finalStatus)
    
    const result = await QueryHelper.run(`
      INSERT INTO blogs (title, excerpt, content, banner, category, author, date, read_time, status, link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      excerpt,
      content,
      banner,
      category || 'General',
      author || 'Admin',
      date,
      readTime,
      finalStatus,
      link || null
    ])
    
    console.log('Insert result:', result)
    
    const newBlog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [result.lastID])
    
    console.log('New blog created:', newBlog?.id)
    res.status(201).json({ success: true, data: newBlog })
  } catch (error) {
    console.error('Error creating blog:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update blog
router.put('/:id', upload.single('banner'), async (req, res) => {
  try {
    console.log('Updating blog:', req.params.id)
    console.log('Request body:', req.body)
    console.log('Has file:', !!req.file)
    
    const { title, excerpt, content, category, author, status, link } = req.body
    const blog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    // Upload to Cloudinary if new image provided
    let banner = blog.banner
    if (req.file) {
      try {
        banner = await uploadToCloudinary(req.file.buffer, 'blogs')
        console.log('Image uploaded to Cloudinary:', banner)
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError)
        return res.status(500).json({ success: false, error: 'Image upload failed: ' + uploadError.message })
      }
    }
    
    const readTime = content ? Math.ceil(content.split(' ').length / 200) : blog.read_time
    
    await QueryHelper.run(`
      UPDATE blogs 
      SET title = ?, excerpt = ?, content = ?, banner = ?, 
          category = ?, author = ?, read_time = ?, status = ?, link = ?,
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
      link !== undefined ? link : blog.link,
      req.params.id
    ])
    
    const updatedBlog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedBlog })
  } catch (error) {
    console.error('Error updating blog:', error)
    res.status(500).json({ success: false, error: error.message, stack: error.stack })
  }
})

// DELETE blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await QueryHelper.get('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    await QueryHelper.run('DELETE FROM blogs WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
