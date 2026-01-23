import express from 'express';
import { getDatabase } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../utils/uploadHelper.js';

const router = express.Router();

// Get all images for an event
router.get('/:event_id', async (req, res) => {
  try {
    const db = getDatabase();
    const images = await db.all(
      'SELECT * FROM event_images WHERE event_id = ? ORDER BY is_thumbnail DESC, created_at ASC',
      [req.params.event_id]
    );
    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching event images:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Protected routes - require authentication
router.use(authenticateToken);

// Upload multiple images for an event
router.post('/:event_id', upload.array('images', 10), async (req, res) => {
  try {
    const { thumbnailIndex } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No images uploaded' });
    }
    const db = getDatabase();
    
    // Upload all images to Cloudinary in parallel (faster)
    const uploadPromises = req.files.map((file, i) => 
      uploadToCloudinary(file.buffer, 'event_images')
        .then(imageUrl => ({
          imageUrl,
          isThumbnail: parseInt(thumbnailIndex) === i ? 1 : 0
        }))
    );
    
    const uploadedImages = await Promise.all(uploadPromises);
    
    // Insert all images into database
    const insertPromises = uploadedImages.map(({ imageUrl, isThumbnail }) =>
      db.run(
        `INSERT INTO event_images (event_id, image_url, is_thumbnail) VALUES (?, ?, ?)`,
        [req.params.event_id, imageUrl, isThumbnail]
      )
    );
    
    await Promise.all(insertPromises);
    
    res.status(201).json({ success: true, data: uploadedImages });
  } catch (error) {
    console.error('Error uploading event images:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update thumbnail for an event
router.put('/thumbnail/:image_id', async (req, res) => {
  try {
    const db = getDatabase();
    const image = await db.get('SELECT * FROM event_images WHERE id = ?', [req.params.image_id]);
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    await db.run('UPDATE event_images SET is_thumbnail = 0 WHERE event_id = ?', [image.event_id]);
    await db.run('UPDATE event_images SET is_thumbnail = 1 WHERE id = ?', [req.params.image_id]);
    res.json({ success: true, message: 'Thumbnail updated' });
  } catch (error) {
    console.error('Error updating thumbnail:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an image
router.delete('/:image_id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.run('DELETE FROM event_images WHERE id = ?', [req.params.image_id]);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
