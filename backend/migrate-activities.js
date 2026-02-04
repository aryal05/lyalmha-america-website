// Script to migrate activities data from SQLite to Supabase
import dotenv from 'dotenv';
dotenv.config();
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import pkg from 'pg';

const { Pool } = pkg;

async function migrateActivities() {
  // Connect to SQLite
  const sqliteDb = await open({
    filename: './backend/database.sqlite',
    driver: sqlite3.Database
  });

  // Connect to Supabase/Postgres
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  const pgClient = await pgPool.connect();

  try {
    // Fetch all activities from SQLite
    const activities = await sqliteDb.all('SELECT * FROM activities');
    console.log(`Found ${activities.length} activities in SQLite.`);

    for (const activity of activities) {
      // Insert into Supabase/Postgres
      const keys = Object.keys(activity);
      const values = Object.values(activity);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO activities (${keys.join(', ')}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`;
      await pgClient.query(query, values);
      console.log(`Migrated activity ID: ${activity.id}`);
    }
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await sqliteDb.close();
    pgClient.release();
    await pgPool.end();
  }
}

migrateActivities();
