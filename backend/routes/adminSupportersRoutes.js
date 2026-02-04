import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
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
      { folder: 'lyalmha-america/supporters' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}

// GET all supporters (public - no auth)
router.get('/', async (req, res) => {
  try {
    const supporters = await QueryHelper.all('SELECT * FROM supporters ORDER BY type, name')
    res.json({ success: true, data: supporters })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET supporters by type
router.get('/type/:type', async (req, res) => {
  try {
    const supporters = await QueryHelper.all('SELECT * FROM supporters WHERE type = ? ORDER BY name', [req.params.type])
    res.json({ success: true, data: supporters })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create supporter
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name, type, contact_person, description } = req.body
    
    if (!name || !type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and type are required' 
      })
    }
    
    let logoUrl = null
    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer)
    }
    
    const result = await QueryHelper.run(`
      INSERT INTO supporters (name, type, logo, contact_person, description)
      VALUES (?, ?, ?, ?, ?)
    `, [name, type, logoUrl, contact_person, description])
    
    const newSupporter = await QueryHelper.get('SELECT * FROM supporters WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newSupporter })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update supporter
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { name, type, contact_person, description } = req.body
    const supporter = await QueryHelper.get('SELECT * FROM supporters WHERE id = ?', [req.params.id])
    
    if (!supporter) {
      return res.status(404).json({ success: false, error: 'Supporter not found' })
    }
    
    let logoUrl = supporter.logo
    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer)
    }
    
    await QueryHelper.run(`
      UPDATE supporters 
      SET name = ?, type = ?, logo = ?, contact_person = ?, description = ?
      WHERE id = ?
    `, [
      name || supporter.name,
      type || supporter.type,
      logoUrl,
      contact_person || supporter.contact_person,
      description || supporter.description,
      req.params.id
    ])
    
    const updatedSupporter = await QueryHelper.get('SELECT * FROM supporters WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedSupporter })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE supporter
router.delete('/:id', async (req, res) => {
  try {
    const supporter = await QueryHelper.get('SELECT * FROM supporters WHERE id = ?', [req.params.id])
    
    if (!supporter) {
      return res.status(404).json({ success: false, error: 'Supporter not found' })
    }
    
    await QueryHelper.run('DELETE FROM supporters WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Supporter deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
