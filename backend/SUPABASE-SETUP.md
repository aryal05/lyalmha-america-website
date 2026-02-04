# FREE DATABASE SETUP WITH SUPABASE + VERCEL

## 🚀 QUICK SETUP (5 minutes)

### 1️⃣ Create FREE Supabase Account
- Go to: https://supabase.com
- Click "Sign Up"
- Use Google or GitHub (fastest)
- Create new project (name: lyalmha-culture or similar)
- Wait 2 minutes for setup
- Go to Settings → Database → Connection String
- Copy the CONNECTION STRING (PostgreSQL)

### 2️⃣ Add to Your .env File
```
# In backend/.env
DATABASE_URL=postgresql://[your-supabase-connection-string]
```

### 3️⃣ Create PostgreSQL Tables in Supabase
- Go to Supabase Dashboard
- Click "SQL Editor" → "New Query"
- Run this SQL (from supabase-schema.sql):

Copy the full schema from `backend/supabase-schema.sql` and paste into Supabase SQL editor

### 4️⃣ Migrate Your SQLite Data
```bash
cd backend
npm install pg  # Add PostgreSQL client
node migrate-to-supabase.js
```

### 5️⃣ Update Your Backend
Replace `backend/database.js` with `database-new.js`:
```bash
cd backend
mv database.js database.js.backup
mv database-new.js database.js
npm install pg  # Already installed from step 4
```

### 6️⃣ Deploy to Vercel
```bash
vercel env add DATABASE_URL  # Add your Supabase connection string
vercel deploy
```

---

## 📋 What's FREE in Supabase Tier?
✅ 500MB storage (plenty for your data)
✅ Unlimited rows
✅ Up to 50 concurrent connections
✅ Full PostgreSQL features
✅ No credit card needed (really!)

---

## 🔍 Verify Migration Worked
After running `node migrate-to-supabase.js`, check:
- Supabase Dashboard → Table Editor
- Should see all tables: users, blogs, events, etc.
- Should see all your data!

---

## 🆘 Common Issues

**"Connection refused"?**
- Check your DATABASE_URL is correct
- Make sure it's the PostgreSQL version (not JS client)

**"Table already exists"?**
- That's OK! The migration script skips existing data

**"Cannot find module 'pg'"?**
- Run: `npm install pg`

---

## ✅ When You're Ready for Vercel
1. Delete sqlite database file (not needed anymore)
2. Add DATABASE_URL to Vercel environment
3. Deploy!

Questions? The migration is automatic - just copy your connection string!
