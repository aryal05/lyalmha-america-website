# Quick cPanel Deployment - Step by Step

## 🚀 Fastest Way (Recommended)

### Frontend on cPanel + Backend on Render

#### Step 1: Build Frontend (2 minutes)
```bash
# Run the deployment script
deploy-cpanel.bat
```
This creates `frontend/cpanel-deploy.zip`

#### Step 2: Upload to cPanel (3 minutes)
1. Login to cPanel
2. Open **File Manager**
3. Go to `public_html`
4. Click **Upload**
5. Upload `cpanel-deploy.zip`
6. Right-click → **Extract**
7. Delete the zip file

#### Step 3: Done! ✅
Visit: `https://lyaymhaamerica.org`

---

## 🔧 Backend Setup (Already Done)

Your backend is on Render: `https://lyalmha-america-api.onrender.com`

**To fix database persistence:**
1. Go to Render Dashboard
2. Add Persistent Disk (see RENDER_DEPLOYMENT.md)
3. Add environment variable: `DATABASE_PATH=/opt/render/project/src/data/database.sqlite`

---

## 📋 Troubleshooting

### Frontend shows blank page
- Check browser console for errors
- Verify `.htaccess` file is uploaded
- Check if files are in correct folder

### API not working
- Check `frontend/.env` has correct `VITE_API_URL`
- Rebuild frontend after changing .env
- Verify Render backend is running

### Images not loading
- Check `public` folder files are uploaded
- Verify `logo.png` and `afternav.png` are in root

### Admin panel not working
- Clear browser cache
- Check API connection
- Verify Render backend has persistent disk

---

## 🎯 File Locations

### On cPanel:
```
public_html/
├── index.html
├── .htaccess
├── logo.png
├── afternav.png
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

### On Render:
```
Backend API running at:
https://lyalmha-america-api.onrender.com

Database stored at:
/opt/render/project/src/data/database.sqlite
```

---

## 🔄 Update Process

### To update frontend:
1. Make changes in code
2. Run `deploy-cpanel.bat`
3. Upload new `cpanel-deploy.zip` to cPanel
4. Extract (overwrite existing files)

### To update backend:
1. Make changes in code
2. Push to GitHub: `git push origin main`
3. Render auto-deploys (2-3 minutes)

---

## 📞 Support

If you need help:
1. Check CPANEL_DEPLOYMENT_GUIDE.md (detailed guide)
2. Check RENDER_DEPLOYMENT.md (backend persistence fix)
3. Check browser console for errors
4. Check Render logs for backend errors
