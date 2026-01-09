import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database.sqlite');

console.log('\n=== FIXING BANNERS ===\n');

// Step 1: Activate all banners
db.run('UPDATE banners SET active = 1', function(err) {
  if (err) {
    console.error('Error activating banners:', err);
  } else {
    console.log(`✅ Activated ${this.changes} banners`);
  }
  
  // Step 2: Update position from 'hero' to 'home'
  db.run("UPDATE banners SET position = 'home' WHERE position = 'hero'", function(err) {
    if (err) {
      console.error('Error updating positions:', err);
    } else {
      console.log(`✅ Updated ${this.changes} banners from 'hero' to 'home'`);
    }
    
    // Step 3: Show updated banners
    db.all('SELECT id, title, position, order_index, active FROM banners ORDER BY position, order_index', [], (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`\n=== UPDATED BANNERS (${rows.length} total) ===\n`);
        rows.forEach(banner => {
          console.log(`✓ ${banner.title} | ${banner.position} | Order: ${banner.order_index} | Active: ${banner.active ? 'YES' : 'NO'}`);
        });
      }
      db.close();
      console.log('\n✅ Database updated successfully!\n');
    });
  });
});
