import { initializeDatabase } from './database.js';
import dotenv from 'dotenv';
dotenv.config();

async function addLinkTitleColumns() {
  const db = await initializeDatabase();

  try {
    console.log('Adding link title columns to tables...');

    // Add event_link_title column to events table
    try {
      await db.query('ALTER TABLE events ADD COLUMN event_link_title TEXT');
      console.log('✅ Added event_link_title column to events table');
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate column')) {
        console.log('ℹ️  event_link_title column already exists in events table');
      } else {
        console.error('Error adding event_link_title to events:', err.message);
      }
    }

    // Add link_title column to news table
    try {
      await db.query('ALTER TABLE news ADD COLUMN link_title TEXT');
      console.log('✅ Added link_title column to news table');
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('duplicate column')) {
        console.log('ℹ️  link_title column already exists in news table');
      } else {
        console.error('Error adding link_title to news:', err.message);
      }
    }

    console.log('\n✅ All link title columns added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addLinkTitleColumns();
