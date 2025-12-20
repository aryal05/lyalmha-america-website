import express from 'express'

const router = express.Router()

// Temporary in-memory storage for blogs (will be replaced with database)
let blogs = [
  {
    id: 1,
    title: 'Celebrating Indra Jatra in America: Keeping Traditions Alive',
    excerpt: 'Discover how the Newari community in America celebrates one of the most significant festivals.',
    banner: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&h=600&fit=crop',
    category: 'Festivals',
    author: 'Rajesh Shakya',
    date: '2025-12-15',
    readTime: 5,
    content: 'Full blog content here...'
  }
]

// GET all blogs
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET single blog by ID
router.get('/:id', (req, res) => {
  try {
    const blog = blogs.find(b => b.id === parseInt(req.params.id))
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create new blog
router.post('/', (req, res) => {
  try {
    const { title, excerpt, banner, category, author, content } = req.body
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide title, excerpt, and content' 
      })
    }

    const newBlog = {
      id: blogs.length + 1,
      title,
      excerpt,
      banner: banner || 'https://via.placeholder.com/800x600',
      category: category || 'General',
      author: author || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      readTime: Math.ceil(content.split(' ').length / 200),
      content
    }

    blogs.push(newBlog)
    res.status(201).json({ success: true, data: newBlog })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update blog
router.put('/:id', (req, res) => {
  try {
    const blogIndex = blogs.findIndex(b => b.id === parseInt(req.params.id))
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }

    blogs[blogIndex] = { ...blogs[blogIndex], ...req.body }
    res.json({ success: true, data: blogs[blogIndex] })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE blog
router.delete('/:id', (req, res) => {
  try {
    const blogIndex = blogs.findIndex(b => b.id === parseInt(req.params.id))
    if (blogIndex === -1) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }

    blogs.splice(blogIndex, 1)
    res.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
