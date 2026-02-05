# Complete Supabase Setup Guide

Your backend has been updated to use **Supabase PostgreSQL only** (SQLite removed). Follow these steps to complete the setup.

## ✅ What Was Changed

1. **Removed SQLite completely** from `database.js` [cite:18]
2. **Removed SQLite dependencies** from `package.json` (sqlite, sqlite3) [cite:20]
3. **Database.js now requires DATABASE_URL** - No fallback to SQLite
4. **Updated CORS** for your Vercel deployments
5. **Created serverless function entry point** for Vercel

Commits:
- [Remove SQLite, use Supabase only](https://github.com/aryal05/lyalmha-america-website/commit/036d73af374cf7abb44ca2b74db641fdd827f1f7)
- [Remove SQLite dependencies](https://github.com/aryal05/lyalmha-america-website/commit/0183a2c77af3986030303b5d8283adb38cb1f9fe)

## 🚀 Setup Steps

### Step 1: Create Database Tables in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy the entire content from `backend/supabase-schema.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. You should see: "Success. No rows returned"

### Step 2: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should see all these tables:
   - ✅ users
   - ✅ blogs
   - ✅ team_members
   - ✅ events
   - ✅ event_images
   - ✅ supporters
   - ✅ banners
   - ✅ site_settings
   - ✅ projects
   - ✅ project_team
   - ✅ activities
   - ✅ testimonials
   - ✅ news
   - ✅ gallery
   - ✅ culture_festivals
   - ✅ culture_traditions
   - ✅ contact_messages
   - ✅ event_rsvps

### Step 3: Get Your Database Connection String

1. In Supabase, go to **Project Settings** (gear icon bottom left)
2. Click **Database** in the settings menu
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string that looks like:
   ```
   postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
6. **Important:** Replace `[YOUR-PASSWORD]` with your actual database password

### Step 4: Add DATABASE_URL to Vercel Backend

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your **backend project** (`lyalmha-america-website-wzb9`)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** Your Supabase connection string from Step 3
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**

### Step 5: Redeploy Backend

**Option A: Automatic (Recommended)**
```bash
cd backend
git add .
git commit -m "Update to use Supabase"
git push
```
Vercel will automatically redeploy.

**Option B: Manual**
1. Go to Vercel Dashboard → Your backend project
2. Go to **Deployments** tab
3. Click the **⋮** (three dots) on the latest deployment
4. Click **Redeploy**

### Step 6: Verify Backend is Working

Wait ~2 minutes for deployment, then test:

```bash
# Test API health
curl https://lyalmha-america-website-wzb9.vercel.app/

# Should return:
{
  "message": "Welcome to Lyalmha America API",
  "status": "Server is running",
  "version": "2.0.0"
}
```

### Step 7: Check Logs (If Issues)

1. Vercel Dashboard → Backend project → Deployments
2. Click latest deployment
3. Click **View Function Logs**
4. Look for:
   - ✅ "Connected to Supabase PostgreSQL"
   - ❌ Any database connection errors

## 🎯 Frontend Setup

Your frontend environment variable should already be set:
```
VITE_API_URL=https://lyalmha-america-website-wzb9.vercel.app/api
```

After backend redeploys successfully:
1. Go to Vercel → Frontend project (`lyalmha-america-website-theta`)
2. Go to Deployments → Latest deployment → **Redeploy**
3. Visit: https://lyalmha-america-website-theta.vercel.app/
4. Check browser console (F12) - NO CORS errors! ✅

## 📝 Database Schema Reference

Your complete database schema is in: `backend/supabase-schema.sql`

All tables use PostgreSQL-specific features:
- `BIGSERIAL` for auto-incrementing IDs
- `TIMESTAMP` for date/time fields
- Foreign key constraints with `ON DELETE CASCADE`
- Proper indexing for performance

## 🔧 Local Development

### Option 1: Connect to Supabase (Recommended)

Create `backend/.env`:
```env
DATABASE_URL=your_supabase_connection_string
PORT=5000
NODE_ENV=development
```

### Option 2: Use Local PostgreSQL

If you want local database:
1. Install PostgreSQL locally
2. Create database: `createdb lyalmha_america`
3. Run schema: `psql lyalmha_america < backend/supabase-schema.sql`
4. Set DATABASE_URL: `postgresql://user:password@localhost:5432/lyalmha_america`

## ⚠️ Important Notes

### Authentication System

You're using **custom auth** with the `users` table, NOT Supabase Auth.
The `auth.users` table you see in Supabase is for Supabase's built-in auth (not used).

### Database Connection Pooling

The code now uses optimized connection pooling for Vercel serverless:
- Max 10 connections
- 30-second idle timeout
- 10-second connection timeout

This prevents connection exhaustion on serverless.

### Data Migration

If you have existing data in SQLite:
1. Use `backend/migrate-to-supabase.js` script
2. Export from SQLite, import to Supabase
3. Or manually recreate data in Supabase Table Editor

## 🐛 Troubleshooting

### Error: "DATABASE_URL is required"

- Make sure you added DATABASE_URL in Vercel environment variables
- Redeploy after adding environment variables

### Error: "Failed to connect to Supabase"

- Check connection string format
- Verify password is correct (no brackets)
- Ensure Supabase project is not paused (free tier pauses after 1 week inactivity)

### CORS Errors Still Appear

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Wait 2-3 minutes for Vercel edge cache to clear
- Check backend logs to ensure it's responding

### 500 Errors on API

- Check Vercel function logs
- Verify all tables exist in Supabase
- Test connection string locally first

### Tables Not Created

- Run the SQL schema again in Supabase SQL Editor
- Check for error messages in SQL Editor
- Make sure you're in the correct Supabase project

## ✅ Success Checklist

- [ ] Created all tables in Supabase
- [ ] Added DATABASE_URL to Vercel backend
- [ ] Backend redeploys successfully
- [ ] Backend responds to health check
- [ ] No CORS errors in browser console
- [ ] Frontend loads data from backend
- [ ] Logs show "Connected to Supabase PostgreSQL"

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**All done!** Your app is now running 100% on Supabase PostgreSQL with no SQLite. 🎉
