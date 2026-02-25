import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
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
  try {
    const team = await QueryHelper.all('SELECT * FROM team_members ORDER BY category, order_index, name')
    res.json({ success: true, data: team })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET team by category
router.get('/category/:category', async (req, res) => {
  try {
    const team = await QueryHelper.all('SELECT * FROM team_members WHERE category = ? ORDER BY order_index, name', [req.params.category])
    res.json({ success: true, data: team })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create team member
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, role, category, bio, order_index } = req.body
    const image = req.file ? req.file.path : null
    
    if (!name || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and category are required' 
      })
    }
    
    const result = await QueryHelper.run(`
      INSERT INTO team_members (name, role, category, bio, image, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, role, category, bio, image, order_index || 1])
    
    const newMember = await QueryHelper.get('SELECT * FROM team_members WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newMember })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update team member
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, role, category, bio, order_index } = req.body
    const member = await QueryHelper.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    
    let image = member.image
    
    // If new image is uploaded, delete old one from Cloudinary
    if (req.file) {
      if (member.image) {
        try {
          const publicId = member.image.split('/').slice(-2).join('/').split('.')[0]
          await cloudinary.uploader.destroy(publicId)
        } catch (err) {
          // silently handle
        }
      }
      image = req.file.path
    }
    
    await QueryHelper.run(`
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
    
    const updatedMember = await QueryHelper.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedMember })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE team member
router.delete('/:id', async (req, res) => {
  try {
    const member = await QueryHelper.get('SELECT * FROM team_members WHERE id = ?', [req.params.id])
    
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    
    // Delete image from Cloudinary if exists
    if (member.image) {
      try {
        const publicId = member.image.split('/').slice(-2).join('/').split('.')[0]
        await cloudinary.uploader.destroy(publicId)
      } catch (err) {
        // silently handle
      }
    }
    
    await QueryHelper.run('DELETE FROM team_members WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Team member deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
