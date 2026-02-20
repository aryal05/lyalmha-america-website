# Complete cPanel Backend Deployment Guide

## PART 1: PREPARE BACKEND FOR UPLOAD

### Step 1: Create ZIP file
1. Go to `C:\Users\aryal\Desktop\Project-Culture\backend`
2. Select ALL files and folders in the backend directory
3. Right-click → Send to → Compressed (zipped) folder
4. Name it `backend.zip`

---

## PART 2: UPLOAD TO CPANEL

### Step 2: Login to cPanel
1. Go to your cPanel URL (e.g., `yourdomain.com/cpanel` or `yourdomain.com:2083`)
2. Enter your cPanel username and password
3. Click "Log in"

### Step 3: Create API Subdomain (Recommended)
1. In cPanel, find "Subdomains" icon
2. Click "Subdomains"
3. Create subdomain:
   - Subdomain: `api`
   - Domain: `yourdomain.com`
   - Document Root: `/public_html/api` (auto-filled)
4. Click "Create"
5. Your API will be at: `https://api.yourdomain.com`

### Step 4: Upload Backend Files
1. In cPanel, click "File Manager"
2. Navigate to `/public_html/api` (or wherever you want backend)
3. Click "Upload" button at the top
4. Select `backend.zip` file
5. Wait for upload to complete (100%)
6. Close upload window

### Step 5: Extract ZIP File
1. In File Manager, find `backend.zip`
2. Right-click on `backend.zip`
3. Click "Extract"
4. Click "Extract Files" button
5. Wait for extraction to complete
6. Delete `backend.zip` (optional, to save space)

---

## PART 3: SETUP NODE.JS APPLICATION

### Step 6: Setup Node.js App
1. In cPanel main page, find "Setup Node.js App"
2. Click "Setup Node.js App"
3. Click "Create Application" button
4. Fill in the form:

   **Node.js version:** Select `18.x` or higher (latest available)
   
   **Application mode:** `Production`
   
   **Application root:** `/home/yourusername/public_html/api`
   (Replace `yourusername` with your actual cPanel username)
   
   **Application URL:** `api.yourdomain.com`
   (Or leave blank if using main domain)
   
   **Application startup file:** `server.js`
   
   **Passenger log file:** Leave default

5. Click "Create" button

### Step 7: Install Dependencies
1. After app is created, you'll see the app details page
2. Scroll down to find "Run NPM Install" button
3. Click "Run NPM Install"
4. Wait 2-3 minutes for all packages to install
5. You'll see "Completed" when done

---

## PART 4: CONFIGURE ENVIRONMENT VARIABLES

### Step 8: Add Environment Variables
1. On the Node.js App page, scroll to "Environment variables" section
2. Click "Add Variable" for each of these:

   **Variable 1:**
   - Name: `NODE_ENV`
   - Value: `production`
   
   **Variable 2:**
   - Name: `PORT`
   - Value: Leave empty (cPanel auto-assigns)
   
   **Variable 3:**
   - Name: `CLOUDINARY_CLOUD_NAME`
   - Value: `your_cloudinary_cloud_name`
   
   **Variable 4:**
   - Name: `CLOUDINARY_API_KEY`
   - Value: `your_cloudinary_api_key`
   
   **Variable 5:**
   - Name: `CLOUDINARY_API_SECRET`
   - Value: `your_cloudinary_api_secret`
   
   **Variable 6:**
   - Name: `JWT_SECRET`
   - Value: `your_secret_key_here` (any random string)

3. Click "Save" after adding all variables

---

## PART 5: INITIALIZE DATABASE

### Step 9: Open Terminal
1. In cPanel, find "Terminal" icon
2. Click "Terminal"
3. A black terminal window will open

### Step 10: Navigate to Backend Directory
```bash
cd public_html/api
```

### Step 11: Run Database Migrations
```bash
node migrateProjects.js
```
Wait for "✅ Migration completed" message

### Step 12: Seed Database with Sample Data
```bash
node seedBiskaProject.js
```
Wait for "✅ Successfully seeded" message

### Step 13: (Optional) Copy Existing Database
If you have existing data in your local database:
1. In File Manager, upload your local `database.sqlite` file
2. Place it in `/public_html/api/` directory
3. Skip steps 11-12 above

---

## PART 6: START THE APPLICATION

### Step 14: Start Node.js App
1. Go back to "Setup Node.js App" in cPanel
2. Find your application in the list
3. Click "Start App" button (or "Restart App" if already running)
4. Wait for status to show "Running"

### Step 15: Test Backend API
1. Open browser
2. Go to: `https://api.yourdomain.com`
3. You should see JSON response:
```json
{
  "message": "Welcome to Lyalmha America API",
  "status": "Server is running",
  "version": "2.0.0"
}
```

---

## PART 7: CONNECT FRONTEND TO BACKEND

### Step 16: Update Frontend API URL
1. Open `frontend/src/config/api.js`
2. Change line 5 to:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com'
```
(Replace `api.yourdomain.com` with your actual API URL)

### Step 17: Update Frontend .env File
1. Open `frontend/.env`
2. Add or update:
```
VITE_API_URL=https://api.yourdomain.com
```

### Step 18: Commit and Push Changes
```bash
git add frontend/src/config/api.js frontend/.env
git commit -m "Update API URL to cPanel backend"
git push
```

### Step 19: Redeploy Frontend on Vercel
1. Go to Vercel dashboard
2. Your frontend will auto-deploy with new API URL
3. Wait 1-2 minutes for deployment

---

## PART 8: VERIFY EVERYTHING WORKS

### Step 20: Test Complete Setup
1. Go to your frontend: `https://lyalmha-america-website.vercel.app`
2. Check if data loads (events, team, banners, etc.)
3. Try admin login: `https://lyalmha-america-website.vercel.app/admin`
4. Test creating/editing content

---

## TROUBLESHOOTING

### If app won't start:
1. Check Node.js version (must be 18.x or higher)
2. Verify all environment variables are set
3. Check error logs in Node.js App interface

### If database errors:
1. Make sure migrations ran successfully
2. Check file permissions (755 for directories, 644 for files)
3. Verify database.sqlite file exists in app directory

### If images don't load:
1. Verify Cloudinary credentials are correct
2. Check environment variables are saved
3. Restart the app after adding variables

### If CORS errors:
1. Backend already has CORS configured for Vercel
2. If using custom domain, add it to CORS in `server.js`

---

## MAINTENANCE

### To view logs:
1. Go to "Setup Node.js App" in cPanel
2. Click on your app
3. Scroll to "Application Logs" section

### To restart app:
1. Go to "Setup Node.js App"
2. Click "Restart App" button

### To update code:
1. Upload new files via File Manager
2. Restart the app

---

## SUCCESS CHECKLIST

✅ Backend uploaded to cPanel
✅ Node.js app created and running
✅ Dependencies installed
✅ Environment variables set
✅ Database initialized
✅ Sample data seeded
✅ API responding at https://api.yourdomain.com
✅ Frontend updated with new API URL
✅ Frontend redeployed on Vercel
✅ Data loading on frontend
✅ Admin panel working

---

## YOUR FINAL URLS

- **Frontend:** https://lyalmha-america-website.vercel.app
- **Backend API:** https://api.yourdomain.com
- **Admin Panel:** https://lyalmha-america-website.vercel.app/admin
- **Admin Credentials:** username: `lag2020`, password: `LAG@am3rica2020!`

**⚠️ IMPORTANT: Change admin password immediately after first login!**

---

Need help? Check cPanel error logs or contact your hosting support.
