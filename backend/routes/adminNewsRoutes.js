import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { authenticateToken } from '../middleware/auth.js'
import { upload, uploadToCloudinary } from '../utils/uploadHelper.js'

const router = express.Router()

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await QueryHelper.all(
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
    const newsItem = await QueryHelper.get('SELECT * FROM news WHERE id = ?', [req.params.id])
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
    console.log('📰 Creating news...')
    console.log('📦 Request body:', req.body)
    console.log('📸 Has file:', !!req.file)
    
    const { title, excerpt, content, category, author, published_date, active, order_index, link } = req.body
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, excerpt, and content are required' 
      })
    }
    
    // Check if Cloudinary is configured
    const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                  process.env.CLOUDINARY_API_KEY && 
                                  process.env.CLOUDINARY_API_SECRET

    // Upload to Cloudinary if image uploaded and configured
    let image = null
    if (req.file && cloudinaryConfigured) {
      try {
        image = await uploadToCloudinary(req.file.buffer, 'news')
        console.log('☁️ Image uploaded:', image)
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        // Continue without image if upload fails
      }
    } else if (req.file && !cloudinaryConfigured) {
      console.warn('Cloudinary not configured, skipping image upload')
    }
    
    const date = published_date || new Date().toISOString().split('T')[0]

    console.log('Inserting news into database...')
    console.log('Values:', { title, excerpt, content: content.substring(0, 50) + '...', image, author, category, date, active, order_index, link })

    const result = await QueryHelper.run(
      `INSERT INTO news (title, excerpt, content, image, author, category, published_date, active, order_index, link) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        excerpt,
        content,
        image,
        author || 'Admin',
        category || 'announcement',
        date,
        active !== undefined ? parseInt(active) : 1,
        order_index ? parseInt(order_index) : 0,
        link || null
      ]
    )

    console.log('Insert result:', result)
    const newNews = await QueryHelper.get('SELECT * FROM news WHERE id = ?', [result.lastID])
    console.log('New news created:', newNews?.id)
    
    res.status(201).json({ success: true, data: newNews })
  } catch (error) {
    console.error('Error creating news:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({ success: false, error: error.message, details: error.stack })
  }
})

// Update news
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    console.log('📰 Updating news:', req.params.id)
    console.log('📦 Request body:', req.body)
    console.log('📸 Has file:', !!req.file)
    
    const { title, excerpt, content, category, author, published_date, active, order_index, link } = req.body
    const newsItem = await QueryHelper.get('SELECT * FROM news WHERE id = ?', [req.params.id])
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'News not found' })
    }

    // Upload to Cloudinary if new image uploaded
    let image = newsItem.image
    if (req.file) {
      try {
        console.log('☁️  Uploading to Cloudinary...')
        image = await uploadToCloudinary(req.file.buffer, 'news')
        console.log('✅ Image uploaded:', image)
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError)
        return res.status(500).json({ 
          success: false, 
          error: 'Image upload failed: ' + uploadError.message 
        })
      }
    }

    await QueryHelper.run(
      `UPDATE news 
       SET title = ?, excerpt = ?, content = ?, image = ?, 
           category = ?, author = ?, published_date = ?, active = ?, order_index = ?, link = ?,
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
        link !== undefined ? link : newsItem.link,
        req.params.id
      ]
    )

    const updatedNews = await QueryHelper.get('SELECT * FROM news WHERE id = ?', [req.params.id])
    console.log('✅ News updated successfully')
    res.json({ success: true, data: updatedNews })
  } catch (error) {
    console.error('❌ Error updating news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const newsItem = await QueryHelper.get('SELECT * FROM news WHERE id = ?', [req.params.id])
    
    if (!newsItem) {
      return res.status(404).json({ success: false, error: 'News item not found' })
    }

    await QueryHelper.run('DELETE FROM news WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'News item deleted successfully' })
  } catch (error) {
    console.error('Error deleting news:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
