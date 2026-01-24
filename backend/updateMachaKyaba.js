import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateMachaKyaba() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  const description = `Macha Kyaba is Lyaymha America Guthi's School of Art, Culture, and Language, dedicated to nurturing our community's children. It is a safe and inspiring space where kids can learn and experience our rich culture, traditions, language, music, and arts.

Through structured classes, workshops, and cultural activities, we provide a platform for children to connect with their cultural values, strengthen their identity, and proudly embrace their heritage. Macha Kyaba also encourages creativity, confidence, teamwork, and skill development, helping children explore their talents while growing into well-rounded individuals.

Our mission is to preserve and pass on our traditions to the next generation—especially U.S.-born children—while empowering them to learn, express themselves, and lead beyond cultural boundaries.`;

  try {
    await db.run(
      `UPDATE activities SET description = ? WHERE title = 'Macha Kyaba' AND category = 'kids'`,
      [description]
    );
    console.log('✅ Updated Macha Kyaba description');
    await db.close();
  } catch (error) {
    console.error('❌ Error:', error);
    await db.close();
  }
}

updateMachaKyaba();
