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
    <div className="min-h-screen bg-deep-black">
      <Navbar />
      <AboutHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <AboutMission />
            <Teams />
            <Projects />
            <KidsActivities />
            
            {/* News/Press Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-accent-gray rounded-xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                News & <span className="text-nepal-red">Press</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Stay updated with our latest announcements, press releases, and media coverage.
              </p>
              <Link to="/blogs" className="inline-block px-6 py-3 bg-usa-blue text-white rounded-lg hover:bg-nepal-red transition-colors duration-300">
                View Press Releases
              </Link>
            </motion.section>

            {/* Contact Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-accent-gray rounded-xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Contact <span className="text-nepal-red">Us</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <svg className="w-6 h-6 mr-3 text-nepal-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  info@lyalmha-america.org
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-6 h-6 mr-3 text-nepal-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +1 (555) 123-4567
                </div>
                <div className="flex items-start text-gray-300">
                  <svg className="w-6 h-6 mr-3 mt-1 text-nepal-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  United States of America
                </div>
              </div>
              <div className="mt-6">
                <Link to="/contact" className="inline-block px-6 py-3 bg-nepal-red text-white rounded-lg hover:bg-opacity-90 transition-all duration-300">
                  Send Message
                </Link>
              </div>
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
  )
}

export default About
