import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { QueryHelper } from '../utils/queryHelper.js'
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
    const activities = await QueryHelper.all(
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
    const activity = await QueryHelper.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
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
    console.log('Creating new activity...')
    console.log('Request body:', req.body)
    console.log('Has files:', !!req.files)
    
    const { title, description, category, icon, orderIndex, active } = req.body
    
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' })
    }
    
    let imageUrl = null
    let iconImageUrl = null

    // Check if Cloudinary is configured
    const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                  process.env.CLOUDINARY_API_KEY && 
                                  process.env.CLOUDINARY_API_SECRET

    if (req.files?.image && cloudinaryConfigured) {
      try {
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
        console.log('Main image uploaded:', imageUrl)
      } catch (uploadError) {
        console.error('Error uploading main image:', uploadError)
        // Continue without image if upload fails
      }
    } else if (req.files?.image && !cloudinaryConfigured) {
      console.warn('Cloudinary not configured, skipping image upload')
    }

    if (req.files?.iconImage && cloudinaryConfigured) {
      try {
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
        console.log('Icon image uploaded:', iconImageUrl)
      } catch (uploadError) {
        console.error('Error uploading icon image:', uploadError)
      }
    }

    console.log('Inserting activity into database...')
    console.log('Values:', { title, description, category: category || 'kids', imageUrl, icon: icon || '', iconImageUrl, orderIndex: parseInt(orderIndex) || 0, active: parseInt(active) || 1 })
    
    const result = await QueryHelper.run(
      `INSERT INTO activities (title, description, category, image, icon, icon_image, order_index, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category || 'kids', imageUrl, icon || '', iconImageUrl, parseInt(orderIndex) || 0, parseInt(active) || 1]
    )

    console.log('Insert result:', result)
    const newActivity = await QueryHelper.get('SELECT * FROM activities WHERE id = ?', [result.lastID])
    console.log('New activity created:', newActivity?.id)
    
    res.status(201).json({ success: true, data: newActivity })
  } catch (error) {
    console.error('Error creating activity:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({ success: false, error: error.message, details: error.stack })
  }
})

// Update activity (Admin only)
router.put('/:id', authenticateAdmin, upload.fields([{ name: 'image' }, { name: 'iconImage' }]), async (req, res) => {
  try {
    console.log('Updating activity:', req.params.id)
    const { title, description, category, icon, orderIndex, active } = req.body
    const existingActivity = await QueryHelper.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    if (!existingActivity) {
      return res.status(404).json({ success: false, error: 'Activity not found' })
    }

    let imageUrl = existingActivity.image
    let iconImageUrl = existingActivity.icon_image
    let iconText = icon || existingActivity.icon

    if (req.files?.image) {
      try {
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
        console.log('Updated main image:', imageUrl)
      } catch (uploadError) {
        console.error('Error uploading main image:', uploadError)
      }
    }

    if (req.files?.iconImage) {
      try {
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
        console.log('Updated icon image:', iconImageUrl)
      } catch (uploadError) {
        console.error('Error uploading icon image:', uploadError)
      }
    }

    await QueryHelper.run(
      `UPDATE activities 
       SET title = ?, description = ?, category = ?, image = ?, icon = ?, icon_image = ?, order_index = ?, active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title || existingActivity.title, description || existingActivity.description, category || existingActivity.category, imageUrl, iconText, iconImageUrl, parseInt(orderIndex) || existingActivity.order_index, parseInt(active) ?? existingActivity.active, req.params.id]
    )

    const updatedActivity = await QueryHelper.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    res.json({ success: true, data: updatedActivity })
  } catch (error) {
    console.error('Error updating activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete activity (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const activity = await QueryHelper.get('SELECT * FROM activities WHERE id = ?', [req.params.id])
    
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' })
    }

    // Soft delete
    await QueryHelper.run('UPDATE activities SET active = 0 WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Error deleting activity:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
