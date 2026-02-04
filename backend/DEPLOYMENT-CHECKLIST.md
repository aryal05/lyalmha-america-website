# ✅ cPanel Deployment Checklist

## Before You Start
- [ ] Supabase database created
- [ ] Supabase connection string copied
- [ ] cPanel login credentials ready
- [ ] Domain/subdomain decided

## Files to Upload
- [ ] routes/ folder
- [ ] config/ folder
- [ ] middleware/ folder
- [ ] utils/ folder
- [ ] server-cpanel.js (rename to server.js)
- [ ] database.js
- [ ] package.json
- [ ] .htaccess

## cPanel Setup Steps
- [ ] Login to cPanel
- [ ] Create backend folder in File Manager
- [ ] Upload all files
- [ ] Rename server-cpanel.js to server.js
- [ ] Open "Setup Node.js App"
- [ ] Create new application
- [ ] Set Node.js version (18.x or 20.x)
- [ ] Set application root: backend
- [ ] Set startup file: server.js
- [ ] Add environment variables:
  - [ ] DATABASE_URL
  - [ ] NODE_ENV=production
  - [ ] CLOUDINARY_CLOUD_NAME (if needed)
  - [ ] CLOUDINARY_API_KEY (if needed)
  - [ ] CLOUDINARY_API_SECRET (if needed)
  - [ ] JWT_SECRET
- [ ] Click "Run NPM Install"
- [ ] Click "Start App"

## Testing
- [ ] Visit: https://yourdomain.com/api
- [ ] Should see welcome message
- [ ] Test: https://yourdomain.com/api/blogs
- [ ] Should return blogs data

## Frontend Update
- [ ] Update frontend/.env with new API URL
- [ ] Rebuild frontend
- [ ] Redeploy to Vercel
- [ ] Test frontend with new backend

## Final Checks
- [ ] SSL certificate active (https://)
- [ ] All API endpoints working
- [ ] Admin login working
- [ ] Image uploads working (if applicable)
- [ ] No CORS errors
- [ ] Check application logs for errors

## Your API URL
Write it here: _________________________________

## Deployment Date
Date: _________________________________

---

## Quick Commands Reference

### Restart Application
cPanel → Setup Node.js App → Click "Restart"

### View Logs
cPanel → Setup Node.js App → Scroll to logs section

### Update Code
1. Upload new files via File Manager
2. Click "Restart" in Node.js App

### Reinstall Dependencies
cPanel → Setup Node.js App → Click "Run NPM Install"

---

**Need help? Check CPANEL-DEPLOYMENT-GUIDE.md for detailed instructions**
