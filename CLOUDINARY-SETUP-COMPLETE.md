# 🚀 Complete Cloudinary Setup Guide

## Problem: Images disappear after Railway restarts
**Reason:** Railway has ephemeral storage - files uploaded to local folders are deleted on restart/redeploy.

## Solution: Use Cloudinary (Cloud Storage)

---

## Step 1: Get Cloudinary Account (FREE - 2 minutes)

1. Go to: **https://cloudinary.com/users/register_free**
2. Sign up with email (or use Google/GitHub login)
3. Verify your email
4. Go to Dashboard: **https://cloudinary.com/console**

---

## Step 2: Get Your Credentials

On the Cloudinary Dashboard, you'll see:

```
Cloud name: dxxxxx123
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstu123456
```

**COPY ALL THREE VALUES!**

---

## Step 3: Update Local Backend `.env` File

Open: `backend/.env`

Replace these lines with YOUR actual values:
```env
CLOUDINARY_CLOUD_NAME=dxxxxx123                    # YOUR cloud name
CLOUDINARY_API_KEY=123456789012345                 # YOUR API key
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstu123456  # YOUR API secret
```

**Save the file!**

---

## Step 4: Update Railway Environment Variables

⚠️ **CRITICAL - DO THIS OR PRODUCTION WON'T WORK!**

1. Go to Railway Dashboard: https://railway.app/
2. Click your project: `lyalmha-america-website-production`
3. Click your backend service
4. Go to **Variables** tab
5. Click **New Variable** and add these THREE:

```
CLOUDINARY_CLOUD_NAME = dxxxxx123
CLOUDINARY_API_KEY = 123456789012345
CLOUDINARY_API_SECRET = abcdefghijklmnopqrstu123456
```

6. Click **Deploy** to restart with new variables

---

## Step 5: Test Locally

```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

Then:
1. Go to: http://localhost:3000/admin/login
2. Login with admin credentials
3. Go to Admin → Banners
4. Edit a banner and upload an image
5. Save

**Check the image URL in the database - should start with `https://res.cloudinary.com/`**

---

## Step 6: Verify It Works

Run this command to check uploaded images:
```bash
cd backend
node -e "import('./database.js').then(async ({initializeDatabase, getDatabase}) => { await initializeDatabase(); const db = getDatabase(); const banners = await db.all('SELECT image FROM banners WHERE image LIKE '%cloudinary%' LIMIT 1'); console.log('Cloudinary images:', banners); })"
```

Should see URLs like: `https://res.cloudinary.com/dxxxxx123/image/upload/...`

---

## ✅ Once Setup is Complete:

- ✅ Upload images through Admin Panel (Banners, Blogs, News, Gallery)
- ✅ Images stored in Cloudinary cloud
- ✅ Images NEVER disappear on Railway restart
- ✅ Fast CDN delivery worldwide
- ✅ FREE tier: 25GB storage + 25GB bandwidth/month

---

## 🎯 What You Get:

- **Localhost (Development):** Works with Cloudinary ✅
- **Railway (Production):** Works with Cloudinary ✅
- **Images persist forever:** Never lost ✅
- **No git commits needed:** Upload via admin panel ✅

---

## Troubleshooting:

### Images still showing placeholder:
- You need to **re-upload** all images via admin panel
- Old images were stored locally (now deleted)
- New uploads will go to Cloudinary

### 500 Error when uploading:
- Check Cloudinary credentials are correct in `.env` and Railway
- Restart backend after changing `.env`

### Images not showing on Railway:
- Make sure you added environment variables to Railway
- Redeploy Railway after adding variables

---

## Need Help?

Check Cloudinary dashboard to see uploaded images:
https://cloudinary.com/console/media_library

All your images will be organized in folders:
- `lyalmha/banners/`
- `lyalmha/blogs/`
- `lyalmha/news/`
- `lyalmha/gallery/`
