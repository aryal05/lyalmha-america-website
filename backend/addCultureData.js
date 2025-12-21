import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addCultureData() {
  // Open database
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  console.log('✅ Database connected\n');

  try {
    // Clear existing culture data
    await db.run('DELETE FROM culture_festivals');
    await db.run('DELETE FROM culture_traditions');
    console.log('🗑️  Cleared existing culture data\n');

    // Add Festivals
    console.log('🎉 Adding Festivals...');
    const festivals = [
      {
        title: 'Biskaa Jatra',
        description: 'A weeklong Spring celebration during Khai-Salhu (Spring Equinox) welcoming Spring Bloom, Good Health, Peace, and Prosperity.',
        highlights: JSON.stringify(['Dyou-Kha Procession', 'Dhime & Khin Music', 'Community Gathering']),
        order_index: 1
      },
      {
        title: 'Indra Jatra',
        description: 'One of the most significant festivals honoring Indra, the king of heaven, celebrated with masked dances and chariot processions.',
        highlights: JSON.stringify(['Kumari Procession', 'Traditional Dances', 'Eight-day Festival']),
        order_index: 2
      },
      {
        title: 'Yomari Punhi',
        description: 'Celebration of the winter solstice with the preparation of Yomari, a sweet delicacy made of rice flour.',
        highlights: JSON.stringify(['Yomari Making', 'Family Gatherings', 'Cultural Stories']),
        order_index: 3
      }
    ];

    for (const festival of festivals) {
      await db.run(
        'INSERT INTO culture_festivals (title, description, highlights, order_index) VALUES (?, ?, ?, ?)',
        [festival.title, festival.description, festival.highlights, festival.order_index]
      );
      console.log(`  ✓ Added: ${festival.title}`);
    }

    // Add Traditions
    console.log('\n🏛️ Adding Traditions...');
    const traditions = [
      {
        icon: '🎭',
        title: 'Traditional Arts',
        description: 'Wood carving, metal work, and thangka painting representing centuries of artistic excellence',
        order_index: 1
      },
      {
        icon: '🎵',
        title: 'Music & Dance',
        description: 'Dhime, Khin, and Bhusyaa create the rhythmic heartbeat of Newari celebrations',
        order_index: 2
      },
      {
        icon: '🏛️',
        title: 'Architecture',
        description: 'Pagoda-style temples and intricate wooden structures defining Newari craftsmanship',
        order_index: 3
      },
      {
        icon: '📖',
        title: 'Nepal Bhasa',
        description: 'Our mother tongue, a vital part of our identity and cultural heritage',
        order_index: 4
      },
      {
        icon: '🍲',
        title: 'Cuisine',
        description: 'Rich culinary traditions from Yomari and Bara to Chatamari and traditional feasts',
        order_index: 5
      },
      {
        icon: '👥',
        title: 'Community',
        description: 'Guthi system bringing people together for cultural and social activities',
        order_index: 6
      }
    ];

    for (const tradition of traditions) {
      await db.run(
        'INSERT INTO culture_traditions (icon, title, description, order_index) VALUES (?, ?, ?, ?)',
        [tradition.icon, tradition.title, tradition.description, tradition.order_index]
      );
      console.log(`  ✓ Added: ${tradition.title}`);
    }

    // Verify the counts
    const festivals_count = await db.get('SELECT COUNT(*) as total FROM culture_festivals');
    const traditions_count = await db.get('SELECT COUNT(*) as total FROM culture_traditions');
    
    console.log(`\n✅ Successfully added culture data!`);
    console.log(`   🎉 Festivals: ${festivals_count.total}`);
    console.log(`   🏛️ Traditions: ${traditions_count.total}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
    console.log('\n📁 Database closed');
  }
}

addCultureData();
