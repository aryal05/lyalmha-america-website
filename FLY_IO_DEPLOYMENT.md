# Fly.io Deployment Guide - Complete Setup

## 📋 Prerequisites

1. **Fly.io Account**: Sign up at https://fly.io
2. **Credit Card**: Required (but won't be charged on free tier)
3. **Flyctl CLI**: Command-line tool

---

## 🚀 Step-by-Step Deployment

### Step 1: Install Fly CLI

**Windows (PowerShell as Administrator)**:
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Verify Installation**:
```bash
flyctl version
```

---

### Step 2: Login to Fly.io

```bash
flyctl auth login
```

This opens browser for authentication.

---

### Step 3: Prepare Backend for Fly.io

Navigate to backend folder:
```bash
cd backend
```

---

### Step 4: Create Fly.io App

```bash
flyctl launch
```

**Answer the prompts**:
- App Name: `lyalmha-america-api` (or your choice)
- Region: Choose closest to USA (e.g., `iad` - Virginia)
- PostgreSQL: **No** (we're using SQLite)
- Redis: **No**
- Deploy now: **No** (we need to configure first)

This creates `fly.toml` configuration file.

---

### Step 5: Create Persistent Volume for Database

```bash
flyctl volumes create data --size 1 --region iad
```

**Note**: Replace `iad` with your chosen region.

This creates 1GB persistent storage for SQLite database.

---

### Step 6: Set Environment Variables

```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set JWT_SECRET=your-super-secret-jwt-key-change-this
flyctl secrets set CLOUDINARY_CLOUD_NAME=dxnte5zpl
flyctl secrets set CLOUDINARY_API_KEY=717426112357948
flyctl secrets set CLOUDINARY_API_SECRET=n-mi1aj4VmPsOrA-2bRTvSPfIg0
flyctl secrets set DATABASE_PATH=/data/database.sqlite
```

---

### Step 7: Update Database Path

Your database.js already supports `DATABASE_PATH` environment variable, so no code changes needed!

---

### Step 8: Deploy to Fly.io

```bash
flyctl deploy
```

Wait 2-3 minutes for deployment.

---

### Step 9: Check Deployment Status

```bash
flyctl status
```

Get your app URL:
```bash
flyctl info
```

Your API will be at: `https://lyalmha-america-api.fly.dev`

---

### Step 10: Verify API is Working

Visit: `https://lyalmha-america-api.fly.dev`

Should see:
```json
{
  "message": "Welcome to Lyalmha America API",
  "status": "Server is running"
}
```

---

### Step 11: Initialize Database

The database will be created automatically on first run. To verify:

```bash
flyctl ssh console
```

Inside the container:
```bash
ls -lh /data/
```

You should see `database.sqlite` file.

Exit: `exit`

---

### Step 12: Update Frontend API URL

Update `frontend/.env`:
```env
VITE_API_URL=https://lyalmha-america-api.fly.dev
```

Or update `frontend/src/config/api.js`:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'https://lyalmha-america-api.fly.dev'
```

---

### Step 13: Rebuild and Deploy Frontend

```bash
cd ../frontend
npm run build
```

Upload `dist` folder to cPanel (as before).

---

### Step 14: Test Everything

1. Visit: `https://lyaymhaamerica.org/admin`
2. Login with admin credentials
3. Add/edit content
4. Verify changes persist
5. Wait 1 hour and check again ✅

---

## 📁 Configuration Files Created

Fly.io creates these files automatically, but here's what they should contain:

### `backend/fly.toml`
```toml
app = "lyalmha-america-api"
primary_region = "iad"

[build]

[http_service]
  internal_port = 5000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[mounts]
  source = "data"
  destination = "/data"

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

---

## 🔧 Useful Fly.io Commands

### View Logs
```bash
flyctl logs
```

### SSH into Container
```bash
flyctl ssh console
```

### Check App Status
```bash
flyctl status
```

### Scale App (if needed)
```bash
flyctl scale count 1
```

### Restart App
```bash
flyctl apps restart lyalmha-america-api
```

### View Volumes
```bash
flyctl volumes list
```

### Backup Database
```bash
flyctl ssh sftp get /data/database.sqlite ./backup.sqlite
```

### Restore Database
```bash
flyctl ssh sftp shell
put backup.sqlite /data/database.sqlite
```

---

## 🎯 Advantages of Fly.io

✅ **No Sleep**: Always active (unlike Render)
✅ **Fast**: Global edge network
✅ **Persistent Storage**: 3GB free
✅ **Better Performance**: Faster than Render
✅ **Auto-Deploy**: Can connect to GitHub
✅ **Free Tier**: 3 VMs, 3GB storage

---

## 🔄 Auto-Deploy from GitHub (Optional)

### Step 1: Create GitHub Action

Create `.github/workflows/fly-deploy.yml`:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    name: Deploy Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: superfly/flyctl-actions/setup-flyctl@master
      
      - run: flyctl deploy --remote-only
        working-directory: ./backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Step 2: Get Fly.io API Token

```bash
flyctl auth token
```

### Step 3: Add to GitHub Secrets

1. Go to GitHub repo → Settings → Secrets
2. Add new secret:
   - Name: `FLY_API_TOKEN`
   - Value: (paste token from above)

Now every push to `main` auto-deploys backend!

---

## 🚨 Troubleshooting

### Issue: "No volumes found"
**Solution**:
```bash
flyctl volumes create data --size 1 --region iad
```

### Issue: "Port 5000 not responding"
**Solution**: Check `fly.toml` has correct `internal_port = 5000`

### Issue: "Database file not found"
**Solution**: 
```bash
flyctl ssh console
mkdir -p /data
touch /data/database.sqlite
chmod 644 /data/database.sqlite
```

### Issue: "Out of memory"
**Solution**: Increase memory in `fly.toml`:
```toml
[[vm]]
  memory_mb = 512
```

### Issue: CORS errors
**Solution**: Already configured in `server.js`, but verify:
```javascript
app.use(cors({
  origin: ['https://lyaymhaamerica.org'],
  credentials: true
}))
```

---

## 💰 Free Tier Limits

- **3 VMs** (shared CPU)
- **256MB RAM** per VM
- **3GB Persistent Storage**
- **160GB Bandwidth/month**
- **Always Active** (no sleep)

**Perfect for your project!**

---

## 📊 Migration Checklist

- [ ] Install Flyctl CLI
- [ ] Login to Fly.io
- [ ] Create app: `flyctl launch`
- [ ] Create volume: `flyctl volumes create data`
- [ ] Set environment variables
- [ ] Update `fly.toml` with volume mount
- [ ] Deploy: `flyctl deploy`
- [ ] Verify API is working
- [ ] Update frontend API URL
- [ ] Rebuild and upload frontend
- [ ] Test admin panel
- [ ] Setup auto-deploy (optional)

---

## 🎉 After Deployment

Your setup will be:
```
Frontend: https://lyaymhaamerica.org (cPanel)
    ↓
Backend: https://lyalmha-america-api.fly.dev (Fly.io)
    ↓
Database: /data/database.sqlite (Persistent Volume)
    ↓
Images: Cloudinary
```

**Benefits**:
- ✅ No sleep time
- ✅ Fast response
- ✅ Persistent database
- ✅ Better performance than Render
- ✅ Free forever

---

## 🆘 Need Help?

If you encounter any issues during deployment, let me know at which step!
