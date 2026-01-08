import { getDatabase, initializeDatabase } from './database.js'

const migrateImagesToCloudinary = async () => {
  // Initialize database first
  await initializeDatabase()
  const db = getDatabase()
  
  console.log('🔄 Starting image path migration...\n')
  
  try {
    // Get all blogs with local paths
    const blogs = await db.all("SELECT id, title, banner FROM blogs WHERE banner LIKE '/uploads/%'")
    console.log(`📝 Found ${blogs.length} blogs with local image paths`)
    
    // Get all banners with local paths
    const banners = await db.all("SELECT id, title, image FROM banners WHERE image LIKE '/uploads/%'")
    console.log(`🎨 Found ${banners.length} banners with local image paths`)
    
    // Get all news with local paths
    const news = await db.all("SELECT id, title, image FROM news WHERE image LIKE '/uploads/%'")
    console.log(`📰 Found ${news.length} news items with local image paths`)
    
    // Get all gallery with local paths
    const gallery = await db.all("SELECT id, title, image FROM gallery WHERE image LIKE '/uploads/%'")
    console.log(`🖼️  Found ${gallery.length} gallery items with local image paths\n`)
    
    console.log('⚠️  IMPORTANT: These images need to be re-uploaded through the admin panel!')
    console.log('   The files no longer exist on Railway server.\n')
    
    console.log('📋 Summary of affected items:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    if (blogs.length > 0) {
      console.log('\n📝 Blogs:')
      blogs.forEach(blog => console.log(`   - ${blog.title} (ID: ${blog.id})`))
    }
    
    if (banners.length > 0) {
      console.log('\n🎨 Banners:')
      banners.forEach(banner => console.log(`   - ${banner.title} (ID: ${banner.id})`))
    }
    
    if (news.length > 0) {
      console.log('\n📰 News:')
      news.forEach(item => console.log(`   - ${item.title} (ID: ${item.id})`))
    }
    
    if (gallery.length > 0) {
      console.log('\n🖼️  Gallery:')
      gallery.forEach(item => console.log(`   - ${item.title} (ID: ${item.id})`))
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 OPTIONS:')
    console.log('   1. Re-upload images through admin panel (recommended)')
    console.log('   2. Set images to NULL to remove broken links')
    console.log('   3. Upload images to Cloudinary manually and update database')
    
    // Ask for user input
    console.log('\n❓ What would you like to do?')
    console.log('   [1] Set all local image paths to NULL (removes images)')
    console.log('   [2] Keep as-is and re-upload manually')
    console.log('   [3] Exit without changes')
    
  } catch (error) {
    console.error('❌ Error during migration:', error)
  }
}

// If running with --clear flag, clear all local paths
if (process.argv.includes('--clear')) {
  await initializeDatabase()
  const db = getDatabase()
  
  console.log('🗑️  Clearing all local image paths...\n')
  
  // Use placeholder image URL for items that require an image
  const placeholder = 'https://via.placeholder.com/800x600/1a1a1a/ffd700?text=Please+Re-upload+Image'
  
  await db.run("UPDATE blogs SET banner = NULL WHERE banner LIKE '/uploads/%'")
  await db.run("UPDATE banners SET image = ? WHERE image LIKE '/uploads/%'", [placeholder])
  await db.run("UPDATE news SET image = NULL WHERE image LIKE '/uploads/%'")
  await db.run("UPDATE gallery SET image = ? WHERE image LIKE '/uploads/%'", [placeholder])
  
  console.log('✅ All local image paths have been cleared!')
  console.log('📸 Banners now use placeholder images (they require images)')
  console.log('📸 Blogs, News, and Gallery images set to NULL')
  console.log('📸 You can now re-upload images through the admin panel.\n')
  
  process.exit(0)
}

// Run the migration check
migrateImagesToCloudinary()
