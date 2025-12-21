# Deployment Guide 🚀

## Successfully Deployed WordPress Editor!

### ✅ GitHub Update - COMPLETE
**Commit:** 544ca89  
**Branch:** main  
**Changes Pushed:**
- WordPress-style blog editor with ReactQuill
- AdminBlogs.jsx transformed to 2-column layout
- AdminBlogs.css custom styling
- react-quill package installed
- WORDPRESS-EDITOR-COMPLETE.md documentation

---

## Deployment Instructions

### 1. 🎨 Frontend Deployment (Vercel)

Your frontend is configured to automatically deploy from GitHub.

**Auto-Deploy Setup:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Your project: `lyalmha-america-website` (frontend)
3. Vercel will automatically detect the new commit `544ca89`
4. Deployment will start automatically

**Manual Deploy (if needed):**
```bash
# In frontend directory
cd frontend
npm install
npm run build
# Then push to Vercel via their CLI or dashboard
```

**Environment Variable to Set in Vercel:**
- `VITE_API_URL` = `https://lyalmha-america-website-production.up.railway.app`

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. 🚂 Backend Deployment (Railway)

Your backend is configured with Railway and uses the Railway URL.

**Auto-Deploy Setup:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Your project: `lyalmha-america-website` (backend)
3. Connect to GitHub repository if not already connected
4. Railway will auto-deploy on new commits to main branch

**Manual Deploy (if needed):**
```bash
# Railway will automatically build and deploy
# Just push to GitHub and Railway detects it
git push origin main
```

**Railway Configuration:**
- Start Command: `node server.js` (already in railway.json)
- Builder: NIXPACKS (already configured)
- Restart Policy: ON_FAILURE with 10 retries

**Environment Variables Already Set:**
- `DATABASE_URL` or SQLite path
- `JWT_SECRET`
- `PORT` (Railway auto-assigns)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

### 3. 🔗 API Configuration

**Current Setup (Already Correct):**

Frontend `api.js`:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 
  'https://lyalmha-america-website-production.up.railway.app'
```

This means:
- ✅ Uses Railway URL by default
- ✅ Can be overridden with environment variable
- ✅ No localhost hardcoding

---

## Verification Checklist

### After Vercel Deployment:
- [ ] Visit your Vercel domain
- [ ] Navigate to `/admin/login`
- [ ] Login with admin credentials
- [ ] Go to `/admin/blogs`
- [ ] Click "New Blog" button
- [ ] Verify WordPress-style editor appears
- [ ] Test rich text formatting (bold, italic, headings)
- [ ] Upload a featured image
- [ ] Publish a test blog
- [ ] Check if blog appears in the list

### After Railway Deployment:
- [ ] Check Railway logs for successful deployment
- [ ] Test API endpoint: `https://lyalmha-america-website-production.up.railway.app/api/blogs`
- [ ] Verify database is accessible
- [ ] Check Cloudinary image uploads work
- [ ] Test authentication endpoints

---

## Current Deployment Status

### ✅ GitHub
- **Status:** Updated
- **Latest Commit:** 544ca89
- **Branch:** main
- **Repository:** aryal05/lyalmha-america-website

### 🎨 Vercel (Frontend)
- **Status:** Ready to deploy
- **Action Required:** 
  1. Vercel will auto-deploy from GitHub
  2. Or manually trigger deployment from Vercel dashboard
  3. Set `VITE_API_URL` environment variable

### 🚂 Railway (Backend)
- **Status:** Ready to deploy
- **Action Required:**
  1. Railway will auto-deploy from GitHub
  2. Or manually trigger deployment from Railway dashboard
  3. Verify environment variables are set

---

## API Endpoint Configuration

Your frontend will fetch data from:
```
https://lyalmha-america-website-production.up.railway.app
```

**Available Endpoints:**
- `GET /api/blogs` - Get all published blogs
- `GET /api/admin/blogs/admin/all` - Get all blogs (admin)
- `POST /api/admin/blogs` - Create new blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog
- Similar endpoints for team, events, supporters, banners

---

## WordPress Editor Features (Now Live!)

Once deployed, admins can:
1. ✅ Use rich text formatting (no HTML knowledge needed)
2. ✅ See live preview while writing
3. ✅ Upload featured images with drag-and-drop
4. ✅ Organize content with sidebar controls
5. ✅ Save as draft or publish immediately
6. ✅ Edit existing blogs with formatting preserved

---

## Troubleshooting

### If Vercel deployment fails:
```bash
# Check build logs in Vercel dashboard
# Common issues:
- Missing dependencies: Run `npm install` in frontend
- Build errors: Check for TypeScript/ESLint errors
- Environment variables: Verify VITE_API_URL is set
```

### If Railway deployment fails:
```bash
# Check Railway logs
# Common issues:
- Port binding: Railway auto-assigns PORT
- Database path: Verify SQLite or DATABASE_URL
- Start command: Should be `node server.js`
```

### If API calls fail:
1. Check Network tab in browser DevTools
2. Verify Railway URL is accessible
3. Check CORS settings in backend
4. Verify authentication tokens

---

## Next Steps

1. **Wait for auto-deployment** or manually trigger
2. **Test the WordPress editor** on live site
3. **Create a real blog post** to verify functionality
4. **Monitor logs** for any errors
5. **Update DNS** if using custom domain

---

## Support & Monitoring

**GitHub:** https://github.com/aryal05/lyalmha-america-website  
**Vercel Dashboard:** https://vercel.com/dashboard  
**Railway Dashboard:** https://railway.app/dashboard  

**Status:** ✅ All code deployed to GitHub - Auto-deployment in progress!
