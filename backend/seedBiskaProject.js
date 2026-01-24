import { getDatabase, initializeDatabase } from './database.js';

async function seedBiskaJatraProject() {
  await initializeDatabase();
  const db = getDatabase();

  const fullDescription = `
    <div class="space-y-6">
      <p>The auspicious Biskaa Jatra is a weeklong celebration during <strong class="text-gold-accent">Khai-Salhu</strong> (the Spring Equinox of the Nepalese Luni-Solar Calendar) welcoming the Spring Bloom, Good health, Peace, and Prosperity of the World. This celebration is joined by both people and the Gods and Goddesses along with Halin-Pataa, displaying marvellous Dhime and Khin music and dances.</p>
      
      <p>Our coordinating committee members and volunteers worked tirelessly to build a Replica of a <strong class="text-gold-accent">Dyou-Kha</strong> (an auspicious chariot of the Gods and Goddesses) and a Chhatra. The Biskaa Jatra Dyou-Kha symbolizes the Newah Civilization prior to the invention of wheels in human history. This Dyou-Kha is carried on human shoulders.</p>
      
      <div class="bg-gradient-to-r from-gold-accent/10 to-newari-red/10 p-6 rounded-lg border-l-4 border-gold-accent my-6">
        <p class="text-primary-text">The Dyou-Kha is about <strong class="text-gold-accent text-xl">8 feet tall, 150 lb weight</strong>, carried by 8 to 12 Jatra participants. The Chhatra stands on the waistline and is revolved by hand continuously. This replica, crafted with authentic ornaments by artists from Nepal, was built <strong class="text-newari-red">for the first time outside Nepal-Mandala</strong> in the free land of Americas.</p>
      </div>

      <h3 class="text-2xl font-bold text-gold-accent mt-8 mb-4">Project Timeline</h3>
      <ul class="space-y-3">
        <li><strong>2022:</strong> Project Initiated - First Biskaa Jatra outside Nepal-Mandala</li>
        <li><strong>2023:</strong> Dyou-Kha Built - 8ft tall, 150lb authentic chariot crafted</li>
        <li><strong>April 13, 2024:</strong> 2nd Celebration - Expanded community participation</li>
        <li><strong>Future:</strong> Growing Legacy - Continuing tradition for generations</li>
      </ul>

      <h3 class="text-2xl font-bold text-gold-accent mt-8 mb-4">Project Team (2023)</h3>
      
      <h4 class="text-lg font-semibold text-newari-red mt-6 mb-3">Project Advisors from Nepal</h4>
      <ul class="list-disc list-inside space-y-2">
        <li>Shyam Kaji Shrestha - Nayo Pahmaa</li>
        <li>Guru Arjun Shrestha - Project Advisor</li>
      </ul>

      <h4 class="text-lg font-semibold text-newari-red mt-6 mb-3">Project Coordinator</h4>
      <p class="font-bold">Puskar Prajapti</p>

      <h4 class="text-lg font-semibold text-newari-red mt-6 mb-3">Woodwork Team</h4>
      <ul class="grid grid-cols-2 gap-2 list-disc list-inside">
        <li>Hari Hyamthaku Shrestha (Lead)</li>
        <li>Sugandha Shrestha (Chief Assist)</li>
        <li>Mani Shrestha (Chief Assist)</li>
        <li>Roshan Shrestha</li>
        <li>Bigyan Shrestha</li>
        <li>Nirajan Shrestha</li>
        <li>Vishwa Shrestha</li>
        <li>Bal Krishna Prajapati</li>
        <li>Sanam Sikhrakar</li>
        <li>Delesh Shrestha</li>
      </ul>

      <div class="bg-gradient-to-r from-gold-accent/10 to-newari-red/10 p-6 rounded-lg mt-8">
        <h4 class="text-xl font-bold text-gold-accent mb-3">Community Support</h4>
        <p>This project was made possible through the generous support of <strong class="text-gold-accent">over 30 individual supporters</strong> and <strong class="text-newari-red">8 corporate sponsors</strong> from our community. Their dedication and contributions helped preserve and celebrate our cultural heritage for generations to come.</p>
      </div>
    </div>
  `;

  const project = {
    title: 'Biska Jatra Celebration Project',
    description: 'Lyaymha America Guthi continues the auspicious Biska Jatra Celebration in the DMV region, started in 2022. This weeklong celebration during Khai-Salhu welcomes Spring Bloom, Good Health, Peace, and Prosperity.',
    full_description: fullDescription,
    image: 'banners/4th Biskaa Jatraa Celebrations flyer (2).jpg',
    status: 'active',
    start_date: '2022',
    end_date: null,
    location: 'DMV Region (DC, Maryland, Virginia)',
    featured: 1,
    order_index: 0,
    active: 1
  };

  try {
    // Check if project already exists
    const existing = await db.get('SELECT id FROM projects WHERE title = ?', [project.title]);
    
    if (existing) {
      console.log('✅ Biska Jatra project already exists in database');
      return;
    }

    // Insert project
    await db.run(
      `INSERT INTO projects (title, description, full_description, image, status, start_date, end_date, location, featured, order_index, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project.title,
        project.description,
        project.full_description,
        project.image,
        project.status,
        project.start_date,
        project.end_date,
        project.location,
        project.featured,
        project.order_index,
        project.active
      ]
    );

    console.log('✅ Successfully seeded Biska Jatra project data');
  } catch (error) {
    console.error('❌ Error seeding project:', error);
  }
}

seedBiskaJatraProject();
