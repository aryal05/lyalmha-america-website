
import axios from 'axios'

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://lyalmha-america-website-f7yk.vercel.app'
// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
})

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Only set Content-Type to JSON if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API Endpoints
export const API_ENDPOINTS = {
  STORIES: {
    GET_ALL: '/api/blogs',
    GET_ADMIN_ALL: '/api/admin/blogs/admin/all',
    GET_BY_ID: (id) => `/api/blogs/${id}`,
    CREATE: '/api/admin/blogs',
    UPDATE: (id) => `/api/admin/blogs/${id}`,
    DELETE: (id) => `/api/admin/blogs/${id}`,
  },
  AUTH: {
    LOGIN: '/api/auth/login',
  },
  BLOGS: {
    GET_ALL: '/api/blogs',
    GET_ADMIN_ALL: '/api/admin/blogs/admin/all',
    GET_BY_ID: (id) => `/api/blogs/${id}`,
    CREATE: '/api/admin/blogs',
    UPDATE: (id) => `/api/admin/blogs/${id}`,
    DELETE: (id) => `/api/admin/blogs/${id}`,
  },
  TEAM: {
    GET_ALL: '/api/admin/team',
    GET_BY_CATEGORY: (category) => `/api/admin/team/category/${category}`,
    CREATE: '/api/admin/team',
    UPDATE: (id) => `/api/admin/team/${id}`,
    DELETE: (id) => `/api/admin/team/${id}`,
  },
  EVENTS: {
    GET_ALL: '/api/admin/events',
    GET_UPCOMING: '/api/admin/events/upcoming',
    GET_PAST: '/api/admin/events/past',
    CREATE: '/api/admin/events',
    UPDATE: (id) => `/api/admin/events/${id}`,
    DELETE: (id) => `/api/admin/events/${id}`,
  },
  SUPPORTERS: {
    GET_ALL: '/api/admin/supporters',
    GET_BY_TYPE: (type) => `/api/admin/supporters/type/${type}`,
    CREATE: '/api/admin/supporters',
    UPDATE: (id) => `/api/admin/supporters/${id}`,
    DELETE: (id) => `/api/admin/supporters/${id}`,
  },
  BANNERS: {
    GET_ALL: '/api/admin/banners/admin/all',
    GET_BY_LOCATION: (location) => `/api/admin/banners/location/${location}`,
    CREATE: '/api/admin/banners',
    UPDATE: (id) => `/api/admin/banners/${id}`,
    DELETE: (id) => `/api/admin/banners/${id}`,
  },
  CULTURE: {
    GET_FESTIVALS: '/api/admin/culture/festivals',
    GET_TRADITIONS: '/api/admin/culture/traditions',
    CREATE_FESTIVAL: '/api/admin/culture/festivals',
    UPDATE_FESTIVAL: (id) => `/api/admin/culture/festivals/${id}`,
    DELETE_FESTIVAL: (id) => `/api/admin/culture/festivals/${id}`,
    CREATE_TRADITION: '/api/admin/culture/traditions',
    UPDATE_TRADITION: (id) => `/api/admin/culture/traditions/${id}`,
    DELETE_TRADITION: (id) => `/api/admin/culture/traditions/${id}`,
  },
  ACTIVITIES: {
    GET_ALL: '/api/admin/activities',
    GET_BY_ID: (id) => `/api/admin/activities/${id}`,
    CREATE: '/api/admin/activities',
    UPDATE: (id) => `/api/admin/activities/${id}`,
    DELETE: (id) => `/api/admin/activities/${id}`,
  },
  TESTIMONIALS: {
    GET_ALL: '/api/admin/testimonials',
    GET_BY_ID: (id) => `/api/admin/testimonials/${id}`,
    CREATE: '/api/admin/testimonials',
    UPDATE: (id) => `/api/admin/testimonials/${id}`,
    DELETE: (id) => `/api/admin/testimonials/${id}`,
  },
  NEWS: {
    GET_ALL: '/api/admin/news',
    GET_BY_ID: (id) => `/api/admin/news/${id}`,
    CREATE: '/api/admin/news',
    UPDATE: (id) => `/api/admin/news/${id}`,
    DELETE: (id) => `/api/admin/news/${id}`,
  },
  GALLERY: {
    GET_ALL: '/api/admin/gallery',
    GET_BY_ID: (id) => `/api/admin/gallery/${id}`,
    CREATE: '/api/admin/gallery',
    UPDATE: (id) => `/api/admin/gallery/${id}`,
    DELETE: (id) => `/api/admin/gallery/${id}`,
  },
  CONTACT: {
    SUBMIT: '/api/contact/submit',
    GET_ALL: '/api/admin/contact',
    GET_UNREAD_COUNT: '/api/admin/contact/unread-count',
    MARK_READ: (id) => `/api/admin/contact/${id}/read`,
    DELETE: (id) => `/api/admin/contact/${id}`,
  },
  RSVP: {
    SUBMIT: '/api/rsvp',
    GET_ALL: '/api/admin/rsvps',
    DELETE: (id) => `/api/admin/rsvps/${id}`,
  },
  PROJECTS: {
    GET_ALL: '/api/admin/projects',
    GET_ACTIVE: '/api/admin/projects/active',
    GET_BY_ID: (id) => `/api/admin/projects/${id}`,
    CREATE: '/api/admin/projects',
    UPDATE: (id) => `/api/admin/projects/${id}`,
    DELETE: (id) => `/api/admin/projects/${id}`,
  },
}
