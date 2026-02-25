import { initializeDatabase } from './database.js';
import dotenv from 'dotenv';
dotenv.config();

async function addLinkColumns() {
  const db = await initializeDatabase();

  try {
    console.log('Adding link columns to tables...');

    // Add link column to blogs table
    try {
      await db.query('ALTER TABLE blogs ADD COLUMN link TEXT');
      console.log('✅ Added link column to blogs table');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('ℹ️  link column already exists in blogs table');
      } else {
        console.error('Error adding link to blogs:', err.message);
      }
    }

    // Add link column to news table
    try {
      await db.query('ALTER TABLE news ADD COLUMN link TEXT');
      console.log('✅ Added link column to news table');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('ℹ️  link column already exists in news table');
      } else {
        console.error('Error adding link to news:', err.message);
      }
    }

    // Add more_images_link column to events table
    try {
      await db.query('ALTER TABLE events ADD COLUMN more_images_link TEXT');
      console.log('✅ Added more_images_link column to events table');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('ℹ️  more_images_link column already exists in events table');
      } else {
        console.error('Error adding more_images_link to events:', err.message);
      }
    }

    // Add event_link column to events table
    try {
      await db.query('ALTER TABLE events ADD COLUMN event_link TEXT');
      console.log('✅ Added event_link column to events table');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('ℹ️  event_link column already exists in events table');
      } else {
        console.error('Error adding event_link to events:', err.message);
      }
    }

    console.log('\n✅ All link columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

addLinkColumns();
