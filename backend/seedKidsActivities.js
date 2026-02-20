import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const activities = [
  {
    title: 'Macha Kyaba',
    description: 'Traditional newari cultural activity where children learn about our heritage through interactive storytelling and hands-on experiences.',
    icon: '🎭',
    order_index: 1
  },
  {
    title: 'Kids Culture Workshop',
    description: 'Engaging workshops designed for children to explore newari traditions, festivals, and customs in a fun and interactive environment.',
    icon: '👶',
    order_index: 2
  },
  {
    title: 'Nepal Bhasa Class',
    description: 'Language classes teaching children to read, write, and speak Nepal Bhasa, preserving our mother tongue for future generations.',
    icon: '📚',
    order_index: 3
  },
  {
    title: 'Madal and Dhimay Workshop',
    description: 'Hands-on training in traditional newari percussion instruments, teaching children the rhythmic heartbeat of our culture.',
    icon: '🥁',
    order_index: 4
  },
  {
    title: 'Cultural Dhimay Dances',
    description: 'Traditional newari dance classes where children learn authentic cultural dances including Wapiza (Rice Planting Dance) and other ceremonial performances.',
    icon: '💃',
    order_index: 5
  }
];

async function seedKidsActivities() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  try {
    // Clear existing activities
    await db.run('DELETE FROM activities WHERE category = "kids"');
    console.log('✅ Cleared existing kids activities');

    // Insert new activities
    for (const activity of activities) {
      await db.run(
        `INSERT INTO activities (title, description, category, icon, order_index, active) 
         VALUES (?, ?, 'kids', ?, ?, 1)`,
        [activity.title, activity.description, activity.icon, activity.order_index]
      );
      console.log(`✅ Added: ${activity.title}`);
    }

    console.log('\n✅ Successfully seeded all kids activities!');
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
  } finally {
    await db.close();
  }
}

seedKidsActivities();
