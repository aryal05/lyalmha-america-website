# 🚀 COMPLETE MIGRATION: Database + Images to Supabase

## Step 1: Get Supabase Credentials ⚙️

1. Go to your Supabase dashboard
2. Click **Settings** → **Project Settings**
3. Go to **Database**
4. Copy the **Connection String** (PostgreSQL)
5. Also copy: **Project ID**, **Project URL**, **Anon Key**

## Step 2: Create Storage Bucket 🪣

In Supabase:
1. Click **Storage** in left sidebar
2. Click **Create a new bucket**
3. Name it: `uploads`
4. Make it **Public** (allow public access)
5. Click Create

## Step 3: Create Database Tables 📊

1. Click **SQL Editor** in Supabase
2. Click **New Query**
3. Copy entire contents of `supabase-schema.sql`
4. Paste in SQL editor
5. Click **Run** (▶️)

Wait for "Success" message!

## Step 4: Update Your .env File 🔐

Open `backend/.env` and replace:

```env
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-ID].supabase.co:5432/postgres?password=[YOUR-PASSWORD]
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=eyJhbGc....(your anon key)
```

**Where to find:**
- DATABASE_URL → Settings → Database → Connection string (PostgreSQL)
- SUPABASE_URL → Settings → Project Settings → Project URL
- SUPABASE_ANON_KEY → Settings → API → anon key

## Step 5: Install Dependencies 📦

```bash
cd backend
npm install
```

## Step 6: Run Complete Migration 🎯

```bash
node migrate-complete.js
```

This will:
✅ Migrate all database records
✅ Upload all images from `uploads/` folder to Supabase Storage
✅ Update image URLs in database

Wait for completion message!

## Step 7: Verify Migration ✅

### Check Database:
1. Supabase → Table Editor
2. Click each table to verify data

### Check Images:
1. Supabase → Storage → uploads bucket
2. Should see: banners/, blogs/, gallery/, news/, projects/, activities/

## Step 8: Deploy to Vercel 🚀

```bash
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel deploy
```

---

## 🆘 Troubleshooting

**"Connection refused"?**
- Check DATABASE_URL is correct
- Make sure it's the PostgreSQL connection string

**"Storage bucket not found"?**
- Create the `uploads` bucket first (Step 2)
- Make sure it's PUBLIC

**"Images not uploading"?**
- Check SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Make sure uploads/ folder exists with images

**"No data migrated"?**
- Check database.sqlite file exists in backend/
- Check DATABASE_URL connection works

---

## 📝 Quick Reference

| What | Where |
|------|-------|
| Database | Supabase → Database |
| Tables | Supabase → Table Editor |
| Images | Supabase → Storage → uploads |
| Connection | Supabase → Settings → Database |
| Keys | Supabase → Settings → API |

**Your complete migration takes ~5 minutes! Everything is automated.** 🎉
