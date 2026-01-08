# 🚀 Vercel Deployment Guide

## ✅ Code is Ready for Deployment!

Your frontend code has been configured for production deployment on Vercel.

## 📋 Steps to Deploy on Vercel:

### 1. **Push to GitHub**
```bash
cd frontend
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 2. **Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Select your repository: `lyalmha-america-website`
5. Vercel will auto-detect it's a Vite project

### 3. **Configure Project Settings**

**Framework Preset:** Vite

**Root Directory:** `frontend` (important!)

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

### 4. **Environment Variables (Optional)**
If you want to use a different backend URL:
- Add environment variable: `VITE_API_URL`
- Value: `https://lyalmha-america-website-production.up.railway.app`

### 5. **Deploy**
Click **"Deploy"** button and wait 2-3 minutes!

## 🔧 Current Configuration

✅ **API URL:** 
- Production: `https://lyalmha-america-website-production.up.railway.app`
- Local Dev: `http://localhost:5000` (via .env.local)

✅ **Files Updated:**
- `api.js` - Set to use Railway backend
- `.env.local` - Local development config (not pushed to GitHub)
- `.gitignore` - Added .env.local
- `vercel.json` - SPA routing configuration

## 🌐 After Deployment

Your site will be available at:
`https://your-project-name.vercel.app`

### Update Backend CORS
Don't forget to update your Railway backend `server.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'https://your-project-name.vercel.app',
    'https://lyalmha-america-website.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}))
```

## 🔄 Auto-Deploy

Once connected, every push to your GitHub main branch will automatically:
1. ✅ Build your project
2. ✅ Deploy to production
3. ✅ Update your live site

## 📱 Testing

After deployment, test these features:
- ✅ Homepage loads
- ✅ Admin login works
- ✅ Image uploads work
- ✅ All pages accessible

## 🆘 Troubleshooting

**Build Fails?**
- Check build logs in Vercel dashboard
- Make sure all dependencies in package.json
- Verify no TypeScript errors

**API Not Working?**
- Check CORS settings in backend
- Verify Railway backend is running
- Check browser console for errors

**Images Not Loading?**
- Images need to be hosted on Railway backend
- Or upload to Cloudinary and update image URLs

## 📝 Notes

- `.env.local` is for local development only (not deployed)
- Production uses Railway backend by default
- Admin panel works at `/admin/login`
- All uploads stored on Railway backend

---

Need help? Check Vercel docs or your deployment logs! 🎉
