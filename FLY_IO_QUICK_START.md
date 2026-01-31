# Fly.io Quick Setup Checklist

## ✅ Pre-Deployment Checklist

- [ ] Fly.io account created (https://fly.io)
- [ ] Credit card added (won't be charged on free tier)
- [ ] Flyctl CLI installed
- [ ] Logged in to Fly.io

---

## 🚀 Deployment Commands (Copy & Paste)

### 1. Install Flyctl (PowerShell as Admin)
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### 2. Login
```bash
flyctl auth login
```

### 3. Navigate to Backend
```bash
cd backend
```

### 4. Create App
```bash
flyctl launch --name lyalmha-america-api --region iad --no-deploy
```

### 5. Create Persistent Volume
```bash
flyctl volumes create data --size 1 --region iad
```

### 6. Set Environment Variables (One by One)
```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set JWT_SECRET=your-super-secret-jwt-key-change-this
flyctl secrets set CLOUDINARY_CLOUD_NAME=dxnte5zpl
flyctl secrets set CLOUDINARY_API_KEY=717426112357948
flyctl secrets set CLOUDINARY_API_SECRET=n-mi1aj4VmPsOrA-2bRTvSPfIg0
flyctl secrets set DATABASE_PATH=/data/database.sqlite
```

### 7. Deploy
```bash
flyctl deploy
```

### 8. Check Status
```bash
flyctl status
flyctl info
```

---

## 🔧 Post-Deployment

### Update Frontend API URL

**Option A: Update .env**
```bash
cd ../frontend
```

Edit `.env`:
```env
VITE_API_URL=https://lyalmha-america-api.fly.dev
```

**Option B: Update config/api.js**

Edit `frontend/src/config/api.js`:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'https://lyalmha-america-api.fly.dev'
```

### Rebuild Frontend
```bash
npm run build
```

### Upload to cPanel
Upload `dist` folder contents to `public_html`

---

## 🧪 Testing

### Test API
Visit: https://lyalmha-america-api.fly.dev

Should see:
```json
{
  "message": "Welcome to Lyalmha America API",
  "status": "Server is running"
}
```

### Test Admin Panel
1. Visit: https://lyaymhaamerica.org/admin
2. Login
3. Add/edit content
4. Verify changes persist

---

## 📊 Useful Commands

```bash
# View logs
flyctl logs

# SSH into container
flyctl ssh console

# Check database
flyctl ssh console
ls -lh /data/

# Restart app
flyctl apps restart

# View volumes
flyctl volumes list

# Backup database
flyctl ssh sftp get /data/database.sqlite ./backup.sqlite

# Scale (if needed)
flyctl scale memory 512
```

---

## 🎯 Auto-Deploy Setup (Optional)

### 1. Get Fly.io Token
```bash
flyctl auth token
```

### 2. Add to GitHub Secrets
1. Go to: https://github.com/aryal05/lyalmha-america-website/settings/secrets/actions
2. Click "New repository secret"
3. Name: `FLY_API_TOKEN`
4. Value: (paste token)
5. Click "Add secret"

### 3. Push to GitHub
```bash
git add .
git commit -m "Add Fly.io deployment"
git push origin main
```

Now every push auto-deploys! 🎉

---

## 🚨 Common Issues

### "No volumes found"
```bash
flyctl volumes create data --size 1 --region iad
```

### "Database permission denied"
```bash
flyctl ssh console
chmod 644 /data/database.sqlite
```

### "Port not responding"
Check `fly.toml` has `internal_port = 5000`

### CORS errors
Already configured in `server.js`

---

## 💰 Free Tier Limits

✅ 3 VMs (shared CPU)
✅ 256MB RAM per VM
✅ 3GB Persistent Storage
✅ 160GB Bandwidth/month
✅ No sleep time
✅ Always active

**Perfect for your project!**

---

## 📞 Support

- Fly.io Docs: https://fly.io/docs
- Community: https://community.fly.io
- Status: https://status.flyio.net

---

## ✨ Final Architecture

```
Frontend (cPanel)
  ↓ HTTPS
Backend (Fly.io) ← No sleep, always fast!
  ↓
Database (Persistent Volume) ← Never resets!
  ↓
Images (Cloudinary)
```

**Your admin updates will persist forever!** 🎉
