import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AboutHero from '../components/AboutHero'
import AboutMission from '../components/AboutMission'
import Teams from '../components/Teams'
import Projects from '../components/Projects'
import KidsActivities from '../components/KidsActivities'
import EventsSidebar from '../components/EventsSidebar'
import Supporters from '../components/Supporters'
import ScrollToTop from '../components/ScrollToTop'

const About = () => {
  return (
    <div className="min-h-screen bg-charcoal-black">
      <Navbar />
      <AboutHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Decorative Background Elements with Mandala */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-newari-red/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full mandala-pattern opacity-5 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <AboutMission />
            <Teams />
            <Projects />
            <KidsActivities />

            {/* Premium News/Press Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-premium group hover:border-gold-accent/50 transition-all duration-300 temple-corner"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-gold-accent to-gold-accent/80 rounded-xl shadow-gold">
                  <svg
                    className="w-6 h-6 text-charcoal-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="heading-lg mb-2">
                    News & <span className="text-gold-accent">Press</span>
                  </h2>
                  <p className="text-paragraph-text">
                    Stay updated with our latest announcements, press releases,
                    and media coverage.
                  </p>
                </div>
              </div>
              <Link
                to="/blogs"
                className="btn-gold w-full sm:w-auto justify-center"
              >
                View Press Releases
              </Link>
            </motion.section>

            {/* Premium Contact Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-premium group hover:border-newari-red/50 transition-all duration-300 temple-corner"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-newari-red to-deep-maroon rounded-xl shadow-premium">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="heading-lg mb-2">
                    Contact <span className="text-newari-red">Us</span>
                  </h2>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-navy/30 border border-border-line hover:border-gold-accent/50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gold-accent flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-paragraph-text">
                    info@lyalmha-america.org
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-navy/30 border border-border-line hover:border-gold-accent/50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gold-accent flex-shrink-0"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-paragraph-text">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-dark-navy/30 border border-border-line hover:border-gold-accent/50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-paragraph-text">
                    United States of America
                  </span>
                </div>
              </div>
              <Link
                to="/contact"
                className="btn-primary w-full sm:w-auto justify-center"
              >
                Send Message
              </Link>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <EventsSidebar />
          </div>
        </div>
      </div>

      {/* Supporters Section - Full Width */}
      <Supporters />

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default About
