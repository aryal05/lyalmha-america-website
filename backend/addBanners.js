import { getDatabase, initializeDatabase } from './database.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function addBanners() {
  try {
    // Initialize database
    await initializeDatabase()
    const db = await getDatabase()

    console.log('🎨 Starting to add banners...')

    // Check if banners already exist
    const existingBanners = await db.all('SELECT COUNT(*) as count FROM banners')
    if (existingBanners[0].count > 0) {
      console.log('⚠️  Banners already exist. Skipping...')
      console.log(`Found ${existingBanners[0].count} existing banners.`)
      process.exit(0)
    }

    // Source and destination paths
    const sourceBannerDir = path.join(__dirname, '../frontend/src/assets/images/banners')
    const destBannerDir = path.join(__dirname, 'uploads/banners')

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destBannerDir)) {
      fs.mkdirSync(destBannerDir, { recursive: true })
    }

    // Copy banner files to uploads directory
    const bannerFiles = [
      '4th Biskaa Jatraa Celebrations flyer (2).jpg',
      'f8334069-50ca-4b69-b9a9-480ba09cb41f.jpg'
    ]

    const copiedFiles = []
    for (const file of bannerFiles) {
      const sourcePath = path.join(sourceBannerDir, file)
      if (fs.existsSync(sourcePath)) {
        const destPath = path.join(destBannerDir, file)
        fs.copyFileSync(sourcePath, destPath)
        copiedFiles.push(file)
        console.log(`✅ Copied: ${file}`)
      } else {
        console.log(`⚠️  File not found: ${file}`)
      }
    }

    // Banner data to insert
    const banners = [
      {
        title: 'Biskaa Jatra Celebration 2024',
        description: 'Join us in celebrating the traditional Newari festival with cultural performances, music, and community gathering',
        image: `/uploads/banners/${bannerFiles[0]}`,
        link: '/about',
        position: 'hero',
        order_index: 1,
        active: 1
      },
      {
        title: 'Preserving Newari Heritage',
        description: 'Discover the rich cultural heritage and traditions of the Newari community in America',
        image: `/uploads/banners/${bannerFiles[1]}`,
        link: '/culture',
        position: 'hero',
        order_index: 2,
        active: 1
      },
      {
        title: 'Community Events',
        description: 'Stay connected with upcoming cultural events, workshops, and community gatherings',
        image: `/uploads/banners/${bannerFiles[0]}`,
        link: '/about',
        position: 'home',
        order_index: 3,
        active: 1
      }
    ]

    // Insert banners
    const insertStmt = await db.prepare(`
      INSERT INTO banners (title, description, image, link, position, order_index, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    let insertedCount = 0
    for (const banner of banners) {
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

    console.log(`\n✅ Successfully added ${insertedCount} banners!`)
    console.log(`🖼️  Banner files copied: ${copiedFiles.length}`)
    console.log('\nBanners added:')
    banners.forEach((banner, index) => {
      console.log(`  ${index + 1}. ${banner.title} - Position: ${banner.position}`)
    })

  } catch (error) {
    console.error('❌ Error adding banners:', error)
    process.exit(1)
  }
}

// Run the function
addBanners()
