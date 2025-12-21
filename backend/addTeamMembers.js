import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addTeamMembers() {
  // Open database
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  console.log('✅ Database connected\n');

  try {
    // Clear existing team members
    await db.run('DELETE FROM team_members');
    console.log('🗑️  Cleared existing team members\n');

    // Executive Team - Project Coordinator
    console.log('👔 Adding Executive Team...');
    const executives = [
      {
        name: 'Puskar Prajapati',
        role: 'Project Coordinator',
        category: 'Executive',
        bio: 'Leading the Biskaa Jatra project coordination and ensuring successful celebration of our cultural heritage in the DMV region.',
        order_index: 1
      }
    ];

    for (const exec of executives) {
      await db.run(
        'INSERT INTO team_members (name, role, category, bio, order_index) VALUES (?, ?, ?, ?, ?)',
        [exec.name, exec.role, exec.category, exec.bio, exec.order_index]
      );
      console.log(`  ✓ Added: ${exec.name} - ${exec.role}`);
    }

    // Advisors - Project Advisors from Nepal
    console.log('\n💡 Adding Advisors...');
    const advisors = [
      {
        name: 'ShyamKaji Shrestha',
        role: 'NayoPahmaa',
        category: 'Advisors',
        bio: 'Project advisor from Nepal providing guidance and cultural expertise for authentic Biskaa Jatra celebration.',
        order_index: 1
      },
      {
        name: 'Guru Arjun Shrestha',
        role: 'Cultural Advisor',
        category: 'Advisors',
        bio: 'Project advisor from Nepal ensuring traditional practices and authenticity in the celebration.',
        order_index: 2
      }
    ];

    for (const advisor of advisors) {
      await db.run(
        'INSERT INTO team_members (name, role, category, bio, order_index) VALUES (?, ?, ?, ?, ?)',
        [advisor.name, advisor.role, advisor.category, advisor.bio, advisor.order_index]
      );
      console.log(`  ✓ Added: ${advisor.name} - ${advisor.role}`);
    }

    // Life Members - Woodwork Team
    console.log('\n🔨 Adding Life Members (Woodwork Team)...');
    const lifeMembers = [
      {
        name: 'Hari Hyamthaku Shrestha',
        role: 'Lead Woodwork Expert',
        category: 'Life Members',
        bio: 'Leading the construction of the Dyou-Kha replica with expert craftsmanship and traditional knowledge.',
        order_index: 1
      },
      {
        name: 'Sugandha Shrestha',
        role: 'Chief Woodwork Assistant',
        category: 'Life Members',
        bio: 'Assisting in the detailed woodwork and construction of the authentic chariot replica.',
        order_index: 2
      },
      {
        name: 'Mani Shrestha',
        role: 'Chief Woodwork Assistant',
        category: 'Life Members',
        bio: 'Contributing expertise in traditional woodwork techniques for the Dyou-Kha construction.',
        order_index: 3
      },
      {
        name: 'Roshan Shrestha',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Dedicated team member working on the Biskaa Jatra Dyou-Kha project.',
        order_index: 4
      },
      {
        name: 'Bigyan Shrestha',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Contributing to the construction and preservation of traditional Newari cultural artifacts.',
        order_index: 5
      },
      {
        name: 'Nirajan Shrestha',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Working tirelessly on the replica construction with dedication and skill.',
        order_index: 6
      },
      {
        name: 'Vishwa Shrestha',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Part of the dedicated team building the historic Dyou-Kha replica.',
        order_index: 7
      },
      {
        name: 'Bal Krishna Prajapati',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Contributing woodwork expertise to the Biskaa Jatra celebration project.',
        order_index: 8
      },
      {
        name: 'Sanam Sikhrakar',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Committed volunteer working on traditional craft construction.',
        order_index: 9
      },
      {
        name: 'Delesh Shrestha',
        role: 'Woodwork Team Member',
        category: 'Life Members',
        bio: 'Dedicated member of the woodwork team preserving cultural heritage.',
        order_index: 10
      }
    ];

    for (const member of lifeMembers) {
      await db.run(
        'INSERT INTO team_members (name, role, category, bio, order_index) VALUES (?, ?, ?, ?, ?)',
        [member.name, member.role, member.category, member.bio, member.order_index]
      );
      console.log(`  ✓ Added: ${member.name} - ${member.role}`);
    }

    // Verify the count
    const result = await db.get('SELECT COUNT(*) as total FROM team_members');
    console.log(`\n✅ Successfully added ${result.total} team members!`);
    
    // Show breakdown
    const executive = await db.get('SELECT COUNT(*) as count FROM team_members WHERE category = "Executive"');
    const advisorsCount = await db.get('SELECT COUNT(*) as count FROM team_members WHERE category = "Advisors"');
    const lifeCount = await db.get('SELECT COUNT(*) as count FROM team_members WHERE category = "Life Members"');
    
    console.log(`   👔 Executive Team: ${executive.count}`);
    console.log(`   💡 Advisors: ${advisorsCount.count}`);
    console.log(`   🔨 Life Members: ${lifeCount.count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
    console.log('\n📁 Database closed');
  }
}

addTeamMembers();
