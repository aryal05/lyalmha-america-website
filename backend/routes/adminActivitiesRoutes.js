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
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg/
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
router.post('/', authenticateAdmin, upload.fields([{ name: 'image' }, { name: 'iconImage' }]), async (req, res) => {
  try {
    const { title, description, category, icon, orderIndex, active } = req.body
    let imageUrl = null
    let iconImageUrl = null

    if (req.files?.image) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'lyalmha-activities', transformation: [{ width: 800, height: 600, crop: 'limit' }] },
        (error, result) => result
      )
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lyalmha-activities', transformation: [{ width: 800, height: 600, crop: 'limit' }] },
          (error, result) => {
            if (error) reject(error)
            else { imageUrl = result.secure_url; resolve() }
          }
        )
        stream.end(req.files.image[0].buffer)
      })
    }

    if (req.files?.iconImage) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lyalmha-activities/icons', transformation: [{ width: 200, height: 200, crop: 'limit' }] },
          (error, result) => {
            if (error) reject(error)
            else { iconImageUrl = result.secure_url; resolve() }
          }
        )
        stream.end(req.files.iconImage[0].buffer)
      })
    }

    const db = getDatabase()
    const result = await db.run(
      `INSERT INTO activities (title, description, category, image, icon, icon_image, order_index, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category || 'kids', imageUrl, icon || '', iconImageUrl, orderIndex || 0, active || 1]
    )

    const newActivity = await db.get('SELECT * FROM activities WHERE id = ?', [result.lastID])
    res.status(201).json({ success: true, data: newActivity })
  } catch (error) {
    console.error('Error creating activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update activity (Admin only)
router.put('/:id', authenticateAdmin, upload.fields([{ name: 'image' }, { name: 'iconImage' }]), async (req, res) => {
  try {
    const { title, description, category, icon, orderIndex, active } = req.body
    const db = getDatabase()

    const existingActivity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    if (!existingActivity) {
      return res.status(404).json({ success: false, error: 'Activity not found' })
    }

    let imageUrl = existingActivity.image
    let iconImageUrl = existingActivity.icon_image

    if (req.files?.image) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lyalmha-activities', transformation: [{ width: 800, height: 600, crop: 'limit' }] },
          (error, result) => {
            if (error) reject(error)
            else { imageUrl = result.secure_url; resolve() }
          }
        )
        stream.end(req.files.image[0].buffer)
      })
    }

    if (req.files?.iconImage) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lyalmha-activities/icons', transformation: [{ width: 200, height: 200, crop: 'limit' }] },
          (error, result) => {
            if (error) reject(error)
            else { iconImageUrl = result.secure_url; resolve() }
          }
        )
        stream.end(req.files.iconImage[0].buffer)
      })
    }

    await db.run(
      `UPDATE activities 
       SET title = ?, description = ?, category = ?, image = ?, icon = ?, icon_image = ?, order_index = ?, active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, category || 'kids', imageUrl, icon || '', iconImageUrl, orderIndex || 0, active || 1, req.params.id]
    )

    const updatedActivity = await db.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    res.json({ success: true, data: updatedActivity })
  } catch (error) {
    console.error('Error updating activity:', error)
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
