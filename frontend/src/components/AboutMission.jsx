import React from 'react'
import { motion } from 'framer-motion'

const AboutMission = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* About Us */}
      <div className="bg-accent-gray rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          About <span className="text-nepal-red">Us</span>
        </h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">ल्याय्म्ह अमेरिका गुथि: Lyaymha America Guthi (LAG)</strong> is a registered U.S.-based non-profit organization devoted to nurturing the next generation through Newah art, culture, and language, helping U.S.-born children take pride in their heritage and identity.
          </p>
          <p>
            Our focus is on the younger generation, as they are the future bearers of our legacy and identity. We strive to educate and raise awareness among our children about our culture, language, and festivals. Lyaymha America has consistently demonstrated its concern for and commitment to preserving our identity through various programs.
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div className="bg-accent-gray rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Our <span className="text-nepal-red">Objectives</span>
        </h2>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-nepal-red rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Educational Workshops</h3>
              <p className="text-gray-300">
                Facilitate children's workshops to educate and raise awareness about our culture, language, arts, and music through various activities.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-usa-blue rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Cultural Preservation</h3>
              <p className="text-gray-300">
                Preserve our culture, language, arts, and music, inspiring the community to foster intercultural understanding and appreciation through high-quality, meaningful, and accessible musical and cultural collaborations.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-nepal-red rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Community Platform</h3>
              <p className="text-gray-300">
                Provide a platform for all community members to learn about our culture, language, and festivals, enabling musicians and artists to perform, promote, network, and sustain activities related to music, arts, and culture.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default AboutMission
