import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database.sqlite');

console.log('\n=== FIXING BANNER ORDER ===\n');

// Get all positions
db.all('SELECT DISTINCT position FROM banners ORDER BY position', [], (err, positions) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }

  let processedPositions = 0;
  
  positions.forEach(pos => {
    // Get all banners for this position ordered by ID
    db.all(
      'SELECT id, title, position, order_index FROM banners WHERE position = ? ORDER BY id',
      [pos.position],
      (err, banners) => {
        if (err) {
          console.error(`Error for ${pos.position}:`, err);
          return;
        }

        console.log(`\n📍 ${pos.position.toUpperCase()}:`);
        
        // Update order_index for each banner
        banners.forEach((banner, index) => {
          const newOrder = index + 1;
          db.run(
            'UPDATE banners SET order_index = ? WHERE id = ?',
            [newOrder, banner.id],
            function(err) {
              if (err) {
                console.error(`Error updating banner ${banner.id}:`, err);
              } else {
                console.log(`  ${newOrder}. ${banner.title} (was: ${banner.order_index}, now: ${newOrder})`);
              }
            }
          );
        });

        processedPositions++;
        
        // Close DB after processing all positions
        if (processedPositions === positions.length) {
          setTimeout(() => {
            console.log('\n✅ All banner orders fixed!\n');
            db.close();
          }, 500);
        }
      }
    );
  });
});
