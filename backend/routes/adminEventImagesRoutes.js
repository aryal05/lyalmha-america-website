import express from 'express';
import { QueryHelper } from '../utils/queryHelper.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../utils/uploadHelper.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Get Cloudinary signature for direct browser uploads (protected)
router.get('/cloudinary-signature', authenticateToken, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'lyalmha/event_images';
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );
    res.json({
      success: true,
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all images for an event
router.get('/:event_id', async (req, res) => {
  try {
    const images = await QueryHelper.all(
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

// Upload multiple images for an event (max 50 images, 15MB each)
router.post('/:event_id', (req, res, next) => {
  const uploadMiddleware = upload.array('images', 50);
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message, err.code);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: 'File too large. Maximum size is 15MB per image.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ success: false, error: 'Too many files or unexpected field name. Maximum 50 images allowed.' });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { thumbnailIndex } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No images uploaded' });
    }

    console.log(`Uploading ${req.files.length} images for event ${req.params.event_id}`);

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
      QueryHelper.run(
        `INSERT INTO event_images (event_id, image_url, is_thumbnail) VALUES (?, ?, ?)`,
        [req.params.event_id, imageUrl, isThumbnail]
      )
    );
    
    await Promise.all(insertPromises);
    
    console.log(`Successfully uploaded ${uploadedImages.length} images`);
    res.status(201).json({ success: true, data: uploadedImages });
  } catch (error) {
    console.error('Error uploading event images:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save image URLs uploaded directly from browser to Cloudinary
router.post('/:event_id/save-urls', async (req, res) => {
  try {
    const { urls, thumbnailIndex } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ success: false, error: 'No image URLs provided' });
    }

    console.log(`Saving ${urls.length} image URLs for event ${req.params.event_id}`);

    const insertPromises = urls.map((url, i) =>
      QueryHelper.run(
        'INSERT INTO event_images (event_id, image_url, is_thumbnail) VALUES (?, ?, ?)',
        [req.params.event_id, url, i === (parseInt(thumbnailIndex) || 0) ? 1 : 0]
      )
    );

    await Promise.all(insertPromises);
    console.log(`Successfully saved ${urls.length} image URLs`);
    res.status(201).json({ success: true, data: urls });
  } catch (error) {
    console.error('Error saving image URLs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update thumbnail for an event
router.put('/thumbnail/:image_id', async (req, res) => {
  try {
    const image = await QueryHelper.get('SELECT * FROM event_images WHERE id = ?', [req.params.image_id]);
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    await QueryHelper.run('UPDATE event_images SET is_thumbnail = 0 WHERE event_id = ?', [image.event_id]);
    await QueryHelper.run('UPDATE event_images SET is_thumbnail = 1 WHERE id = ?', [req.params.image_id]);
    res.json({ success: true, message: 'Thumbnail updated' });
  } catch (error) {
    console.error('Error updating thumbnail:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an image
router.delete('/:image_id', async (req, res) => {
  try {
    await QueryHelper.run('DELETE FROM event_images WHERE id = ?', [req.params.image_id]);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
