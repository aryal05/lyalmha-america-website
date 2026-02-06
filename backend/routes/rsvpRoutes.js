import express from 'express';
import { QueryHelper } from '../utils/queryHelper.js';

const router = express.Router();

// Submit RSVP
router.post('/', async (req, res) => {
  try {
    console.log('RSVP submission received:', req.body);
    const { event_id, name, email, phone, attendees } = req.body;
    
    if (!event_id || !name || !email || !phone || !attendees) {
      console.log('Missing required fields:', { event_id, name, email, phone, attendees });
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Verify the event exists
    const event = await QueryHelper.get('SELECT id, title FROM events WHERE id = ?', [event_id]);
    if (!event) {
      console.log('Event not found:', event_id);
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    console.log('Creating RSVP for event:', event.title);
    const result = await QueryHelper.run(
      `INSERT INTO event_rsvps (event_id, name, email, phone, attendees) 
       VALUES (?, ?, ?, ?, ?)`,
      [event_id, name, email, phone, String(attendees)]
    );

    console.log('RSVP created successfully:', result);
    res.json({ success: true, message: 'RSVP submitted successfully', id: result.lastID });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP: ' + error.message });
  }
});

export default router;
