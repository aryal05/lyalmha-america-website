import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { getDatabase } from '../database.js'
import { authenticateAdmin } from '../middleware/auth.js'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/activities')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// Get all activities
router.get('/', async (req, res) => {
  try {
    const db = getDatabase()
    const activities = await db.all(
      'SELECT * FROM activities WHERE active = 1 ORDER BY order_index ASC, created_at DESC'
    )
    res.json({ success: true, data: activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase()
    const activity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' })
    }
    res.json({ success: true, data: activity })
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create new activity (Admin only)
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, detailedInfo, benefits, ageGroup, icon } = req.body
    let imageUrl = null

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'lyalmha-activities',
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
      })
      imageUrl = result.secure_url
      // Delete local file
      fs.unlinkSync(req.file.path)
    }

    const db = getDatabase()
    const result = await db.run(
      `INSERT INTO activities (title, description, category, image, detailed_info, benefits, age_group, icon) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category, imageUrl, detailedInfo, benefits, ageGroup, icon]
    )

    const newActivity = await db.get('SELECT * FROM activities WHERE id = ?', [result.lastID])
    res.status(201).json({ success: true, data: newActivity })
  } catch (error) {
    console.error('Error creating activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update activity (Admin only)
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('🎨 Updating activity:', req.params.id)
    console.log('📦 Request body:', req.body)
    console.log('📸 Has file:', !!req.file)
    
    const { title, description, category, detailedInfo, benefits, ageGroup, icon, orderIndex } = req.body
    const db = getDatabase()

    const existingActivity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    if (!existingActivity) {
      return res.status(404).json({ success: false, error: 'Activity not found' })
    }

    let imageUrl = existingActivity.image

    if (req.file) {
      try {
        console.log('☁️  Uploading to Cloudinary...')
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'lyalmha-activities',
          transformation: [{ width: 800, height: 600, crop: 'limit' }],
        })
        imageUrl = result.secure_url
        console.log('✅ Image uploaded:', imageUrl)
        fs.unlinkSync(req.file.path)
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError)
        return res.status(500).json({ 
          success: false, 
          error: 'Image upload failed: ' + uploadError.message 
        })
      }
    }

    await db.run(
      `UPDATE activities 
       SET title = ?, description = ?, category = ?, image = ?, detailed_info = ?, 
           benefits = ?, age_group = ?, icon = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, category, imageUrl, detailedInfo, benefits, ageGroup, icon, orderIndex || 0, req.params.id]
    )

    const updatedActivity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    console.log('✅ Activity updated successfully')
    res.json({ success: true, data: updatedActivity })
  } catch (error) {
    console.error('❌ Error updating activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete activity (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const db = getDatabase()
    const activity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' })
    }

    // Soft delete
    await db.run('UPDATE activities SET active = 0 WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Error deleting activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
