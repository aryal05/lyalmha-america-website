import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const traditions = [
  {
    icon: '📚',
    title: 'Nepal Bhasa Class',
    description: 'Preserving our mother tongue through structured language classes for all ages, teaching reading, writing, and speaking Nepal Bhasa.',
    order_index: 1
  },
  {
    icon: '🎵',
    title: 'Music and Cultural Dance',
    description: 'Traditional newari music and dance performances celebrating our rich artistic heritage through classical and folk expressions.',
    order_index: 2
  },
  {
    icon: '👶',
    title: 'Kids Cultural Workshop',
    description: 'Engaging workshops for children to learn about newari traditions, festivals, and customs in a fun and interactive environment.',
    order_index: 3
  },
  {
    icon: '🤝',
    title: 'Community Reach',
    description: 'Building bridges within and beyond our community through cultural exchange programs and collaborative initiatives.',
    order_index: 4
  },
  {
    icon: '🥁',
    title: 'Madal and Dhimay Workshop',
    description: 'Hands-on training in traditional newari percussion instruments, keeping alive the rhythmic heartbeat of our culture.',
    order_index: 5
  }
];

async function updateTraditions() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  try {
    // Delete all existing traditions
    await db.run('DELETE FROM culture_traditions');
    console.log('✅ Cleared existing traditions');

    // Insert new traditions
    for (const tradition of traditions) {
      await db.run(
        `INSERT INTO culture_traditions (icon, title, description, order_index, active) 
         VALUES (?, ?, ?, ?, 1)`,
        [tradition.icon, tradition.title, tradition.description, tradition.order_index]
      );
      console.log(`✅ Added: ${tradition.title}`);
    }

    console.log('\n✅ Successfully updated all traditions!');
  } catch (error) {
    console.error('❌ Error updating traditions:', error);
  } finally {
    await db.close();
  }
}

updateTraditions();
