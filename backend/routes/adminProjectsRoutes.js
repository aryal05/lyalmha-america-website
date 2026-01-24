import express from 'express';
import multer from 'multer';
import { getDatabase } from '../database.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'lyalmha-america/projects' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// Get active projects (public) - MUST be before /:id route
router.get('/active', async (req, res) => {
  try {
    const db = getDatabase();
    const projects = await db.all('SELECT * FROM projects WHERE active = 1 ORDER BY order_index ASC, created_at DESC');
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching active projects:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Get all projects (admin)
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const projects = await db.all('SELECT * FROM projects ORDER BY order_index ASC, created_at DESC');
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// Create project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, full_description, status, start_date, end_date, location, featured, order_index, active } = req.body;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const db = getDatabase();
    const result = await db.run(
      `INSERT INTO projects (title, description, full_description, image, status, start_date, end_date, location, featured, order_index, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, full_description, imageUrl, status || 'active', start_date, end_date, location, featured || 0, order_index || 0, active !== undefined ? active : 1]
    );

    res.json({ success: true, message: 'Project created successfully', id: result.lastID });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, full_description, status, start_date, end_date, location, featured, order_index, active } = req.body;
    
    const db = getDatabase();
    const existingProject = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    
    if (!existingProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let imageUrl = existingProject.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    await db.run(
      `UPDATE projects SET title = ?, description = ?, full_description = ?, image = ?, status = ?, start_date = ?, end_date = ?, location = ?, featured = ?, order_index = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, description, full_description, imageUrl, status, start_date, end_date, location, featured, order_index, active, req.params.id]
    );

    res.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.run('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

export default router;
