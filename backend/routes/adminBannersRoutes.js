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
    console.log('📋 Fetched', banners.length, 'banners for admin')
    res.json({ success: true, data: banners })
  } catch (error) {
    console.error('❌ Error fetching banners:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// POST create banner
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const db = await getDatabase()
    const { title, description, position, active } = req.body
    
    console.log('📝 Creating banner for position:', position)
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image is required' 
      })
    }
    
    // Upload to Cloudinary
    console.log('☁️  Uploading to Cloudinary...')
    const imageUrl = await uploadToCloudinary(req.file.buffer)
    console.log('✅ Image uploaded:', imageUrl)
    
    // Auto-calculate order_index (get max for this position and add 1)
    const maxOrder = await db.get(
      'SELECT MAX(order_index) as max FROM banners WHERE position = ?', 
      [position || 'home']
    )
    const nextOrder = (maxOrder?.max || 0) + 1
    
    console.log('📊 Auto-assigned order:', nextOrder)
    
    const result = await db.run(`
      INSERT INTO banners (title, description, image, position, order_index, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      title,
      description,
      imageUrl,
      position || 'home',
      nextOrder,
      active === 'true' || active === true || active === 1 ? 1 : 0
    )
    
    const newBanner = await db.get('SELECT * FROM banners WHERE id = ?', result.lastID)
    console.log('✅ Banner created successfully')
    
    res.status(201).json({ success: true, data: newBanner })
  } catch (error) {
    console.error('❌ Error creating banner:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update banner
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const db = await getDatabase()
    console.log('='.repeat(60))
    console.log('📝 BANNER UPDATE RECEIVED')
    console.log('Banner ID:', req.params.id)
    console.log('Request body keys:', Object.keys(req.body))
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    console.log('Has file:', !!req.file)
    
    const { title, description, position, active } = req.body
    console.log('Extracted fields:')
    console.log('  - title:', title, '(type:', typeof title, ')')
    console.log('  - description:', description, '(type:', typeof description, ')')
    console.log('  - position:', position, '(type:', typeof position, ')')
    console.log('  - active:', active, '(type:', typeof active, ')')
    
    const banner = await db.get('SELECT * FROM banners WHERE id = ?', req.params.id)
    
    if (!banner) {
      console.log('❌ Banner not found:', req.params.id)
      return res.status(404).json({ success: false, error: 'Banner not found' })
    }
    
    console.log('📋 Current banner in DB:', JSON.stringify(banner, null, 2))
    
    // Upload to Cloudinary if new image provided
    let imageUrl = banner.image
    if (req.file) {
      try {
        console.log('☁️  Uploading to Cloudinary...')
        imageUrl = await uploadToCloudinary(req.file.buffer)
        console.log('✅ Image uploaded:', imageUrl)
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError)
        return res.status(500).json({ 
          success: false, 
          error: 'Image upload failed: ' + uploadError.message 
        })
      }
    }
    
    // If position changed, recalculate order_index
    let order_index = banner.order_index
    if (position && position !== banner.position) {
      const maxOrder = await db.get(
        'SELECT MAX(order_index) as max FROM banners WHERE position = ?', 
        [position]
      )
      order_index = (maxOrder?.max || 0) + 1
      console.log('📊 Position changed, new order:', order_index)
    }
    
    // Determine final values - use provided or keep existing
    const finalTitle = title || banner.title
    const finalDescription = description !== undefined ? description : banner.description
    const finalPosition = position || banner.position
    const finalActive = active !== undefined ? (active === 'true' || active === '1' || active === true || active === 1 ? 1 : 0) : banner.active
    
    console.log('🎯 Computing final values:')
    console.log('  - finalTitle:', finalTitle)
    console.log('  - finalDescription:', finalDescription)
    console.log('  - finalPosition:', finalPosition)
    console.log('  - finalActive:', finalActive, '(computed from active:', active, ')')
    
    console.log('💾 Executing UPDATE query with:', {
      title: finalTitle,
      description: finalDescription,
      image: imageUrl,
      position: finalPosition,
      order_index: order_index,
      active: finalActive,
      id: req.params.id
    })
    
    const result = await db.run(`
      UPDATE banners 
      SET title = ?, description = ?, image = ?, 
          position = ?, order_index = ?, active = ?
      WHERE id = ?
    `,
      finalTitle,
      finalDescription,
      imageUrl,
      finalPosition,
      order_index,
      finalActive,
      req.params.id
    )
    
    console.log('📊 UPDATE result:', result)
    console.log('  - changes:', result.changes)
    console.log('  - lastID:', result.lastID)
    
    const updatedBanner = await db.get('SELECT * FROM banners WHERE id = ?', req.params.id)
    
    console.log('✅ Banner after UPDATE:', JSON.stringify(updatedBanner, null, 2))
    console.log('='.repeat(60))
    res.json({ success: true, data: updatedBanner })
  } catch (error) {
    console.error('='.repeat(60))
    console.error('❌ ERROR UPDATING BANNER')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('='.repeat(60))
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
