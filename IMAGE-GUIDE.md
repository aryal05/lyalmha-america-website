# 📸 Image Management Guide

## Folder Structure Created

Your image assets are organized in:

```
frontend/src/assets/images/
├── logo/          → Website logo
├── posts/         → Blog post images
└── banners/       → Hero/banner images
```

## 📁 Where to Place Your Images

### 1. **Website Logo**
**Location:** `frontend/src/assets/images/logo/logo.png`

**Also place a copy in:** `frontend/public/logo.png` (for favicon)

**Used in:**
- Navigation bar
- Hero section (large, animated)
- Footer
- Browser tab icon

---

### 2. **Blog Post Images**
**Location:** `frontend/src/assets/images/posts/`

**Examples:**
- `festival-indra-jatra.jpg`
- `newari-cuisine-yomari.jpg`
- `traditional-music-dhime.jpg`

**Used in:**
- Blog card thumbnails
- Within blog post content
- Gallery sections

---

### 3. **Banner Images**
**Location:** `frontend/src/assets/images/banners/`

**Examples:**
- `banner-cultural-heritage.jpg`
- `banner-festival-celebration.jpg`
- `banner-community-events.jpg`

**Used in:**
- Blog post hero sections
- Feature images for articles
- Top of blog cards

---

## 🔧 How to Use Images in Code

### Option 1: Import in Components (Recommended for local images)

```javascript
// In your component file
import logo from '@/assets/images/logo/logo.png'
import bannerImg from '@/assets/images/banners/festival.jpg'

function Component() {
  return <img src={logo} alt="Logo" />
}
```

### Option 2: Public Folder (For images referenced in multiple places)

```javascript
// Place in: frontend/public/images/logo.png
// Use directly:
<img src="/images/logo.png" alt="Logo" />
```

### Option 3: External URLs (Current Setup)

```javascript
// Using Unsplash or your CDN
banner: 'https://your-cdn.com/image.jpg'
```

---

## 📝 Updating Blog Posts with Local Images

### Update BlogGrid.jsx

```javascript
// Import images at the top
import banner1 from '@/assets/images/banners/indra-jatra.jpg'
import banner2 from '@/assets/images/banners/newari-food.jpg'

// Use in blogs array
const blogs = [
  {
    banner: banner1,  // Use imported image
    title: 'Your Blog Title',
    // ... rest of the data
  }
]
```

---

## 🎨 Image Specifications

### Logo
- **Format:** PNG with transparent background
- **Size:** 512x512px minimum
- **Aspect Ratio:** 1:1 (square)
- **Max File Size:** 200KB

### Blog Posts
- **Format:** JPG or PNG
- **Size:** 800x600px (4:3 ratio)
- **Aspect Ratio:** 4:3 or 16:9
- **Max File Size:** 500KB

### Banners
- **Format:** JPG (best for photos)
- **Size:** 1200x600px or 1920x1080px
- **Aspect Ratio:** 2:1 or 16:9
- **Max File Size:** 500KB

---

## 🚀 Quick Start Steps

### Step 1: Add Your Logo
1. Save your logo as `logo.png`
2. Place it in TWO locations:
   - `frontend/src/assets/images/logo/logo.png`
   - `frontend/public/logo.png`

### Step 2: Add Banner Images (Optional)
1. Optimize your images using [TinyPNG](https://tinypng.com)
2. Rename with descriptive names: `festival-celebration.jpg`
3. Place in `frontend/src/assets/images/banners/`

### Step 3: Update Component References
If using local images, update:
- `frontend/src/components/BlogGrid.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Hero.jsx`
- `frontend/src/components/Footer.jsx`

---

## 💡 Pro Tips

1. **Optimize Images First**
   - Use [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
   - Reduce file size by 60-80% without quality loss

2. **Use WebP Format**
   - Modern format with better compression
   - Fallback to JPG for older browsers

3. **Consistent Naming**
   - Use lowercase
   - Use hyphens, not spaces
   - Be descriptive: `newari-festival-indra-jatra.jpg`

4. **Keep Organized**
   - Delete unused images
   - Use subfolders if needed: `posts/festivals/`, `posts/food/`

5. **Version Control**
   - Commit optimized images only
   - Keep originals in a separate backup folder

---

## 🔄 Current vs New Setup

### Before (Current):
```javascript
// Using external URLs
banner: 'https://images.unsplash.com/photo-123...'
```

### After (With Local Images):
```javascript
// Import at top of file
import banner from '@/assets/images/banners/my-banner.jpg'

// Use in component
banner: banner
```

---

## 📦 Deployment Considerations

- **Vercel/Netlify**: Automatically handles image optimization
- **Images in `src/assets`**: Bundled by Vite, optimized
- **Images in `public`**: Served as-is, not optimized
- **External URLs**: Loaded from CDN, faster global delivery

---

## ❓ Need Help?

**Where to add logo?**
→ `frontend/src/assets/images/logo/logo.png` AND `frontend/public/logo.png`

**How to use custom images in blogs?**
→ Import in BlogGrid.jsx and update the banner property

**Images not showing?**
→ Check file path, ensure file exists, restart dev server

**Images too large?**
→ Optimize at [tinypng.com](https://tinypng.com)

---

✅ **Your image folders are ready to use!**
