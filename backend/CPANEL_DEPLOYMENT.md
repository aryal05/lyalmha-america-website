# cPanel Deployment Instructions

## Step 1: Prepare Files
1. Make sure all files are in the backend folder
2. Create a ZIP file of the entire backend folder

## Step 2: Upload to cPanel
1. Login to your cPanel
2. Go to File Manager
3. Navigate to your domain's root directory (e.g., public_html/api or subdomain)
4. Upload the backend.zip file
5. Extract the ZIP file

## Step 3: Setup Node.js Application
1. In cPanel, find "Setup Node.js App"
2. Click "Create Application"
3. Fill in the details:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: /home/username/public_html/api (or your path)
   - Application URL: api.yourdomain.com (or subdomain)
   - Application startup file: server.js
4. Click "Create"

## Step 4: Install Dependencies
1. After creating the app, click "Run NPM Install"
2. Wait for dependencies to install

## Step 5: Environment Variables
1. In the Node.js App settings, add environment variables:
   - PORT: (cPanel will auto-assign)
   - NODE_ENV: production
   - CLOUDINARY_CLOUD_NAME: your_cloud_name
   - CLOUDINARY_API_KEY: your_api_key
   - CLOUDINARY_API_SECRET: your_api_secret
   - JWT_SECRET: your_jwt_secret

## Step 6: Initialize Database
1. Click "Open Terminal" in cPanel
2. Navigate to your app directory:
   cd /home/username/public_html/api
3. Run database initialization:
   node migrateProjects.js
   node seedBiskaProject.js

## Step 7: Start Application
1. In Node.js App settings, click "Start App"
2. Your API should now be running!

## Step 8: Update Frontend
Update frontend/src/config/api.js:
export const API_URL = 'https://api.yourdomain.com'

## Troubleshooting
- Check error logs in cPanel Node.js App interface
- Ensure Node.js version is 18.x or higher
- Verify all environment variables are set
- Check file permissions (755 for directories, 644 for files)

## Database Location
SQLite database will be stored at:
/home/username/public_html/api/database.sqlite

This persists between restarts!

.\deploy-to-cpanel.ps1

.\upload-ftp.ps1

