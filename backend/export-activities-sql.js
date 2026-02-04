import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function exportActivitiesAsInsert() {
  const db = await open({
    filename: './backend/database.sqlite',
    driver: sqlite3.Database
  });
  const activities = await db.all('SELECT * FROM activities');
  if (!activities.length) {
    console.log('-- No activities found.');
    return;
  }
  const columns = Object.keys(activities[0]);
  for (const activity of activities) {
    const values = columns.map(col => {
      const val = activity[col];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return val;
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    const sql = `INSERT INTO activities (${columns.join(', ')}) VALUES (${values.join(', ')});`;
    console.log(sql);
  }
  await db.close();
}

exportActivitiesAsInsert();
