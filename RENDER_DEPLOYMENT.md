# Render.com Deployment Fix - Persistent Database

## Problem
Your database changes were being lost because Render's free tier has **ephemeral storage** - the filesystem resets on every restart (after 15 min inactivity or deployments).

## Solution: Add Persistent Disk

### Step 1: Add Persistent Disk to Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service: **lyalmha-america-api**
3. Click **"Disks"** in the left sidebar
4. Click **"Add Disk"** button
5. Configure the disk:
   ```
   Name: database-storage
   Mount Path: /opt/render/project/src/data
   Size: 1 GB (free tier limit)
   ```
6. Click **"Save"**

### Step 2: Add Environment Variable

1. In your Render service, go to **"Environment"** tab
2. Add new environment variable:
   ```
   Key: DATABASE_PATH
   Value: /opt/render/project/src/data/database.sqlite
   ```
3. Click **"Save Changes"**

### Step 3: Deploy Changes

1. Push the updated code to GitHub:
   ```bash
   git add .
   git commit -m "Add persistent database storage for Render"
   git push origin main
   ```

2. Render will automatically redeploy

### Step 4: Migrate Existing Data (If Needed)

If you have existing data in the old database, you need to migrate it:

1. Go to Render Dashboard → Your service → **Shell** tab
2. Run these commands:
   ```bash
   # Copy old database to persistent disk
   cp database.sqlite /opt/render/project/src/data/database.sqlite
   
   # Verify the copy
   ls -lh /opt/render/project/src/data/
   ```

3. Restart the service

## Verification

After deployment, test by:

1. Go to your admin panel on Vercel: `https://lyaymhaamerica.org/admin`
2. Add/edit any content (blog, event, project, etc.)
3. Wait 20 minutes (let Render service sleep and wake up)
4. Check if your changes are still there ✅

## Important Notes

- **Free Tier Limits**: 1 GB persistent disk (plenty for SQLite database)
- **Backup**: The database is now persistent, but still create regular backups
- **Local Development**: Still uses `./database.sqlite` in your local backend folder

## Alternative: Use PostgreSQL (Recommended for Production)

For better reliability, consider migrating to PostgreSQL:
- Render offers free PostgreSQL (512 MB, expires after 90 days)
- More robust for production use
- Better for concurrent writes

Would you like help migrating to PostgreSQL instead?
