import { getDatabase, initializeDatabase } from './database.js';

console.log('\n=== CHECKING PROBLEM BANNERS (news, contact, culture) ===\n');

await initializeDatabase();
const db = await getDatabase();

const rows = await db.all(
  `SELECT id, title, description, position, active FROM banners 
   WHERE position IN ('news', 'contact', 'culture')
   ORDER BY position, order_index`
);

rows.forEach((row) => {
  console.log(`ID: ${row.id}`);
  console.log(`Title: ${row.title}`);
  console.log(`Description: "${row.description}" (type: ${typeof row.description}, null: ${row.description === null})`);
  console.log(`Position: ${row.position}`);
  console.log(`Active: ${row.active}`);
  console.log('---');
});
