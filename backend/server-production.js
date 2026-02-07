import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeDatabase } from './database.js'
import blogRoutes from './routes/blogRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminBlogsRoutes from './routes/adminBlogsRoutes.js'
import adminTeamRoutes from './routes/adminTeamRoutes.js'
import adminEventsRoutes from './routes/adminEventsRoutes.js'
import adminSupportersRoutes from './routes/adminSupportersRoutes.js'
import adminBannersRoutes from './routes/adminBannersRoutes.js'
import adminCultureRoutes from './routes/adminCultureRoutes.js'
import adminActivitiesRoutes from './routes/adminActivitiesRoutes.js'
import adminTestimonialsRoutes from './routes/adminTestimonialsRoutes.js'
import adminNewsRoutes from './routes/adminNewsRoutes.js'
import adminGalleryRoutes from './routes/adminGalleryRoutes.js'
import adminEventImagesRoutes from './routes/adminEventImagesRoutes.js'
import adminContactRoutes from './routes/adminContactRoutes.js'
import adminRsvpRoutes from './routes/adminRsvpRoutes.js'
import rsvpRoutes from './routes/rsvpRoutes.js'
import adminProjectsRoutes from './routes/adminProjectsRoutes.js'
import { fixAllSequences } from './utils/fixSequences.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

await initializeDatabase()

// Fix PostgreSQL sequences on startup
try {
  await fixAllSequences()
} catch (err) {
  console.error('Warning: Could not fix sequences:', err.message)
}

app.use(cors({
  origin: [
    'https://lyaymhaamerica.org',
    'https://www.lyaymhaamerica.org',
    'https://lyalmha-america-website.vercel.app',
    'https://lyalmha-america-website-g888.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.json({ 
    message: 'Lyalmha America API',
    status: 'Running',
    version: '2.0.0'
  })
})

app.use('/api/blogs', blogRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin/blogs', adminBlogsRoutes)
app.use('/api/admin/team', adminTeamRoutes)
app.use('/api/admin/events', adminEventsRoutes)
app.use('/api/admin/supporters', adminSupportersRoutes)
app.use('/api/admin/banners', adminBannersRoutes)
app.use('/api/admin/culture', adminCultureRoutes)
app.use('/api/admin/activities', adminActivitiesRoutes)
app.use('/api/admin/testimonials', adminTestimonialsRoutes)
app.use('/api/admin/news', adminNewsRoutes)
app.use('/api/admin/gallery', adminGalleryRoutes)
app.use('/api/admin/event-images', adminEventImagesRoutes)
app.use('/api/contact', adminContactRoutes)
app.use('/api/admin/contact', adminContactRoutes)
app.use('/api/admin/rsvps', adminRsvpRoutes)
app.use('/api/rsvp', rsvpRoutes)
app.use('/api/admin/projects', adminProjectsRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!', message: err.message })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
