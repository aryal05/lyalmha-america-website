import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const events = [
  {
    title: 'Pre-Event Planning Meeting',
    description: `Jwajalapa! Namaste to all community members,

Lyaymha America Guthi (LAG) warmly invites you and your family to a Pre-Event Planning Meeting for "बिस्का: जात्रा अमेरिका – 5th Biskaa Jatraa Celebrations 2026."

This year, we are excited to celebrate Biskaa Jatraa at a beautiful park and are planning several new activities and programs. To ensure a well-organized and successful celebration, we truly value your ideas, input, and support.

During the meeting, we will discuss kids' involvement in activities such as the Traditional Dress Show 2026, cultural dance, drama/play, music, and other performances—helping them stay connected to our culture, traditions, and heritage. Light refreshments will be provided.

Please join us to plan together, share your ideas, and celebrate our cultural heritage as a community. There will be a kids' Dhimay dance performance. We look forward to seeing you there.

👉This event is free and open to all community members; however, we kindly ask everyone to fill out the form to help us with the headcount. Please sign up by January 22, 2026.

Subhaye and Thank You,
Lyaymha America Guthi (LAG)`,
    event_date: '2026-01-24T10:00:00',
    location: 'Chantilly Regional Library, 4000 Stringfellow Rd, Chantilly, VA 20151',
    event_type: 'meeting'
  },
  {
    title: 'International Festivals - Biskaa Jatraa America',
    description: `Lyaymha America Guthi is proud to represent Nepal at the International Festival.

Our children will perform a very unique live traditional Dhimay dance (Wapiza / Rice Planting Dance), showcasing the beauty of our ancestral traditions.

We believe this performance is a meaningful way to preserve, promote, and pass on our rich cultural heritage to the next generation, while sharing and celebrating our culture within the internationally diverse community.

Join us for the 5th Biskaa Jatraa Celebrations 2026!`,
    event_date: '2026-04-11T10:00:00',
    location: 'To be announced',
    event_type: 'festival'
  }
];

async function addUpcomingEvents() {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  try {
    for (const event of events) {
      const result = await db.run(
        `INSERT INTO events (title, description, event_date, location, event_type) 
         VALUES (?, ?, ?, ?, ?)`,
        [event.title, event.description, event.event_date, event.location, event.event_type]
      );
      console.log(`✅ Added event: ${event.title} (ID: ${result.lastID})`);
    }

    console.log('\n✅ Successfully added all upcoming events!');
    
    // Display all upcoming events
    const upcomingEvents = await db.all(
      `SELECT * FROM events WHERE event_date >= date('now') ORDER BY event_date`
    );
    console.log('\n📅 All Upcoming Events:');
    upcomingEvents.forEach(event => {
      console.log(`- ${event.title} on ${event.event_date}`);
    });
  } catch (error) {
    console.error('❌ Error adding events:', error);
  } finally {
    await db.close();
  }
}

addUpcomingEvents();
