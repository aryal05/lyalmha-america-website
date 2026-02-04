# 🚀 cPanel Deployment Guide - Lyalmha America Backend

## 📋 Prerequisites
- cPanel hosting account with Node.js support
- Supabase account with database created
- Domain or subdomain configured

---

## STEP 1: Get Supabase Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) → **Database**
4. Scroll to **Connection string** section
5. Select **URI** tab
6. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with your actual database password
8. Save this - you'll need it later!

---

## STEP 2: Prepare Files for Upload

### 2.1 Files to Upload to cPanel:
Upload these folders/files from your backend directory:
- ✅ `routes/` (entire folder)
- ✅ `config/` (entire folder)
- ✅ `middleware/` (entire folder)
- ✅ `utils/` (entire folder)
- ✅ `server-cpanel.js` (rename to `server.js` after upload)
- ✅ `database.js`
- ✅ `package.json`
- ✅ `.htaccess`

### 2.2 Files NOT to Upload:
- ❌ `node_modules/` (will install on server)
- ❌ `.env` (will create on server)
- ❌ `uploads/` (optional - only if you have existing images)
- ❌ All `.db` and `.sqlite` files
- ❌ Migration scripts

---

## STEP 3: Upload Files to cPanel

### Option A: Using File Manager (Easier)

1. **Login to cPanel**
   - Go to: `https://yourdomain.com:2083`
   - Enter your cPanel username and password

2. **Navigate to File Manager**
   - Find "File Manager" in cPanel dashboard
   - Click to open

3. **Create Backend Directory**
   - Navigate to your home directory (usually `/home/username/`)
   - Click "New Folder"
   - Name it: `backend` or `api`
   - Click "Create New Folder"

4. **Upload Files**
   - Open the `backend` folder you just created
   - Click "Upload" button
   - Select all files from Step 2.1
   - Wait for upload to complete
   - Click "Go Back to..." to return to File Manager

5. **Rename server file**
   - Find `server-cpanel.js`
   - Right-click → Rename
   - Change to: `server.js`

### Option B: Using FTP (Alternative)

1. **Get FTP Credentials**
   - In cPanel, find "FTP Accounts"
   - Use main cPanel account or create new FTP account

2. **Connect with FTP Client** (FileZilla, WinSCP, etc.)
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21

3. **Upload Files**
   - Navigate to `/home/username/backend/`
   - Upload all files from Step 2.1
   - Rename `server-cpanel.js` to `server.js`

---

## STEP 4: Setup Node.js Application in cPanel

1. **Find Node.js Selector**
   - In cPanel dashboard, search for "Setup Node.js App"
   - Click on it (usually under "Software" section)

2. **Create Application**
   - Click "Create Application" button

3. **Configure Application Settings:**

   **Node.js version:** Select latest (18.x or 20.x)
   
   **Application mode:** Production
   
   **Application root:** `backend` (or whatever you named the folder)
   
   **Application URL:** Choose one:
   - Option 1: `yourdomain.com/api` (subdirectory)
   - Option 2: `api.yourdomain.com` (subdomain - recommended)
   
   **Application startup file:** `server.js`
   
   **Passenger log file:** Leave default

4. **Click "Create"**

---

## STEP 5: Add Environment Variables

1. **In the Node.js App page**, scroll to "Environment Variables" section

2. **Add these variables one by one:**

   Click "Add Variable" for each:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - (Use your Supabase connection string from Step 1)

   **Variable 2:**
   - Name: `NODE_ENV`
   - Value: `production`

   **Variable 3:**
   - Name: `PORT`
   - Value: (Leave empty - cPanel assigns automatically)

   **Variable 4 (if using Cloudinary):**
   - Name: `CLOUDINARY_CLOUD_NAME`
   - Value: `your_cloudinary_cloud_name`

   **Variable 5 (if using Cloudinary):**
   - Name: `CLOUDINARY_API_KEY`
   - Value: `your_cloudinary_api_key`

   **Variable 6 (if using Cloudinary):**
   - Name: `CLOUDINARY_API_SECRET`
   - Value: `your_cloudinary_api_secret`

   **Variable 7 (for JWT):**
   - Name: `JWT_SECRET`
   - Value: `your_random_secret_string_here_make_it_long_and_random`

3. **Click "Save"** after adding all variables

---

## STEP 6: Install Dependencies

1. **In Node.js App page**, scroll to "Detected configuration files"

2. **Click "Run NPM Install"** button

3. **Wait** for installation to complete (may take 2-3 minutes)

4. **Check for errors** in the output

---

## STEP 7: Start the Application

1. **Click "Start App"** button (or "Restart" if already running)

2. **Wait** for status to show "Running"

3. **Note the URL** shown (e.g., `https://yourdomain.com/api`)

---

## STEP 8: Test Your API

1. **Open browser** and go to:
   ```
   https://yourdomain.com/api
   ```
   OR
   ```
   https://api.yourdomain.com
   ```

2. **You should see:**
   ```json
   {
     "message": "Welcome to Lyalmha America API",
     "status": "Server is running on cPanel",
     "version": "2.0.0"
   }
   ```

3. **Test a specific endpoint:**
   ```
   https://yourdomain.com/api/blogs
   ```

---

## STEP 9: Update Frontend .env

1. **Open your frontend project**

2. **Edit `.env` file:**
   ```env
   VITE_API_URL=https://yourdomain.com/api
   ```
   OR
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

3. **Rebuild and redeploy frontend** to Vercel

---

## STEP 10: Setup SSL (HTTPS)

1. **In cPanel**, find "SSL/TLS Status"

2. **Enable AutoSSL** for your domain/subdomain

3. **Wait** for certificate to be issued (5-10 minutes)

4. **Verify** your API works with `https://`

---

## 🔧 Troubleshooting

### Problem: App won't start

**Solution:**
1. Check logs in Node.js App page
2. Verify all environment variables are correct
3. Make sure `server.js` exists in application root
4. Check Node.js version compatibility

### Problem: Database connection error

**Solution:**
1. Verify DATABASE_URL is correct
2. Check Supabase password is correct
3. Ensure Supabase project is active
4. Test connection string in a PostgreSQL client

### Problem: 404 errors on API routes

**Solution:**
1. Check Application URL setting
2. Verify .htaccess file is uploaded
3. Make sure routes are correctly defined

### Problem: CORS errors

**Solution:**
1. Add your frontend domain to CORS whitelist in server.js
2. Restart the application

### Problem: Module not found errors

**Solution:**
1. Run "NPM Install" again
2. Check package.json is uploaded
3. Verify Node.js version supports ES modules

---

## 📝 Important Notes

1. **Application restarts** automatically if it crashes
2. **Logs** are available in the Node.js App page
3. **Updates**: Upload new files and click "Restart"
4. **Environment variables**: Changes require restart
5. **Port**: cPanel assigns port automatically, don't hardcode

---

## 🎯 Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Update frontend with new API URL
3. ✅ Test admin login functionality
4. ✅ Test image uploads (if using Cloudinary)
5. ✅ Monitor application logs for errors
6. ✅ Set up regular backups

---

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Check Node.js application logs
3. Verify Supabase connection
4. Contact your hosting provider for cPanel-specific issues

---

**Deployment Complete! 🎉**

Your backend is now live at: `https://yourdomain.com/api`
