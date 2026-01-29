# Complete cPanel Deployment Guide

## ⚠️ Important Prerequisites

### Check Your cPanel Node.js Support
1. Login to cPanel
2. Search for "Setup Node.js App" or "Node.js Selector"
3. **If NOT available**: Your hosting doesn't support Node.js - you can only deploy frontend
4. **If available**: Check Node.js version (need v18+ for this project)

### Check Passenger Version (Critical for Backend)
Your backend uses ES modules (`"type": "module"`). Most cPanel servers use **Passenger 5.x** which doesn't support ES modules.

**Solution**: You'll need to convert backend to CommonJS OR use Render for backend.

---

## 🎯 Recommended Approach

### Option 1: Frontend on cPanel + Backend on Render (RECOMMENDED)
- ✅ Easy setup
- ✅ No compatibility issues
- ✅ Free backend hosting
- ✅ Auto-deployments from GitHub

### Option 2: Both on cPanel (If Node.js v18+ Available)
- ⚠️ Requires backend conversion to CommonJS
- ⚠️ Manual deployments
- ⚠️ More complex setup

---

## 📦 Option 1: Frontend on cPanel + Backend on Render

### Step 1: Build Frontend Locally

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with static files.

### Step 2: Upload Frontend to cPanel

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to**: `public_html` (for main domain) or `public_html/subdomain` (for subdomain)
4. **Upload all files from `frontend/dist` folder**:
   - index.html
   - assets/
   - logo.png
   - afternav.png
   - etc.

### Step 3: Configure Domain

1. In cPanel, go to **"Domains"**
2. Point your domain to the folder where you uploaded files
3. Example:
   - Domain: `lyaymhaamerica.org`
   - Document Root: `/public_html`

### Step 4: Add .htaccess for React Router

Create `.htaccess` file in your upload folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Step 5: Keep Backend on Render

Your backend is already on Render: `https://lyalmha-america-api.onrender.com`

**Add Persistent Disk** (from previous instructions) to save database permanently.

### Step 6: Update Frontend API URL

Your frontend already points to Render backend - no changes needed!

---

## 📦 Option 2: Both Frontend + Backend on cPanel

### Prerequisites Check

1. **Node.js Version**: Must be v18+
2. **Passenger Version**: Check if it supports ES modules
3. **Database**: SQLite or MySQL available

### Part A: Deploy Backend

#### Step 1: Convert Backend to CommonJS (Required for cPanel)

You need to convert from ES modules to CommonJS because cPanel Passenger doesn't support ES modules.

**Changes needed**:

1. **Remove from package.json**:
```json
"type": "module"
```

2. **Update all imports** in backend files:
```javascript
// FROM (ES modules):
import express from 'express'
export default router

// TO (CommonJS):
const express = require('express')
module.exports = router
```

3. **Update __dirname**:
```javascript
// FROM:
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// TO:
const __dirname = __dirname // Already available in CommonJS
```

#### Step 2: Create Backend Subdomain

1. In cPanel → **Subdomains**
2. Create: `api.lyaymhaamerica.org`
3. Document Root: `/public_html/api`

#### Step 3: Setup Node.js App in cPanel

1. Go to **"Setup Node.js App"**
2. Click **"Create Application"**
3. Configure:
   ```
   Node.js version: 18.x or higher
   Application mode: Production
   Application root: api
   Application URL: api.lyaymhaamerica.org
   Application startup file: server.js
   ```
4. Click **"Create"**

#### Step 4: Upload Backend Files

1. **Open File Manager** → Navigate to `/public_html/api`
2. **Upload these files**:
   - server.js
   - package.json
   - database.js
   - routes/ (entire folder)
   - .env (with your credentials)

3. **DO NOT upload**:
   - node_modules/
   - database.sqlite (will be created automatically)

#### Step 5: Install Dependencies

1. In **"Setup Node.js App"**, find your app
2. Click **"Run NPM Install"** button
3. Wait for installation to complete

