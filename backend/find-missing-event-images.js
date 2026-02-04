// Script to find events with missing or broken images
import dotenv from 'dotenv';
dotenv.config();
import { initializeDatabase } from './database.js';
import fetch from 'node-fetch';

async function checkImage(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  await initializeDatabase();
  const { QueryHelper } = await import('./utils/queryHelper.js');
  const events = await QueryHelper.all('SELECT id, title, image FROM events');
  let missing = [];
  for (const event of events) {
    if (!event.image) {
      missing.push({ ...event, reason: 'No image URL' });
      continue;
    }
    const ok = await checkImage(event.image);
    if (!ok) missing.push({ ...event, reason: 'Broken or inaccessible URL' });
  }
  if (missing.length === 0) {
    console.log('All events have valid images!');
  } else {
    console.log('Events with missing or broken images:');
    for (const ev of missing) {
      console.log(`ID: ${ev.id}, Title: ${ev.title}, Reason: ${ev.reason}, URL: ${ev.image}`);
    }
  }
}

main();
