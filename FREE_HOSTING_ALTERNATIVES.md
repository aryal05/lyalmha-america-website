# Free Hosting Platforms for Node.js + SQLite Backend

## ✅ Platforms That Support SQLite

### 1. **Render.com** (CURRENT - RECOMMENDED)
- ✅ **Free Tier**: 750 hours/month
- ✅ **SQLite Support**: Yes (with persistent disk)
- ✅ **Persistent Storage**: 1GB free disk
- ✅ **Auto-Deploy**: GitHub integration
- ✅ **ES Modules**: Full support
- ⚠️ **Limitation**: Sleeps after 15 min inactivity (~30s wake time)
- 🌐 **Your Backend**: https://lyalmha-america-api.onrender.com

**Setup**: Already done! Just add persistent disk (see RENDER_DEPLOYMENT.md)

---

### 2. **Railway.app** ⭐ EXCELLENT ALTERNATIVE
- ✅ **Free Tier**: $5 credit/month (~500 hours)
- ✅ **SQLite Support**: Yes (persistent volumes)
- ✅ **Persistent Storage**: Built-in volume storage
- ✅ **Auto-Deploy**: GitHub integration
- ✅ **ES Modules**: Full support
- ✅ **No Sleep**: Stays active 24/7
- ✅ **Fast**: Better performance than Render
- 🌐 **URL**: yourapp.up.railway.app

**Pros**:
- Better than Render (no sleep)
- Easier setup
- Built-in database persistence
- Faster cold starts

**Setup Steps**:
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js
6. Add environment variables
7. Add volume: `/app/data` → Mount to store database
8. Deploy!

---

### 3. **Fly.io** ⭐ BEST PERFORMANCE
- ✅ **Free Tier**: 3 VMs, 3GB storage
- ✅ **SQLite Support**: Yes (persistent volumes)
- ✅ **Persistent Storage**: 3GB free
- ✅ **No Sleep**: Always active
- ✅ **ES Modules**: Full support
- ✅ **Global CDN**: Fast worldwide
- ⚠️ **Setup**: Requires CLI installation
- 🌐 **URL**: yourapp.fly.dev

**Pros**:
- Best performance
- No sleep/cold starts
- Global edge network
- More generous free tier

**Setup Steps**:
1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login: `flyctl auth login`
3. In backend folder: `flyctl launch`
4. Add volume: `flyctl volumes create data --size 1`
5. Update fly.toml with volume mount
6. Deploy: `flyctl deploy`

---

### 4. **Koyeb** 🆕 EMERGING PLATFORM
- ✅ **Free Tier**: 1 web service, 1 database
- ✅ **SQLite Support**: Yes (persistent storage)
- ✅ **Persistent Storage**: 2GB free
- ✅ **Auto-Deploy**: GitHub integration
- ✅ **No Sleep**: Always active
- ✅ **ES Modules**: Full support
- 🌐 **URL**: yourapp.koyeb.app

**Pros**:
- No sleep on free tier
- Simple setup
- Good performance

**Setup Steps**:
1. Go to https://koyeb.com
2. Sign up with GitHub
3. Create new app → Deploy from GitHub
4. Add persistent volume
5. Set environment variables
6. Deploy!

---

### 5. **Cyclic.sh** ⚠️ LIMITED
- ✅ **Free Tier**: 3 apps
- ⚠️ **SQLite Support**: Limited (uses AWS S3 for storage)
- ⚠️ **Persistent Storage**: S3-based (slower)
- ✅ **Auto-Deploy**: GitHub integration
- ✅ **No Sleep**: Always active
- 🌐 **URL**: yourapp.cyclic.app

**Cons**:
- SQLite on S3 is slow
- Not ideal for database-heavy apps

---

### 6. **Glitch.com** ❌ NOT RECOMMENDED
- ✅ **Free Tier**: Unlimited projects
- ❌ **SQLite Support**: No persistent storage
- ❌ **Data Loss**: Resets every time
- ⚠️ **Sleeps**: After 5 min inactivity

**Not suitable for your project**

---

### 7. **Heroku** 💰 NO LONGER FREE
- ❌ **Free Tier**: Removed (now $5/month minimum)
- ✅ **SQLite Support**: With add-ons
- 🌐 **URL**: yourapp.herokuapp.com

