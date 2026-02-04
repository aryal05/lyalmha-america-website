# 🚀 Quick Start - Deploy to cPanel in 10 Steps

## Step 1: Get Supabase Connection String
```
Supabase Dashboard → Settings → Database → Connection String (URI)
Copy: postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## Step 2: Login to cPanel
```
URL: https://yourdomain.com:2083
Enter username and password
```

## Step 3: Open File Manager
```
cPanel Dashboard → File Manager
```

## Step 4: Create Backend Folder
```
Navigate to: /home/username/
Click: New Folder
Name: backend
```

## Step 5: Upload Files
```
Open backend folder
Click: Upload
Select these files:
  - routes/ (folder)
  - config/ (folder)
  - middleware/ (folder)
  - utils/ (folder)
  - server-cpanel.js
  - database.js
  - package.json
  - .htaccess
```

## Step 6: Rename Server File
```
Find: server-cpanel.js
Right-click → Rename → server.js
```

## Step 7: Setup Node.js App
```
cPanel Dashboard → Setup Node.js App → Create Application

Settings:
  Node.js version: 18.x
  Application mode: Production
  Application root: backend
  Application URL: yourdomain.com/api (or api.yourdomain.com)
  Startup file: server.js

Click: Create
```

## Step 8: Add Environment Variables
```
In Node.js App page, add these variables:

DATABASE_URL = your_supabase_connection_string
NODE_ENV = production
JWT_SECRET = your_random_secret_string
CLOUDINARY_CLOUD_NAME = your_cloudinary_name (if using)
CLOUDINARY_API_KEY = your_cloudinary_key (if using)
CLOUDINARY_API_SECRET = your_cloudinary_secret (if using)

Click: Save
```

## Step 9: Install & Start
```
Click: Run NPM Install (wait 2-3 minutes)
Click: Start App
Wait for status: Running
```

## Step 10: Test Your API
```
Open browser:
https://yourdomain.com/api

Should see:
{
  "message": "Welcome to Lyalmha America API",
  "status": "Server is running on cPanel",
  "version": "2.0.0"
}

✅ SUCCESS! Your backend is live!
```

---

## Update Frontend

```bash
# Edit frontend/.env
VITE_API_URL=https://yourdomain.com/api

# Redeploy to Vercel
git add .
git commit -m "Update API URL"
git push
```

---

## Common Issues & Quick Fixes

### ❌ App won't start
```
Check: Node.js App logs
Verify: DATABASE_URL is correct
Ensure: server.js exists in backend folder
```

### ❌ Database connection error
```
Check: Supabase connection string
Verify: Password is correct (no [brackets])
Test: Connection in Supabase dashboard
```

### ❌ 404 on API routes
```
Check: Application URL setting
Verify: .htaccess uploaded
Restart: Application
```

### ❌ Module not found
```
Run: NPM Install again
Check: package.json uploaded
Verify: Node.js version 18.x or higher
```

---

## 📞 Need More Help?

See detailed guide: **CPANEL-DEPLOYMENT-GUIDE.md**

See checklist: **DEPLOYMENT-CHECKLIST.md**

---

**Total Time: 15-20 minutes** ⏱️

**Difficulty: Easy** ⭐⭐☆☆☆
