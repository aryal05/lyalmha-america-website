import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateFestival() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  try {
    // Update Indra Jatra to Mha Puja
    const result = await db.run(
      `UPDATE culture_festivals 
       SET title = ?, 
           description = ?, 
           highlights = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE title LIKE '%Indra%'`,
      [
        'Mha Puja',
        'Mha Puja (Nepal Sambat New Year) is one of the most sacred festivals in newari culture, celebrated on the fourth day of Tihar. It is a unique self-worship ritual where individuals honor their own body and soul, symbolizing self-respect, self-care, and the importance of one\'s life force. The ceremony involves creating a sacred mandala with oil lamps, flowers, and offerings, representing purification and blessing of one\'s existence. This festival marks the beginning of Nepal Sambat, the newari New Year.',
        JSON.stringify([
          'Self-worship ritual celebrating body and soul',
          'Marks Nepal Sambat (newari New Year)',
          'Sacred mandala creation with oil lamps',
          'Family gatherings and traditional feasts',
          'Symbolic purification ceremonies'
        ])
      ]
    );

    console.log('✅ Successfully updated to Mha Puja!');
    console.log(`Rows affected: ${result.changes}`);

    // Display all festivals
    const festivals = await db.all('SELECT id, title, active FROM culture_festivals ORDER BY order_index');
    console.log('\nCurrent festivals:');
    festivals.forEach(f => {
      console.log(`- ${f.title} (ID: ${f.id}, Active: ${f.active})`);
    });

  } catch (error) {
    console.error('Error updating festival:', error);
  } finally {
    await db.close();
  }
}

updateFestival();
