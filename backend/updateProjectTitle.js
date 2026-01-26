import { getDatabase, initializeDatabase } from './database.js';

async function updateProjectTitle() {
  await initializeDatabase();
  const db = getDatabase();

  try {
    // Update the project title
    await db.run(
      `UPDATE projects SET title = ? WHERE title LIKE ?`,
      ['Biskaa Dyau-Kha (Khat) Project', '%Biska Jatra%']
    );

    console.log('✅ Successfully updated project title to "Biskaa Dyau-Kha (Khat) Project"');
    
    // Verify the update
    const project = await db.get('SELECT title FROM projects WHERE title = ?', ['Biskaa Dyau-Kha (Khat) Project']);
    if (project) {
      console.log('✅ Verified: Project title is now:', project.title);
    }
  } catch (error) {
    console.error('❌ Error updating project title:', error);
  }
}

updateProjectTitle();
