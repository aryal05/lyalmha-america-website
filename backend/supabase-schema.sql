-- Supabase PostgreSQL Schema
-- Copy and paste this entire content into Supabase SQL Editor

-- Users table (superadmin)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  banner TEXT,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  email TEXT,
  phone TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  event_time TEXT,
  location TEXT,
  event_type TEXT DEFAULT 'event',
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Images table
CREATE TABLE IF NOT EXISTS event_images (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_thumbnail INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supporters table
CREATE TABLE IF NOT EXISTS supporters (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'financial',
  logo TEXT,
  contact_person TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  link TEXT,
  position TEXT DEFAULT 'hero',
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  image TEXT,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  location TEXT,
  featured INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Team Members table
CREATE TABLE IF NOT EXISTS project_team (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT DEFAULT 'member',
  order_index INTEGER DEFAULT 0
);

-- Activities table (Kids workshops, etc)
CREATE TABLE IF NOT EXISTS activities (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_info TEXT,
  category TEXT NOT NULL,
  image TEXT,
  benefits TEXT,
  age_group TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table (Parent testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  parent TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  children TEXT,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table (Press releases, announcements, media coverage)
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  author TEXT,
  category TEXT DEFAULT 'announcement',
  published_date DATE NOT NULL,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table (Photo gallery)
CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  category TEXT DEFAULT 'event',
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Culture Festivals table
CREATE TABLE IF NOT EXISTS culture_festivals (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  highlights TEXT,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Culture Traditions table
CREATE TABLE IF NOT EXISTS culture_traditions (
  id BIGSERIAL PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event RSVPs table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendees TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membership Registrations table
CREATE TABLE IF NOT EXISTS membership_registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_address TEXT,
  city TEXT,
  zipcode TEXT,
  contact_no TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  family_id TEXT,
  referred_by TEXT,
  referral_name TEXT,
  referral_contact TEXT,
  membership_token TEXT UNIQUE NOT NULL,
  membership_type TEXT DEFAULT 'individual',
  membership_fee DECIMAL(10,2) DEFAULT 200.00,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
