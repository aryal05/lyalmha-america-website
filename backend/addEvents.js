import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addEvents() {
  // Open database
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  console.log('✅ Database connected\n');

  try {
    // Clear existing events
    await db.run('DELETE FROM events');
    console.log('🗑️  Cleared existing events\n');

    // Upcoming Events
    console.log('📅 Adding Upcoming Events...');
    const upcomingEvents = [
      {
        title: 'Annual Cultural Festival 2026',
        description: 'Join us for our annual celebration of newari culture featuring traditional music, dance, and cuisine.',
        event_date: '2026-03-15',
        location: 'Community Center',
        event_type: 'Festival'
      },
      {
        title: "Children's Language Workshop",
        description: 'Interactive online workshop teaching newari language basics to children and beginners.',
        event_date: '2026-02-20',
        location: 'Online',
        event_type: 'Workshop'
      },
      {
        title: 'Traditional Music Concert',
        description: 'Experience the melodious sounds of traditional newari instruments and vocals.',
        event_date: '2026-04-10',
        location: 'Main Hall',
        event_type: 'Concert'
      }
    ];

    for (const event of upcomingEvents) {
      await db.run(
        'INSERT INTO events (title, description, event_date, location, event_type) VALUES (?, ?, ?, ?, ?)',
        [event.title, event.description, event.event_date, event.location, event.event_type]
      );
      console.log(`  ✓ Added: ${event.title}`);
    }

    // Past Events
    console.log('\n🕐 Adding Past Events...');
    const pastEvents = [
      {
        title: 'Biska Jatra Celebration 2024',
        description: 'Celebrated the auspicious Biska Jatra with traditional chariot procession and cultural programs.',
        event_date: '2024-04-13',
        location: 'DMV Region',
        event_type: 'event'
      },
      {
        title: 'Cultural Dance Workshop',
        description: 'Workshop on traditional newari dance forms and their cultural significance.',
        event_date: '2024-11-15',
        location: 'Community Center',
        event_type: 'Workshop'
      },
      {
        title: 'Community Gathering',
        description: 'Monthly community gathering for cultural exchange and networking.',
        event_date: '2024-09-20',
        location: 'Community Hall',
        event_type: 'event'
      }
    ];

    for (const event of pastEvents) {
      await db.run(
        'INSERT INTO events (title, description, event_date, location, event_type) VALUES (?, ?, ?, ?, ?)',
        [event.title, event.description, event.event_date, event.location, event.event_type]
      );
      console.log(`  ✓ Added: ${event.title}`);
    }

    // Verify the count
    const result = await db.get('SELECT COUNT(*) as total FROM events');
    console.log(`\n✅ Successfully added ${result.total} events!`);
    
    // Show breakdown
    const upcoming = await db.get('SELECT COUNT(*) as count FROM events WHERE event_date >= date("now")');
    const past = await db.get('SELECT COUNT(*) as count FROM events WHERE event_date < date("now")');
    
    console.log(`   📅 Upcoming Events: ${upcoming.count}`);
    console.log(`   🕐 Past Events: ${past.count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
    console.log('\n📁 Database closed');
  }
}

addEvents();