#### Step 6: Add Environment Variables

In the Node.js App settings, add:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=dxnte5zpl
CLOUDINARY_API_KEY=717426112357948
CLOUDINARY_API_SECRET=n-mi1aj4VmPsOrA-2bRTvSPfIg0
DATABASE_PATH=/home/yourusername/public_html/api/database.sqlite
```

#### Step 7: Start Application

Click **"Restart"** button in Node.js App settings.

### Part B: Deploy Frontend

Follow **Option 1 - Step 2 to Step 4** above.

#### Update API URL

Before building frontend, update `frontend/.env`:
```
VITE_API_URL=https://api.lyaymhaamerica.org
```

Then build and upload.

---

## 🔧 Post-Deployment Steps

### 1. Test Backend API

Visit: `https://api.lyaymhaamerica.org`

Should see:
```json
{
  "message": "Welcome to Lyalmha America API",
  "status": "Server is running"
}
```

### 2. Test Frontend

Visit: `https://lyaymhaamerica.org`

Should load homepage properly.

### 3. Test Admin Panel

Visit: `https://lyaymhaamerica.org/admin`

Login and test CRUD operations.

### 4. Setup SSL Certificate

1. In cPanel → **SSL/TLS Status**
2. Enable **AutoSSL** for your domain and subdomain
3. Wait 5-10 minutes for certificate installation

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module" errors
**Solution**: Run NPM install again in cPanel Node.js App settings

### Issue 2: Database permission errors
**Solution**: 
```bash
# In cPanel Terminal
chmod 755 /home/yourusername/public_html/api
chmod 644 /home/yourusername/public_html/api/database.sqlite
```

### Issue 3: 404 errors on React routes
**Solution**: Make sure `.htaccess` file is uploaded and mod_rewrite is enabled

### Issue 4: CORS errors
**Solution**: Update `backend/server.js` CORS config:
```javascript
app.use(cors({
  origin: [
    'https://lyaymhaamerica.org',
    'https://www.lyaymhaamerica.org'
  ],
  credentials: true
}))
```

### Issue 5: Passenger doesn't support ES modules
**Solution**: Either:
- Convert backend to CommonJS (complex)
- Keep backend on Render (recommended)

---

## 📊 Comparison: cPanel vs Render for Backend

| Feature | cPanel | Render |
|---------|--------|--------|
| Cost | Included with hosting | Free (750hrs/month) |
| Setup Complexity | High | Low |
| ES Module Support | ❌ (Passenger 5.x) | ✅ |
| Auto-Deploy | ❌ Manual | ✅ GitHub |
| Database Persistence | ✅ | ✅ (with disk) |
| Performance | Depends on hosting | Good |
| Maintenance | Manual updates | Auto-updates |

---

## 🎯 My Recommendation

**Use Hybrid Approach**:
- ✅ **Frontend on cPanel** (your domain)
- ✅ **Backend on Render** (already working)
- ✅ **Add Persistent Disk** to Render (from previous guide)

**Why?**
1. No backend conversion needed
2. Free backend hosting
3. Auto-deployments from GitHub
4. Better ES module support
5. Easier maintenance

---

## 📝 Quick Deployment Checklist

### For Frontend on cPanel:
- [ ] Build frontend: `npm run build`
- [ ] Upload `dist` folder contents to `public_html`
- [ ] Create `.htaccess` file
- [ ] Enable SSL certificate
- [ ] Test website

### For Backend on Render:
- [ ] Add Persistent Disk (1GB)
- [ ] Add `DATABASE_PATH` environment variable
- [ ] Wait for auto-deployment
- [ ] Test API endpoints
- [ ] Verify database persistence

---

## 🆘 Need Help?

If you want to proceed with **Option 2** (both on cPanel), I can help you:
1. Convert backend to CommonJS
2. Create deployment scripts
3. Setup cPanel configuration

Just let me know which option you prefer!
