import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import KidsActivities from '../components/KidsActivities'
import ScrollToTop from '../components/ScrollToTop'

const KidsActivitiesPage = () => {
  return (
    <div className="min-h-screen bg-charcoal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-newari-red/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 mandala-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Decorative Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-gold-accent to-gold-accent/80 rounded-full shadow-gold"
            >
              <svg
                className="w-10 h-10 text-charcoal-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary-text">Kids </span>
              <span className="text-gold-accent">Activities</span>
            </h1>
            <p className="text-xl text-paragraph-text max-w-3xl mx-auto leading-relaxed">
              Nurturing the next generation through cultural education, traditional arts, and engaging activities that celebrate our Newari heritage.
            </p>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold-accent"></div>
              <div className="w-2 h-2 rounded-full bg-gold-accent"></div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold-accent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <KidsActivities />
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default KidsActivitiesPage
