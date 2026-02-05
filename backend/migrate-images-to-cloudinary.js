import pkg from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dxnte5zpl',
  api_key: '717426112357948',
  api_secret: 'n-mi1aj4VmPsOrA-2bRTvSPfIg0'
});

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://postgres.frcgygnjugngsxebygso:Accountmaker12%23%24@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

// Image directories
const postsDir = path.join(__dirname, '../frontend/src/assets/images/posts');
const bannersDir = path.join(__dirname, '../frontend/src/assets/images/banners');

// Get list of local images
function getLocalImages(dir) {
  try {
    return fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    return [];
  }
}

// Upload image to Cloudinary
async function uploadToCloudinary(localPath, folder) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `lyalmha/${folder}`,
      resource_type: 'image'
    });
    console.log(`✅ Uploaded: ${path.basename(localPath)} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`❌ Failed to upload ${localPath}:`, err.message);
    return null;
  }
}

// Check if URL is broken (Supabase)
function isBrokenSupabaseUrl(url) {
  return url && url.includes('frcgygnjugngsxebygso.supabase.co/storage');
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Cloudinary...\n');
  
  // Get local images
  const postImages = getLocalImages(postsDir);
  const bannerImages = getLocalImages(bannersDir);
  
  console.log(`Found ${postImages.length} images in posts folder`);
  console.log(`Found ${bannerImages.length} images in banners folder\n`);
  
  // Upload all post images first and store URLs
  console.log('=== UPLOADING POST IMAGES ===\n');
  const uploadedPostImages = [];
  for (const img of postImages) {
    const localPath = path.join(postsDir, img);
    const cloudinaryUrl = await uploadToCloudinary(localPath, 'posts');
    if (cloudinaryUrl) {
      uploadedPostImages.push({ name: img, url: cloudinaryUrl });
    }
  }
  
  console.log('\n=== UPLOADING BANNER IMAGES ===\n');
  const uploadedBannerImages = [];
  for (const img of bannerImages) {
    const localPath = path.join(bannersDir, img);
    const cloudinaryUrl = await uploadToCloudinary(localPath, 'banners');
    if (cloudinaryUrl) {
      uploadedBannerImages.push({ name: img, url: cloudinaryUrl });
    }
  }
  
  console.log('\n=== UPDATING DATABASE RECORDS ===\n');
  
  // Get all broken image records
  let imageIndex = 0;
  
  // 1. Update blogs with broken Supabase URLs
  const blogs = await pool.query('SELECT id, title, banner FROM blogs WHERE banner LIKE $1', ['%supabase.co/storage%']);
  console.log(`Found ${blogs.rows.length} blogs with broken Supabase URLs`);
  for (const blog of blogs.rows) {
    if (uploadedPostImages[imageIndex]) {
      await pool.query('UPDATE blogs SET banner = $1 WHERE id = $2', [uploadedPostImages[imageIndex].url, blog.id]);
      console.log(`✅ Updated blog "${blog.title}" with ${uploadedPostImages[imageIndex].name}`);
      imageIndex++;
    }
  }
  
  // 2. Update banners with broken Supabase URLs
  const banners = await pool.query('SELECT id, title, image FROM banners WHERE image LIKE $1', ['%supabase.co/storage%']);
  console.log(`\nFound ${banners.rows.length} banners with broken Supabase URLs`);
  let bannerIndex = 0;
  for (const banner of banners.rows) {
    // Use banner images if available, otherwise use post images
    const imgToUse = uploadedBannerImages[bannerIndex] || uploadedPostImages[imageIndex];
    if (imgToUse) {
      await pool.query('UPDATE banners SET image = $1 WHERE id = $2', [imgToUse.url, banner.id]);
      console.log(`✅ Updated banner "${banner.title}" with ${imgToUse.name}`);
      if (uploadedBannerImages[bannerIndex]) {
        bannerIndex++;
      } else {
        imageIndex++;
      }
    }
  }
  
  // 3. Update events with broken Supabase URLs
  const events = await pool.query('SELECT id, title, image FROM events WHERE image LIKE $1', ['%supabase.co/storage%']);
  console.log(`\nFound ${events.rows.length} events with broken Supabase URLs`);
  for (const event of events.rows) {
    if (uploadedPostImages[imageIndex]) {
      await pool.query('UPDATE events SET image = $1 WHERE id = $2', [uploadedPostImages[imageIndex].url, event.id]);
      console.log(`✅ Updated event "${event.title}" with ${uploadedPostImages[imageIndex].name}`);
      imageIndex++;
    }
  }
  
  // 4. Update event_images with broken Supabase URLs
  const eventImages = await pool.query('SELECT id, event_id, image_url FROM event_images WHERE image_url LIKE $1', ['%supabase.co/storage%']);
  console.log(`\nFound ${eventImages.rows.length} event images with broken Supabase URLs`);
  for (const img of eventImages.rows) {
    if (uploadedPostImages[imageIndex]) {
      await pool.query('UPDATE event_images SET image_url = $1 WHERE id = $2', [uploadedPostImages[imageIndex].url, img.id]);
      console.log(`✅ Updated event_image ${img.id} (event ${img.event_id}) with ${uploadedPostImages[imageIndex].name}`);
      imageIndex++;
    }
  }
  
  // 5. Update gallery with broken Supabase URLs
  try {
    const gallery = await pool.query('SELECT id, title, image_url FROM gallery WHERE image_url LIKE $1', ['%supabase.co/storage%']);
    console.log(`\nFound ${gallery.rows.length} gallery items with broken Supabase URLs`);
    for (const item of gallery.rows) {
      if (uploadedPostImages[imageIndex]) {
        await pool.query('UPDATE gallery SET image_url = $1 WHERE id = $2', [uploadedPostImages[imageIndex].url, item.id]);
        console.log(`✅ Updated gallery "${item.title}" with ${uploadedPostImages[imageIndex].name}`);
        imageIndex++;
      }
    }
  } catch (err) {
    console.log('Gallery table not found or has different structure');
  }
  
  // 6. Update activities with broken Supabase URLs
  try {
    const activities = await pool.query('SELECT id, title, icon_image FROM activities WHERE icon_image LIKE $1', ['%supabase.co/storage%']);
    console.log(`\nFound ${activities.rows.length} activities with broken Supabase URLs`);
    for (const activity of activities.rows) {
      if (uploadedPostImages[imageIndex]) {
        await pool.query('UPDATE activities SET icon_image = $1 WHERE id = $2', [uploadedPostImages[imageIndex].url, activity.id]);
        console.log(`✅ Updated activity "${activity.title}" with ${uploadedPostImages[imageIndex].name}`);
        imageIndex++;
      }
    }
  } catch (err) {
    console.log('Activities table check:', err.message);
  }
  
  // 7. Update supporters with broken Supabase URLs
  try {
    const supporters = await pool.query('SELECT id, name, logo FROM supporters WHERE logo LIKE $1', ['%supabase.co/storage%']);
    console.log(`\nFound ${supporters.rows.length} supporters with broken Supabase URLs`);
    for (const supporter of supporters.rows) {
      if (uploadedPostImages[imageIndex]) {
        await pool.query('UPDATE supporters SET logo = $1 WHERE id = $2', [uploadedPostImages[imageIndex].url, supporter.id]);
        console.log(`✅ Updated supporter "${supporter.name}" with ${uploadedPostImages[imageIndex].name}`);
        imageIndex++;
      }
    }
  } catch (err) {
    console.log('Supporters table check:', err.message);
  }
  
  console.log(`\n✅ Migration complete! Used ${imageIndex} images from posts folder.`);
  console.log(`Remaining unused images: ${uploadedPostImages.length - imageIndex}`);
  
  await pool.end();
}

migrateImages().catch(err => {
  console.error('Migration failed:', err);
  pool.end();
  process.exit(1);
});
