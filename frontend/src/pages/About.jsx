import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AboutHero from '../components/AboutHero'
import AboutMission from '../components/AboutMission'
import Teams from '../components/Teams'
import Projects from "../components/Projects";
import EventsSidebar from "../components/EventsSidebar";
import Supporters from "../components/Supporters";
import ScrollToTop from "../components/ScrollToTop";

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
            <div id="executive">
              <Teams />
            </div>
            <div id="projects">
              <Projects />
            </div>
            <div id="advisors" className="scroll-mt-24">
              {/* Advisors section - placeholder for now */}
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
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="heading-lg mb-2">
                      Our <span className="text-gold-accent">Advisors</span>
                    </h2>
                    <p className="text-paragraph-text">
                      Guided by experienced advisors who provide strategic
                      direction and cultural wisdom.
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>

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
};

export default About
