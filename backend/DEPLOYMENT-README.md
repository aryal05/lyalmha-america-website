# 📚 Deployment Files Guide

This folder contains everything you need to deploy your backend to cPanel.

## 📄 Files Created for Deployment

### 1. **server-cpanel.js**
- Modified server file optimized for cPanel
- Uses port 3000 (cPanel default)
- Listens on 0.0.0.0 (required for cPanel)
- CORS configured for all origins
- **Action:** Upload this and rename to `server.js` on cPanel

### 2. **.env.cpanel**
- Template for environment variables
- Contains all required variables with placeholders
- **Action:** Use this as reference when adding variables in cPanel

### 3. **CPANEL-DEPLOYMENT-GUIDE.md**
- Complete step-by-step deployment guide
- Includes screenshots descriptions
- Troubleshooting section
- **Action:** Follow this for detailed instructions

### 4. **DEPLOYMENT-CHECKLIST.md**
- Quick checklist format
- Track your progress
- Quick reference commands
- **Action:** Print or keep open while deploying

### 5. **QUICK-START.md**
- 10-step visual guide
- Fastest way to deploy
- Common issues & fixes
- **Action:** Use this if you want quick deployment

## 🎯 Which File Should I Use?

### If you're deploying for the first time:
→ Start with **CPANEL-DEPLOYMENT-GUIDE.md**

### If you want a quick reference:
→ Use **QUICK-START.md**

### If you want to track progress:
→ Use **DEPLOYMENT-CHECKLIST.md**

### If you need environment variables:
→ Check **.env.cpanel**

## 📋 Deployment Process Overview

```
1. Get Supabase connection string
   ↓
2. Login to cPanel
   ↓
3. Upload files to backend folder
   ↓
4. Setup Node.js App
   ↓
5. Add environment variables
   ↓
6. Install dependencies
   ↓
7. Start application
   ↓
8. Test API
   ↓
9. Update frontend
   ↓
10. Done! 🎉
```

## 🗂️ Files to Upload to cPanel

### Required Files:
- ✅ `routes/` folder
- ✅ `config/` folder
- ✅ `middleware/` folder
- ✅ `utils/` folder
- ✅ `server-cpanel.js` (rename to server.js)
- ✅ `database.js`
- ✅ `package.json`
- ✅ `.htaccess`

### Optional Files:
- `uploads/` (if you have existing images)

### Do NOT Upload:
- ❌ `node_modules/`
- ❌ `.env` files
- ❌ `.db` or `.sqlite` files
- ❌ Migration scripts
- ❌ Test files

## 🔑 Required Information

Before starting, have these ready:

1. **Supabase Connection String**
   - Get from: Supabase Dashboard → Settings → Database
   - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

2. **cPanel Login**
   - URL: `https://yourdomain.com:2083`
   - Username: Your cPanel username
   - Password: Your cPanel password

3. **Domain/Subdomain**
   - Option 1: `yourdomain.com/api`
   - Option 2: `api.yourdomain.com` (recommended)

4. **Cloudinary Credentials** (if using image uploads)
   - Cloud Name
   - API Key
   - API Secret

## ⏱️ Estimated Time

- **First-time deployment:** 20-30 minutes
- **Subsequent deployments:** 5-10 minutes

## 🆘 Getting Help

### If something goes wrong:

1. **Check the logs**
   - cPanel → Setup Node.js App → Logs section

2. **Common issues**
   - See "Troubleshooting" in CPANEL-DEPLOYMENT-GUIDE.md
   - See "Common Issues" in QUICK-START.md

3. **Verify checklist**
   - Use DEPLOYMENT-CHECKLIST.md to ensure all steps completed

## 📞 Support Resources

- **Detailed Guide:** CPANEL-DEPLOYMENT-GUIDE.md
- **Quick Reference:** QUICK-START.md
- **Progress Tracking:** DEPLOYMENT-CHECKLIST.md
- **Environment Setup:** .env.cpanel

## ✅ After Deployment

Once deployed successfully:

1. **Test your API:**
   ```
   https://yourdomain.com/api
   ```

2. **Update frontend .env:**
   ```
   VITE_API_URL=https://yourdomain.com/api
   ```

3. **Redeploy frontend** to Vercel

4. **Test everything:**
   - Admin login
   - Blog posts
   - Image uploads
   - All API endpoints

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ API URL returns welcome message
- ✅ `/api/blogs` returns blog data
- ✅ No errors in cPanel logs
- ✅ Frontend connects to backend
- ✅ Admin panel works
- ✅ HTTPS (SSL) is active

---

**Ready to deploy? Start with QUICK-START.md or CPANEL-DEPLOYMENT-GUIDE.md**

**Good luck! 🚀**
