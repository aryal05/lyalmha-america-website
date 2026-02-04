import { QueryHelper } from './utils/queryHelper.js'
import { initializeDatabase } from './database.js'

async function updateEventTypes() {
  await initializeDatabase();
  // Get all events
  const events = await QueryHelper.all('SELECT id, event_date FROM events');

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  for (const event of events) {
    const eventDate = event.event_date.slice(0, 10);
    let newType = eventDate >= today ? 'event' : 'past';
    await QueryHelper.run(
      'UPDATE events SET event_type = ? WHERE id = ?',
      [newType, event.id]
    );
    console.log(`Event ${event.id} updated to type: ${newType}`);
  }
  console.log('Event types updated!');
}

updateEventTypes().catch(console.error);
