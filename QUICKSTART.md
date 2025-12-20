# Quick Start Guide

## 🚀 Starting the Development Servers

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will be available at: `http://localhost:3000`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend API will be available at: `http://localhost:5000`

### Option 2: PowerShell Script (Windows)

Create a `start.ps1` file in the root directory and run both servers simultaneously.

## 📝 Important Steps

1. **Add Your Logo**: 
   - Save the logo image you provided as `logo.png` in `frontend/public/` directory
   - The logo is already referenced in the code

2. **Create Environment Files**:
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env
   
   # Backend
   cd backend
   cp .env.example .env
   ```

3. **Test the Application**:
   - Visit `http://localhost:3000` to see your landing page
   - Visit `http://localhost:5000/api/blogs` to test the API

## 🎨 What You'll See

- **Hero Section**: Animated logo with brand colors
- **Blog Grid**: 6 dummy blog posts about Newari culture
- **Smooth Animations**: Framer Motion animations throughout
- **Responsive Design**: Works on all devices
- **Professional UI**: Clean design with your color scheme

## 🔧 Customization

To edit blog posts, modify the `blogs` array in:
- `frontend/src/components/BlogGrid.jsx` (frontend display)
- `backend/routes/blogRoutes.js` (backend data)

## 📦 Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## 🌐 Deployment

Follow the deployment instructions in the main README.md file.

---

**Need Help?** Check the main README.md for detailed documentation.
