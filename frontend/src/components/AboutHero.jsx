import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/images/logo/lyama (1) (1).png'
import heroBanner from '../assets/images/posts/471944315_555366943987150_1453996420800501859_n.jpg'

const AboutHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="About Lyalmha America"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black/90 via-deep-black/80 to-deep-black/70"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #C4161C 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, #1F3C88 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex justify-center"
          >
            <img
              src={logo}
              alt="Lyaymha America Logo"
              className="h-64 w-64 object-contain"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">About </span>
              <span className="text-nepal-red">Lyaymha</span>
              <span className="text-usa-blue"> America</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              ल्याय्म्ह अमेरिका गुथि
            </p>
            <p className="text-lg text-gray-400">
              Nurturing the next generation through Newari art, culture, and language
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
