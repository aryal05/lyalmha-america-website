import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database.sqlite');

console.log('\n=== CHECKING BANNERS IN DATABASE ===\n');

db.all('SELECT id, title, position, image, order_index, active FROM banners ORDER BY position, order_index', [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`Found ${rows.length} banners:\n`);
    rows.forEach(banner => {
      console.log(`ID: ${banner.id}`);
      console.log(`Title: ${banner.title}`);
      console.log(`Position: ${banner.position}`);
      console.log(`Order: ${banner.order_index}`);
      console.log(`Active: ${banner.active}`);
      console.log(`Image: ${banner.image}`);
      console.log('---');
    });
  }
  db.close();
});
