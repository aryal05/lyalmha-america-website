import { getDatabase, initializeDatabase } from './database.js'
import cloudinary from './config/cloudinary.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrateBannersToCloudinary() {
  try {
    // Initialize database first
    await initializeDatabase()
    
    const db = await getDatabase()
    const banners = await db.all('SELECT * FROM banners')
    
    console.log(`Found ${banners.length} banners to migrate`)
    
    for (const banner of banners) {
      // Skip if already a cloudinary URL
      if (banner.image && banner.image.includes('cloudinary.com')) {
        console.log(`Banner ${banner.id} already on Cloudinary`)
        continue
      }
      
      if (banner.image && banner.image.startsWith('/uploads/')) {
        const imagePath = path.join(__dirname, banner.image)
        
        if (fs.existsSync(imagePath)) {
          console.log(`Uploading banner ${banner.id} to Cloudinary...`)
          
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'lyalmha-america/banners'
          })
          
          // Update database with new URL
          await db.run(
            'UPDATE banners SET image = ? WHERE id = ?',
            result.secure_url,
            banner.id
          )
          
          console.log(`✓ Banner ${banner.id} migrated successfully`)
        } else {
          console.log(`✗ Image file not found for banner ${banner.id}: ${imagePath}`)
        }
      }
    }
    
    console.log('\n✓ Migration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateBannersToCloudinary()
