# Assets Folder Structure

This folder contains all the static assets for the website.

## 📁 Folder Organization

### `/images/logo/`
Place your website logo here:
- `logo.png` - Main website logo (recommended: 512x512px, PNG with transparent background)
- Used in: Navbar, Hero section, Footer, Browser favicon

### `/images/posts/`
Store individual blog post images here:
- Use descriptive names: `festival-indra-jatra.jpg`
- Recommended size: 800x600px or larger
- Format: JPG or PNG

### `/images/banners/`
Store blog post banner images here:
- Hero banners for blog posts
- Feature images for articles
- Recommended size: 1200x600px (2:1 ratio)
- Format: JPG or PNG

## 💡 Usage Tips

1. **Optimize images** before uploading (use tools like TinyPNG)
2. **Use descriptive names** for better organization
3. **Keep consistent dimensions** for professional look
4. **WebP format** recommended for better performance

## 🔧 Import Examples

```javascript
// Import logo
import logo from '@/assets/images/logo/logo.png'

// Import post image
import postImage from '@/assets/images/posts/festival.jpg'

// Import banner
import banner from '@/assets/images/banners/hero-banner.jpg'
```

## 📝 Notes

- Maximum recommended file size: 500KB per image
- Use lowercase with hyphens for file names
- Avoid spaces in file names
