import { getDatabase, initializeDatabase } from './database.js';

async function migrateProjects() {
  await initializeDatabase();
  const db = getDatabase();

  try {
    // Add missing columns if they don't exist
    await db.exec(`
      ALTER TABLE projects ADD COLUMN location TEXT;
    `).catch(() => console.log('location column already exists'));

    await db.exec(`
      ALTER TABLE projects ADD COLUMN featured INTEGER DEFAULT 0;
    `).catch(() => console.log('featured column already exists'));

    await db.exec(`
      ALTER TABLE projects ADD COLUMN order_index INTEGER DEFAULT 0;
    `).catch(() => console.log('order_index column already exists'));

    await db.exec(`
      ALTER TABLE projects ADD COLUMN active INTEGER DEFAULT 1;
    `).catch(() => console.log('active column already exists'));

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

migrateProjects();
