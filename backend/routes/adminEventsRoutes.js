import express from 'express'
import { QueryHelper } from '../utils/queryHelper.js'
import { isPostgresDB } from '../database.js'
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

// Helper: get current Eastern Time as ISO date string (YYYY-MM-DD) and time (HH:MM)
const getNowET = () => {
  const now = new Date();
  const etDate = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // YYYY-MM-DD
  const etTime = now.toLocaleTimeString('en-GB', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' }); // HH:MM
  return { etDate, etTime };
};

// Helper: auto-move passed upcoming events to past (based on Eastern Time)
const autoMovePastEvents = async () => {
  const { etDate, etTime } = getNowET();
  await QueryHelper.run(
    `UPDATE events SET event_type = 'past'
     WHERE event_type = 'upcoming'
     AND (LEFT(event_date, 10) < ? OR (LEFT(event_date, 10) = ? AND COALESCE(event_time, '23:59') <= ?))`,
    [etDate, etDate, etTime]
  );
};

// GET all events (public - no auth)
router.get('/', async (req, res) => {
  try {
    await autoMovePastEvents();
    const events = await QueryHelper.all('SELECT * FROM events ORDER BY event_date DESC')
    res.json({ success: true, data: events })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET upcoming events (only events whose date+time is still in the future in ET)
router.get('/upcoming', async (req, res) => {
  try {
    await autoMovePastEvents();
    const events = await QueryHelper.all(
      'SELECT * FROM events WHERE event_type = ? ORDER BY event_date ASC',
      ['upcoming']
    );
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET past events (includes auto-moved events whose date has passed)
router.get('/past', async (req, res) => {
  try {
    await autoMovePastEvents();
    const events = await QueryHelper.all(
      'SELECT * FROM events WHERE event_type = ? ORDER BY event_date DESC',
      ['past']
    );
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await QueryHelper.get('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    // Also fetch event images
    const images = await QueryHelper.all(
      'SELECT * FROM event_images WHERE event_id = ? ORDER BY is_thumbnail DESC, created_at ASC',
      [req.params.id]
    );
    
    res.json({ success: true, data: { ...event, images } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin routes - require authentication
router.use(authenticateToken)

// POST create event
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, event_date, event_time, location, event_type } = req.body
    
    if (!title || !event_date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and event date are required' 
      })
    }
    
    // Upload to Cloudinary if image provided
    const image = req.file ? await uploadToCloudinary(req.file.buffer) : null
    
    const result = await QueryHelper.run(`
      INSERT INTO events (title, description, event_date, event_time, location, event_type, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, description, event_date, event_time || null, location, event_type, image])
    
    const newEvent = await QueryHelper.get('SELECT * FROM events WHERE id = ?', [result.lastID])
    
    res.status(201).json({ success: true, data: newEvent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// PUT update event
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, event_date, event_time, location, event_type } = req.body
    const event = await QueryHelper.get('SELECT * FROM events WHERE id = ?', [req.params.id])
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }
    
    // Upload to Cloudinary if new image provided
    const image = req.file ? await uploadToCloudinary(req.file.buffer) : event.image
    
    await QueryHelper.run(`
      UPDATE events 
      SET title = ?, description = ?, event_date = ?, event_time = ?,
          location = ?, event_type = ?, image = ?
      WHERE id = ?
    `, [
      title || event.title,
      description || event.description,
      event_date || event.event_date,
      event_time !== undefined ? event_time : event.event_time,
      location || event.location,
      event_type || event.event_type,
      image,
      req.params.id
    ])
    
    const updatedEvent = await QueryHelper.get('SELECT * FROM events WHERE id = ?', [req.params.id])
    
    res.json({ success: true, data: updatedEvent })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await QueryHelper.get('SELECT * FROM events WHERE id = ?', [req.params.id])
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }
    
    await QueryHelper.run('DELETE FROM events WHERE id = ?', [req.params.id])
    
    res.json({ success: true, message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
