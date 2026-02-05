# Vercel Deployment - Fixed Configuration

I've fixed the CORS and serverless function configuration issues. Here's what you need to do to complete the deployment.

## ✅ What I Fixed

1. **CORS Configuration** - Added your wzb9 backend URL and wildcard pattern for all Vercel preview deployments
2. **Serverless Function Entry Point** - Created `backend/api/index.js` to properly export the Express app
3. **Vercel Configuration** - Updated `backend/vercel.json` to use the correct serverless function structure
4. **Environment Variables Documentation** - Updated `.env.example` with DATABASE_URL configuration

Commits:
- [Fix CORS configuration](https://github.com/aryal05/lyalmha-america-website/commit/034c434e89aa1f7ca302df7230513ba9ddcc322e)
- [Add serverless function entry point](https://github.com/aryal05/lyalmha-america-website/commit/16dd57b137972bcbbacf397839de773e75418e4d)
- [Update Vercel config](https://github.com/aryal05/lyalmha-america-website/commit/86cc6bf9f71b19bff2087a3be9fd20553adabff2)
- [Add DATABASE_URL to env example](https://github.com/aryal05/lyalmha-america-website/commit/d6059acfebd56ee58d49a21f054efa2d52e66f4f)

## 🚨 Critical: Database Setup Required

Your backend won't work on Vercel without a cloud database because SQLite doesn't persist on serverless functions. You have 3 options:

### Option 1: Vercel Postgres (Recommended - Easiest)

1. Go to your Vercel Dashboard
2. Select your **backend project** (`lyalmha-america-website-wzb9`)
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose the **Free Hobby plan**
6. Click **Connect to Project** → Select your backend project
7. Vercel will automatically add the `DATABASE_URL` environment variable
8. Run the SQL schema:
   ```bash
   # Download the schema from your backend/supabase-schema.sql
   # Or use the Vercel Postgres console to create tables
   ```
9. Redeploy your backend

### Option 2: Supabase (Free, Feature-Rich)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned (~2 minutes)
4. Go to **Project Settings** → **Database**
5. Copy the **Connection String** (URI format)
6. In Vercel, go to your backend project → **Settings** → **Environment Variables**
7. Add:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[HOST].supabase.co:5432/postgres
   ```
8. Run the SQL schema in Supabase SQL Editor:
   - Copy content from `backend/supabase-schema.sql`
   - Paste in Supabase SQL Editor and run
9. Redeploy your backend

### Option 3: Neon, PlanetScale, or Railway

Similar process - get the PostgreSQL connection string and add as `DATABASE_URL` in Vercel environment variables.

## 📋 Deployment Checklist

### Backend Project (lyalmha-america-website-wzb9.vercel.app)

- [x] Fixed CORS configuration
- [x] Created serverless function entry point
- [x] Updated Vercel config
- [ ] **Set up DATABASE_URL** (Choose Option 1 or 2 above)
- [ ] Add environment variables in Vercel:
  ```
  DATABASE_URL=your_postgres_connection_string
  NODE_ENV=production
  ```
- [ ] Create database tables (run SQL schema)
- [ ] **Redeploy backend** after setting environment variables

### Frontend Project (lyalmha-america-website-theta.vercel.app)

- [x] CORS issue should be fixed after backend redeploys
- [ ] Verify environment variable in Vercel:
  ```
  VITE_API_URL=https://lyalmha-america-website-wzb9.vercel.app/api
  ```
- [ ] **Redeploy frontend** after backend is working

## 🧪 Testing

1. After backend redeploy, test the API:
   ```bash
   curl https://lyalmha-america-website-wzb9.vercel.app/
   ```
   You should see:
   ```json
   {
     "message": "Welcome to Lyalmha America API",
     "status": "Server is running",
     "version": "2.0.0"
   }
   ```

2. Test a specific endpoint:
   ```bash
   curl https://lyalmha-america-website-wzb9.vercel.app/api/admin/events/upcoming
   ```

3. Check your frontend:
   - Visit https://lyalmha-america-website-theta.vercel.app/
   - Open browser console (F12)
   - You should see NO CORS errors
   - Data should load from backend

## 🐛 Troubleshooting

### Backend still returns 500 errors
- Check Vercel logs: Dashboard → Your backend project → Deployments → Click latest → View Function Logs
- Verify `DATABASE_URL` is set correctly
- Ensure database tables exist

### CORS errors still appear
- Wait 2-3 minutes after deployment for changes to propagate
- Hard refresh browser (Ctrl+Shift+R)
- Check backend is responding to requests

### Database connection fails
- Verify connection string format
- Check if database allows connections from Vercel IPs
- Test connection string locally first

## 📚 Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Documentation](https://supabase.com/docs)
- Your existing backend migration script: `backend/migrate-to-supabase.js`

## 🎯 Quick Start (If Using Vercel Postgres)

```bash
# 1. Set up Vercel Postgres (as described above)
# 2. Get the DATABASE_URL from Vercel
# 3. Redeploy backend
# 4. Check logs to verify database connection
# 5. Visit frontend to test
```

---

**Need Help?** Check the Vercel deployment logs or the backend console output for specific error messages.
