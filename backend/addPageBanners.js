import { getDatabase, initializeDatabase } from './database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function addPageBanners() {
  try {
    // Initialize database
    await initializeDatabase()
    const db = await getDatabase()

    console.log('🎨 Adding page-specific banners...')

    // Source and destination paths
    const sourcePostDir = path.join(__dirname, '../frontend/src/assets/images/posts')
    const destBannerDir = path.join(__dirname, 'uploads/banners')

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destBannerDir)) {
      fs.mkdirSync(destBannerDir, { recursive: true })
    }

    // Copy banner files to uploads directory
    const pageImages = {
      about: '471944315_555366943987150_1453996420800501859_n.jpg',
      blogs: '471944315_555366943987150_1453996420800501859_n.jpg',
      culture: '467736461_487936857446592_6777699176984050234_n (1).jpg',
      contact: '462650425_598936739649734_2260957587124948845_n.jpg'
    }

    const copiedFiles = []
    for (const [page, file] of Object.entries(pageImages)) {
      const sourcePath = path.join(sourcePostDir, file)
      if (fs.existsSync(sourcePath)) {
        const destPath = path.join(destBannerDir, file)
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(sourcePath, destPath)
          console.log(`✅ Copied: ${file}`)
        }
        copiedFiles.push({ page, file })
      } else {
        console.log(`⚠️  File not found: ${file}`)
      }
    }

    // Banner data to insert
    const pageBanners = [
      {
        title: 'About Lyalmha America',
        description: 'Learn about our mission, values, and the newari community in America',
        image: `/uploads/banners/${pageImages.about}`,
        link: '/about',
        position: 'about',
        order_index: 1,
        active: 1
      },
      {
        title: 'Our Blog',
        description: 'Stories, insights, and updates from our community journey',
        image: `/uploads/banners/${pageImages.blogs}`,
        link: '/blogs',
        position: 'blogs',
        order_index: 1,
        active: 1
      },
      {
        title: 'newari Culture',
        description: 'Discover the rich heritage, traditions, and festivals of the newari civilization',
        image: `/uploads/banners/${pageImages.culture}`,
        link: '/culture',
        position: 'culture',
        order_index: 1,
        active: 1
      },
      {
        title: 'Contact Us',
        description: 'Get in touch with the Lyalmha America community',
        image: `/uploads/banners/${pageImages.contact}`,
        link: '/contact',
        position: 'contact',
        order_index: 1,
        active: 1
      }
    ]

    // Insert banners
    const insertStmt = await db.prepare(`
      INSERT INTO banners (title, description, image, link, position, order_index, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    let insertedCount = 0
    for (const banner of pageBanners) {
      await insertStmt.run(
        banner.title,
        banner.description,
        banner.image,
        banner.link,
        banner.position,
        banner.order_index,
        banner.active
      )
      insertedCount++
    }

    console.log(`\n✅ Successfully added ${insertedCount} page banners!`)
    console.log(`🖼️  Banner files copied: ${copiedFiles.length}`)
    console.log('\nBanners added:')
    pageBanners.forEach((banner, index) => {
      console.log(`  ${index + 1}. ${banner.title} - Position: ${banner.position}`)
    })

  } catch (error) {
    console.error('❌ Error adding page banners:', error)
    process.exit(1)
  }
}

// Run the function
addPageBanners()
