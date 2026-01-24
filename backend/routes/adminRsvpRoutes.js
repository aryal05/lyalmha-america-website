import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// Get all RSVPs
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const rsvps = await db.all(`
      SELECT r.*, e.title as event_title, e.event_date, e.location
      FROM event_rsvps r
      LEFT JOIN events e ON r.event_id = e.id
      ORDER BY r.created_at DESC
    `);
    res.json({ success: true, data: rsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch RSVPs' });
  }
});

// Delete RSVP
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.run('DELETE FROM event_rsvps WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'RSVP deleted successfully' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ success: false, message: 'Failed to delete RSVP' });
  }
});

export default router;
