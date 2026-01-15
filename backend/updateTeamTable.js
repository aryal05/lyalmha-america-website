import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function updateTeamTable() {
  const db = await open({
    filename: './lyaymha.db',
    driver: sqlite3.Database
  });

  try {
    console.log('Starting team_members table update...');

    // Check if table exists
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='team_members'"
    );

    if (!tableExists) {
      console.log('Creating team_members table...');
      await db.exec(`
        CREATE TABLE team_members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT,
          category TEXT NOT NULL DEFAULT 'Advisor',
          bio TEXT,
          image TEXT,
          order_index INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ team_members table created successfully');
    } else {
      console.log('Table exists. Checking for image column...');
      
      // Check if image column exists
      const columns = await db.all('PRAGMA table_info(team_members)');
      const hasImageColumn = columns.some(col => col.name === 'image');

      if (!hasImageColumn) {
        console.log('Adding image column...');
        await db.exec('ALTER TABLE team_members ADD COLUMN image TEXT');
        console.log('✅ image column added successfully');
      } else {
        console.log('✅ image column already exists');
      }

      // Update existing records to use new category values if needed
      console.log('Updating category values...');
      await db.exec(`
        UPDATE team_members 
        SET category = CASE 
          WHEN category = 'leadership' THEN 'Executive'
          WHEN category = 'staff' THEN 'Advisor'
          WHEN category = 'volunteers' THEN 'Life Member'
          ELSE category
        END
        WHERE category IN ('leadership', 'staff', 'volunteers')
      `);
      console.log('✅ Category values updated');
    }

    // Display current table structure
    const structure = await db.all('PRAGMA table_info(team_members)');
    console.log('\nCurrent table structure:');
    console.table(structure);

    // Display sample data
    const sampleData = await db.all('SELECT * FROM team_members LIMIT 5');
    console.log('\nSample data:');
    console.table(sampleData);

    console.log('\n✅ All updates completed successfully!');
  } catch (error) {
    console.error('❌ Error updating table:', error);
  } finally {
    await db.close();
  }
}

updateTeamTable();
