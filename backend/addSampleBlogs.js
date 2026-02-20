import { initializeDatabase, getDatabase } from './database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function addSampleBlogs() {
  try {
    await initializeDatabase()
    const db = getDatabase()
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads', 'blogs')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Copy images from frontend to backend
    const frontendImagesPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'images')
    const imageCopies = [
      { from: 'banners/4th Biskaa Jatraa Celebrations flyer (2).jpg', to: 'biskaa-jatra-2024.jpg' },
      { from: 'posts/430057563_377416895039960_1581867728642530497_n.jpg', to: 'dyou-kha-building.jpg' },
      { from: 'posts/433421627_946258180277784_6165530352102042076_n.jpg', to: 'cultural-workshops.jpg' },
      { from: 'posts/438077842_407204048727911_1401114441457624925_n.jpg', to: 'biskaa-significance.jpg' },
      { from: 'posts/441866713_422562883858694_1264372065029721811_n.jpg', to: 'community-supporters.jpg' },
      { from: 'posts/445713232_430645966383719_2625800335039061236_n.jpg', to: 'traditional-music.jpg' }
    ]
    
    console.log('📸 Copying images...')
    for (const img of imageCopies) {
      const source = path.join(frontendImagesPath, img.from)
      const dest = path.join(uploadsDir, img.to)
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest)
        console.log(`  ✓ Copied ${img.to}`)
      } else {
        console.log(`  ✗ Source not found: ${img.from}`)
      }
    }
    
    const sampleBlogs = [
      {
        title: 'Biskaa Jatra 2024: A Celebration of Heritage and Unity',
        excerpt: 'On April 13, 2024, our community came together for the 2nd Biskaa Jatra celebration in the DMV region, showcasing the magnificent Dyou-Kha replica.',
        content: 'On April 13, 2024, our community came together for the 2nd Biskaa Jatra celebration in the DMV region, showcasing the magnificent Dyou-Kha replica. This was a momentous occasion where tradition met dedication, bringing together families from across the region.',
        category: 'Events',
        author: 'Lyalmha America Team',
        status: 'published',
        date: '2024-04-15',
        banner: '/uploads/blogs/biskaa-jatra-2024.jpg'
      },
      {
        title: 'Building the Dyou-Kha: A Labor of Love and Tradition',
        excerpt: 'Behind the scenes of crafting an 8-foot tall, 150 lb replica of the sacred chariot - the first of its kind built outside Nepal-Mandala.',
        content: 'Behind the scenes of crafting an 8-foot tall, 150 lb replica of the sacred chariot - the first of its kind built outside Nepal-Mandala. This project brought together skilled artisans and community members in a collective effort to preserve our traditions.',
        category: 'Culture',
        author: 'Project Team',
        status: 'published',
        date: '2024-03-20',
        banner: '/uploads/blogs/dyou-kha-building.jpg'
      },
      {
        title: 'Cultural Workshops: Connecting Children with Their Roots',
        excerpt: 'Our interactive workshops teach the next generation about newari traditions, language, and arts through engaging activities.',
        content: 'Our interactive workshops teach the next generation about newari traditions, language, and arts through engaging activities. These sessions help children connect with their heritage while growing up in America.',
        category: 'Education',
        author: 'Education Committee',
        status: 'published',
        date: '2024-02-10',
        banner: '/uploads/blogs/cultural-workshops.jpg'
      },
      {
        title: 'The Significance of Biskaa Jatra in newari Culture',
        excerpt: 'Exploring the deep cultural and spiritual meaning behind this weeklong Spring celebration that brings together people and deities.',
        content: 'Exploring the deep cultural and spiritual meaning behind this weeklong Spring celebration that brings together people and deities. Biskaa Jatra represents the eternal cycle of life and the renewal of community bonds.',
        category: 'Culture',
        author: 'Cultural Heritage Team',
        status: 'published',
        date: '2024-01-25',
        banner: '/uploads/blogs/biskaa-significance.jpg'
      },
      {
        title: 'Community Spotlight: Our Generous Supporters',
        excerpt: 'Recognizing the individuals and businesses who make our cultural preservation efforts possible.',
        content: 'Recognizing the individuals and businesses who make our cultural preservation efforts possible. Our community thrives thanks to the dedication and generosity of our supporters who believe in preserving newari culture.',
        category: 'Community',
        author: 'Lyalmha America',
        status: 'published',
        date: '2023-12-15',
        banner: '/uploads/blogs/community-supporters.jpg'
      },
      {
        title: 'Traditional Music and Dance: The Heart of Our Celebrations',
        excerpt: 'From Dhime to Khin, discover the musical traditions that animate our festivals and bring our community together.',
        content: 'From Dhime to Khin, discover the musical traditions that animate our festivals and bring our community together. These rhythms connect us to centuries of cultural heritage.',
        category: 'Music & Arts',
        author: 'Arts Committee',
        status: 'published',
        date: '2023-11-30',
        banner: '/uploads/blogs/traditional-music.jpg'
      }
    ]
    
    // Clear existing blogs first
    await db.run('DELETE FROM blogs')
    console.log('\n🗑️  Cleared existing blogs')
    
    console.log('\n📝 Adding blogs to database...')
    for (const blog of sampleBlogs) {
      const readTime = Math.ceil(blog.content.split(' ').length / 200)
      
      await db.run(`
        INSERT INTO blogs (title, excerpt, content, banner, category, author, date, read_time, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        blog.title,
        blog.excerpt,
        blog.content,
        blog.banner,
        blog.category,
        blog.author,
        blog.date,
        readTime,
        blog.status
      ])
      console.log(`  ✓ Added: ${blog.title}`)
    }
    
    console.log('\n✅ Sample blogs added successfully!')
    console.log(`📝 Total blogs: ${sampleBlogs.length}`)
    
    // Show all blogs
    const blogs = await db.all('SELECT id, title, category, author, date, banner FROM blogs')
    console.log('\n📚 Blogs in database:')
    blogs.forEach(blog => {
      console.log(`  ${blog.id}. ${blog.title}`)
      console.log(`     Category: ${blog.category} | Author: ${blog.author} | Date: ${blog.date}`)
      console.log(`     Image: ${blog.banner}`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addSampleBlogs()
