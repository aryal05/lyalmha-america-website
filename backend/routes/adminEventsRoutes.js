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
      { folder: 'lyalmha-america/events' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}

// GET all events (public - no auth)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    const events = await db.all('SELECT * FROM events ORDER BY event_date DESC')
    res.json({ success: true, data: events })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET upcoming events
router.get('/upcoming', async (req, res) => {
  const db = getDatabase()
  try {
    const events = await db.all(`
      SELECT * FROM events 
      WHERE event_date >= date('now') 
      ORDER BY event_date ASC
    `)
    res.json({ success: true, data: events })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET past events
router.get('/past', async (req, res) => {
  const db = getDatabase()
  try {
    const events = await db.all(`
      SELECT * FROM events 
      WHERE event_date < date('now') 
      ORDER BY event_date DESC
    `)
    res.json({ success: true, data: events })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Admin routes - require authentication
router.use(authenticateToken)

// POST create event
router.post('/', upload.single('image'), async (req, res) => {
  const db = getDatabase()
  try {
    const { title, description, event_date, location, event_type } = req.body
    
    if (!title || !event_date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and event date are required' 
      })
    }
    
    // Upload to Cloudinary if image provided
    const image = req.file ? await uploadToCloudinary(req.file.buffer) : null
    
    const stmt = db.prepare(`
      INSERT INTO events (title, description, event_date, location, event_type, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(title, description, event_date, location, event_type, image)
    const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid)
    
    res.status(201).json({ success: true, data: newEvent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update event
router.put('/:id', upload.single('image'), async (req, res) => {
  const db = getDatabase()
  try {
    const { title, description, event_date, location, event_type } = req.body
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }
    
    // Upload to Cloudinary if new image provided
    const image = req.file ? await uploadToCloudinary(req.file.buffer) : event.image
    
    const stmt = db.prepare(`
      UPDATE events 
      SET title = ?, description = ?, event_date = ?, 
          location = ?, event_type = ?, image = ?
      WHERE id = ?
    `)
    
    stmt.run(
      title || event.title,
      description || event.description,
      event_date || event.event_date,
      location || event.location,
      event_type || event.event_type,
      image,
      req.params.id
    )
    
    const updatedEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
    
    res.json({ success: true, data: updatedEvent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE event
router.delete('/:id', (req, res) => {
  const db = getDatabase()
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }
    
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id)
    
    res.json({ success: true, message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
