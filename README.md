# Lyalmha America - newari Culture Blog

A professional full-stack blog website celebrating newari culture in America, built with React (frontend) and Node.js (backend).

## 🎨 Features

- **Modern UI**: Professional design with Tailwind CSS
- **Smooth Animations**: Engaging user experience with Framer Motion
- **Responsive Design**: Mobile-first approach
- **Blog Management**: CRUD operations for blog posts
- **Custom Color Scheme**: Branded colors representing Nepal and USA

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios

### Backend
- Node.js
- Express
- RESTful API
- CORS enabled

## 📦 Installation

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your logo:
   - Place your logo as `logo.png` in the `public` folder

5. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## 🌐 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables in Vercel dashboard
5. Deploy!

### Backend (Railway)

1. Push your code to GitHub
2. Create new project in Railway
3. Connect your repository
4. Railway will auto-detect Node.js and deploy
5. Add environment variables in Railway dashboard
6. Your API will be live!

## 📁 Project Structure

```
Project-Culture/
├── frontend/
│   ├── public/
│   │   └── logo.png (place your logo here)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogGrid.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/
    ├── routes/
    │   └── blogRoutes.js
    ├── server.js
    ├── package.json
    └── .env.example

```

## 🎨 Color Palette

- **Deep Black**: #0B0B0B (Background)
- **Nepal Red**: #C4161C (Primary accent)
- **USA Navy Blue**: #1F3C88 (Secondary accent)
- **White**: #FFFFFF
- **Accent Gray**: #2E2E2E

## 🔧 API Endpoints

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=your_backend_url
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

## 🎯 Next Steps

1. **Add your logo**: Place `logo.png` in `frontend/public/`
2. **Database Integration**: Connect MongoDB for persistent data
3. **Image Upload**: Implement Cloudinary for banner uploads
4. **Authentication**: Add admin authentication for blog management
5. **Rich Text Editor**: Integrate editor for blog content
6. **SEO Optimization**: Add meta tags and sitemap

## 📄 License

This project is private and proprietary.

## 👨‍💻 Support

For support and queries, contact the development team.

---

**Built with ❤️ for the newari community in America**
