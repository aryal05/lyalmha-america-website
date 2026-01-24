import { getDatabase, initializeDatabase } from '../database.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Vercel serverless function for adding banners
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await initializeDatabase();
    const db = await getDatabase();

    // Example: banner data from request body
    const { title, description, imageBase64, link, position, order_index, active } = req.body;
    if (!title || !description || !imageBase64) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload image to Cloudinary
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const tempFilePath = `/tmp/banner_${Date.now()}.jpg`;
    require('fs').writeFileSync(tempFilePath, imageBuffer);
    const imageUrl = await uploadToCloudinary(tempFilePath, 'banners');

    // Insert banner into DB
    const insertStmt = await db.prepare(`
      INSERT INTO banners (title, description, image, link, position, order_index, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    await insertStmt.run(title, description, imageUrl, link, position, order_index, active);
    await insertStmt.finalize();

    return res.status(201).json({ message: 'Banner added successfully', imageUrl });
  } catch (error) {
    console.error('Error in addBanners API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
