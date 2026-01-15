import express from 'express'
import { getDatabase } from '../database.js'
import { authenticateToken } from '../middleware/auth.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import '../config/cloudinary.js'

const router = express.Router()

// Configure Cloudinary storage for team images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'team',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
  }
})

const upload = multer({ storage: storage })

// GET all team members (public - no auth)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    const team = await db.all('SELECT * FROM team_members ORDER BY category, order_index, name')
    console.log('GET /team - Fetched team members:', team)
    console.log('GET /team - Number of members:', team.length)
    if (team.length > 0) {
      console.log('GET /team - First member:', team[0])
    }
    res.json({ success: true, data: team })
  } catch (error) {
    console.error('GET /team - Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET team by category
router.get('/category/:category', async (req, res) => {
  const db = getDatabase()
  try {
    const team = await db.all('SELECT * FROM team_members WHERE category = ? ORDER BY order_index, name', [req.params.category])
    res.json({ success: true, data: team })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create team member
router.post('/', upload.single('image'), async (req, res) => {
  const db = getDatabase()
  try {
    console.log('POST /team - Request body:', req.body)
    console.log('POST /team - Request file:', req.file)
    
    const { name, role, category, bio, order_index } = req.body
    const image = req.file ? req.file.path : null
    
    console.log('Image path to save:', image)
    
    if (!name || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and category are required' 
      })
    }
    
    const result = await db.run(`
      INSERT INTO team_members (name, role, category, bio, image, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, role, category, bio, image, order_index || 0])
    
    const newMember = await db.get('SELECT * FROM team_members WHERE id = ?', [result.lastID])
    
    console.log('Created team member:', newMember)
    
    res.status(201).json({ success: true, data: newMember })
  } catch (error) {
    console.error('Error creating team member:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update team member
router.put('/:id', upload.single('image'), async (req, res) => {
  const db = getDatabase()
  try {
    console.log('PUT /team/:id - Request body:', req.body)
    console.log('PUT /team/:id - Request file:', req.file)
    
    const { name, role, category, bio, order_index } = req.body
    const member = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    
    let image = member.image
    
    // If new image is uploaded, delete old one from Cloudinary
    if (req.file) {
      console.log('New image uploaded, deleting old image...')
      if (member.image) {
        try {
          const publicId = member.image.split('/').slice(-2).join('/').split('.')[0]
          console.log('Deleting old image with publicId:', publicId)
          await cloudinary.uploader.destroy(publicId)
        } catch (err) {
          console.error('Error deleting old image:', err)
        }
      }
      image = req.file.path
      console.log('New image path:', image)
    }
    
    await db.run(`
      UPDATE team_members 
      SET name = ?, role = ?, category = ?, bio = ?, image = ?, order_index = ?
      WHERE id = ?
    `, [
      name || member.name,
      role || member.role,
      category || member.category,
      bio || member.bio,
      image,
      order_index !== undefined ? order_index : member.order_index,
      req.params.id
    ])
    
    const updatedMember = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    console.log('Updated team member:', updatedMember)
    
    res.json({ success: true, data: updatedMember })
  } catch (error) {
    console.error('Error updating team member:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE team member
router.delete('/:id', async (req, res) => {
  const db = getDatabase()
  try {
    const member = await db.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    
    // Delete image from Cloudinary if exists
    if (member.image) {
      try {
        const publicId = member.image.split('/').slice(-2).join('/').split('.')[0]
        await cloudinary.uploader.destroy(publicId)
      } catch (err) {
        console.error('Error deleting image:', err)
      }
    }
    
    await db.run('DELETE FROM team_members WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
