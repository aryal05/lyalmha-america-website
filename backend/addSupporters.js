import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addSupporters() {
  // Open database
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  console.log('✅ Database connected\n');

  // Financial Supporters
  const financialSupporters = [
    // Original Financial Supporters
    "Mr./Mrs. Ashish Chakradhar/Rashmi Dangol",
    "Mr./Mrs. Dhirag Tuladhar/Reshma Gurung",
    "Mr. Dilendra Shrestha",
    "Mrs. Dipta Kasaju/Adhikari",
    "Mr./Mrs. Sajan Shrestha/Smriti Hyamjuu Tuladhar",
    "Mr./Mrs. Samarjung Hirachan/Sandhya",
    "Mr./Mrs. Prajwal Gurung/Kritika Bajrachaya",
    "Mr./Mrs. Krishna Prajapati/Deepa Thapa",
    "Mr./Mrs. Buddha Chitrakar/ Pabitra Chitrakar",
    "Mr./Mrs. Shrawan Gopal Shrestha/Smriti Sayami",
    "Mr./Mrs. Bishesh Tuladhar/ Isha Tuladhar",
    "Mr./Mrs. Pratap Tuladhar/Sharmila Shakya",
    "Mr./Mrs. Abhisekh Tuladhar/Shreya",
    "Mr./Mrs. Krishna Kasaju/Sarala Joshi Kasaju",
    "Mr./Mrs. Sagarjung Tuladhar/Sirjana",
    "Mrs. Meena Dangol/Yogi Dangol",
    "Mr./Mrs. Achyut Burlakoti / Mausami",
    "Mr./Mrs. Nilesh Gurung/Santoshi",
    "Mrs. Chandrakala Hyamjuu",
    "Mr./Mrs. Kapendra Singh Manandhar/Rama",
    "Mr./Mrs. Keshav Tuladhar/Nisha Shakya",
    "Mr./Mrs. Kiran Shakya/Anju",
    "Mr./Mrs. Kishor Tuladhar/Anita",
    "Mr./Mrs. Mahendra Bajracharya/Ajina Tandukar",
    "Mr./Mrs. Prabin Shakya/Yashoda Bajracharya",
    "Mr./Mrs. Prajwal Shakya/Ranju Tandukar",
    "Mr./Mrs. Sachindra Shrestha/ Samjhana Suwal",
    "Mr./Mrs. Shaligram Rajbhandari/Meera",
    "Mr./Mrs. Shakti Shrestha/Banu",
    "Mr./Mrs. Sudarshan Shrestha/Seema",
    // Biskaa Jatra Project Financial Supporters
    "Mr./Mrs. Bal Krishna/Anjalee Maharjan Prajapati",
    "Mr./Mrs. Delesh/Punam Shrestha",
    "Mr./Mrs. Roshan/Sabita Shrestha",
    "Mr./Mrs. Niranjan/Sharmila Shrestha",
    "Mr. Niranjan Shrestha/Mrs. Sushila Pradhan",
    "Mr./Mrs. Pushkar/Bimala Prajapati",
    "Mr./Mrs. Rameshwor/Sharmila Shrestha",
    "Ms./Mrs Prasanna Umar/Sharmila Prajapati",
    "Mr./Mrs. Sugandha/Kalpana Shrestha",
    "Mr./Mrs. Vishwo/Nhasla Shrestha",
    "Mr./Mrs. Bigyan/Priya Shrestha",
    "Mr. Sanam Sikhrakar/Mrs. Rinku Gurung Sikhrakar",
    "Mr./Mrs. Subin/Grishma Hona",
    "Ms. Juni Heka",
    "Mr./Mrs. Siddhanta Thapa/Kamala pun",
    "Mr./Mrs. Mani/Manisha Shrestha",
    "Mr./Mrs. Shyam/Yamuna Shrestha",
    "Mr./Mrs. Subin/Timilia Shrestha",
    "Mr. Sujit Rajbhandary/Mrs. Deepika Shrestha Rajbhandary",
    "Mr. Naresh Karmacharya/Mrs. Shakuntala Shrestha",
    "Mr. Manish Maharjan/Mrs. Sujita Dangol",
    "Mr./Mrs. Sushil/Sabina Shrestha",
    "Mr./Mrs. Sudhir/Gami Shrestha",
    "Mr./Mrs. Manish/Prabina Shrestha",
    "Mr. Bijaya Subedi/Mrs. Ganga Karki",
    "Mr./Mrs. Dipin/Sharmila Ojha",
    "Mr. Anil Ghimire/Mrs. Mina Pandey",
    "Mr. Niresh Khadgi (Anish)/Mrs. Bijita Shrestha",
    "Mrs. Ratna Devi Khadgi",
    "Mr. Raj Maharjan/Mrs. Sajana Shrestha Maharjan"
  ];

  // Corporate Sponsors
  const corporateSponsors = [
    { name: "Spring Hill Real Estate", contactPerson: "Mr. Buddhi Bajracharya / Mrs. Heena Shrestha" },
    { name: "AeroNepal", contactPerson: "Manoj Dhaubadel / Mr. Rakesh Tuladhar" },
    { name: "Classic Diamond & Jewellery", contactPerson: "Mr. Prabin Rajbhandari / Mr. Allan Maharjan" },
    { name: "Indian Mart", contactPerson: "Roshan Khadgi / Mr. Sushil Chand" },
    { name: "Himalayan Soul Foods", contactPerson: "Mr. Sujit Shakya" },
    { name: "Customer Realty", contactPerson: "Mr. Amit Khadgi / Mr. Kamal Parakh" },
    { name: "Nepali Realtors", contactPerson: "Mr. Pradeep Bajracharya / Mr. Nishesh Bhattarai" },
    { name: "Lumanti Virginia", contactPerson: "Mrs. Ashma Maharjan" }
  ];

  try {
    // Clear existing supporters
    await db.run('DELETE FROM supporters');
    console.log('🗑️  Cleared existing supporters\n');

    // Insert financial supporters
    console.log('💰 Adding Financial Supporters...');
    for (const supporter of financialSupporters) {
      await db.run(
        'INSERT INTO supporters (name, type) VALUES (?, ?)',
        [supporter, 'financial']
      );
      console.log(`  ✓ Added: ${supporter}`);
    }

    // Insert corporate sponsors
    console.log('\n🏢 Adding Corporate Sponsors...');
    for (const sponsor of corporateSponsors) {
      await db.run(
        'INSERT INTO supporters (name, type, contact_person) VALUES (?, ?, ?)',
        [sponsor.name, 'corporate', sponsor.contactPerson]
      );
      console.log(`  ✓ Added: ${sponsor.name}`);
    }

    // Verify the count
    const result = await db.get('SELECT COUNT(*) as total FROM supporters');
    console.log(`\n✅ Successfully added ${result.total} supporters!`);
    
    // Show breakdown
    const financial = await db.get('SELECT COUNT(*) as count FROM supporters WHERE type = "financial"');
    const corporate = await db.get('SELECT COUNT(*) as count FROM supporters WHERE type = "corporate"');
    console.log(`   💰 Financial Supporters: ${financial.count}`);
    console.log(`   🏢 Corporate Sponsors: ${corporate.count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.close();
  }
}

addSupporters();