**Not free anymore**

---

## 📊 Comparison Table

| Platform | Free Hours | SQLite | Persistent Storage | No Sleep | Auto-Deploy | Best For |
|----------|-----------|--------|-------------------|----------|-------------|----------|
| **Railway** ⭐ | ~500hrs | ✅ | ✅ Built-in | ✅ | ✅ | **Best Overall** |
| **Fly.io** ⭐ | Always | ✅ | ✅ 3GB | ✅ | ✅ | **Best Performance** |
| **Render** | 750hrs | ✅ | ✅ 1GB | ❌ | ✅ | **Current (Good)** |
| **Koyeb** | Always | ✅ | ✅ 2GB | ✅ | ✅ | **Good Alternative** |
| **Cyclic** | Always | ⚠️ | ⚠️ S3 | ✅ | ✅ | **Not Ideal** |
| **Glitch** | Always | ❌ | ❌ | ❌ | ✅ | **Not Suitable** |

---

## 🎯 My Recommendations

### **Option 1: Railway.app** (BEST CHOICE)
**Why?**
- ✅ No sleep (better than Render)
- ✅ Built-in persistent volumes
- ✅ Easier setup than Fly.io
- ✅ $5 free credit/month
- ✅ Better performance

**Migration from Render**:
1. Export database from Render
2. Deploy to Railway
3. Import database
4. Update frontend API URL
5. Done in 10 minutes!

---

### **Option 2: Fly.io** (BEST PERFORMANCE)
**Why?**
- ✅ Best performance globally
- ✅ No sleep/cold starts
- ✅ 3GB storage (most generous)
- ✅ Edge network
- ⚠️ Requires CLI setup

**Best for**: Production-ready apps

---

### **Option 3: Keep Render + Add Persistent Disk** (EASIEST)
**Why?**
- ✅ Already deployed
- ✅ Just add disk storage
- ✅ No migration needed
- ⚠️ Has sleep time

**Best for**: Quick fix, minimal changes

---

## 🚀 Quick Migration Guide

### Migrate to Railway (Recommended)

#### Step 1: Export Current Database
```bash
# In Render Shell
cp database.sqlite /tmp/backup.sqlite
# Download via Render dashboard
```

#### Step 2: Deploy to Railway
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select: `lyalmha-america-website` repo
4. Railway auto-detects Node.js
5. Set Root Directory: `backend`

#### Step 3: Add Environment Variables
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=dxnte5zpl
CLOUDINARY_API_KEY=717426112357948
CLOUDINARY_API_SECRET=n-mi1aj4VmPsOrA-2bRTvSPfIg0
DATABASE_PATH=/app/data/database.sqlite
```

#### Step 4: Add Persistent Volume
1. In Railway project → Settings
2. Volumes → New Volume
3. Mount Path: `/app/data`
4. Save

#### Step 5: Upload Database
1. Railway → Shell
2. Upload `backup.sqlite` to `/app/data/database.sqlite`

#### Step 6: Update Frontend
```env
# frontend/.env
VITE_API_URL=https://yourapp.up.railway.app
```

#### Step 7: Rebuild & Deploy
```bash
cd frontend
npm run build
# Upload to cPanel
```

**Done! No more sleep, better performance!** 🎉

---

## 💡 Best Setup for Your Project

### **Recommended Architecture**:

```
Frontend (cPanel)
    ↓
Backend (Railway.app) ← BEST CHOICE
    ↓
Database (SQLite on Railway Volume)
    ↓
Images (Cloudinary)
```

**Why Railway over Render?**
- ✅ No sleep time (always fast)
- ✅ Better performance
- ✅ Built-in volumes (easier)
- ✅ More reliable
- ✅ Same free tier value

---

## 📝 Quick Decision Guide

**Choose Railway if**: You want best free option (no sleep, easy setup)

**Choose Fly.io if**: You want best performance (production-ready)

**Keep Render if**: You don't want to migrate (just add persistent disk)

---

## 🆘 Need Help Migrating?

I can help you:
1. Export database from Render
2. Deploy to Railway/Fly.io
3. Configure persistent storage
4. Update frontend API URL
5. Test everything

Just let me know which platform you prefer!
