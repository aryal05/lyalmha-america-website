import express from 'express';
import { QueryHelper } from '../utils/queryHelper.js';

const router = express.Router();

// Submit RSVP
router.post('/', async (req, res) => {
  try {
    const { event_id, name, email, phone, attendees } = req.body;
    
    if (!event_id || !name || !email || !phone || !attendees) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await QueryHelper.run(
      `INSERT INTO event_rsvps (event_id, name, email, phone, attendees) 
       VALUES (?, ?, ?, ?, ?)`,
      [event_id, name, email, phone, attendees]
    );

    res.json({ success: true, message: 'RSVP submitted successfully', id: result.lastID });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP' });
  }
});

export default router;
