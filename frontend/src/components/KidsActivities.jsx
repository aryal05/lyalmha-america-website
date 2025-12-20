import React from 'react'
import { motion } from 'framer-motion'
import workshop1 from '../assets/images/posts/430057563_377416895039960_1581867728642530497_n.jpg'
import workshop2 from '../assets/images/posts/433421627_946258180277784_6165530352102042076_n.jpg'
import madalBanner from '../assets/images/posts/Madal and Dhimay Picture Banner_1.png'
import danceImg from '../assets/images/posts/438077842_407204048727911_1401114441457624925_n.jpg'

const KidsActivities = () => {
  const activities = [
    {
      title: 'Culture Workshop Session 1',
      description: 'Interactive sessions teaching children about Newari traditions, customs, and cultural practices.',
      image: workshop1,
      category: 'Workshop'
    },
    {
      title: 'Culture Workshop Session 2',
      description: 'Advanced cultural education programs focusing on historical significance and contemporary relevance.',
      image: workshop2,
      category: 'Workshop'
    },
    {
      title: 'Madal and Dhimay Workshop',
      description: 'Hands-on musical instrument training, teaching children the art of traditional Newari percussion.',
      image: madalBanner,
      category: 'Music'
    },
    {
      title: 'Dance, Music & Literature',
      description: 'Comprehensive programs covering traditional dance forms, musical expressions, and language learning.',
      image: danceImg,
      category: 'Arts'
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        Kids <span className="text-nepal-red">Activities</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-accent-gray rounded-xl overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-nepal-red/20 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-usa-blue text-white text-xs font-semibold rounded-full">
                  {activity.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
                {activity.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {activity.description}
              </p>
              <button className="text-usa-blue font-semibold hover:text-nepal-red transition-colors duration-300 inline-flex items-center">
                Learn More
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 bg-gradient-to-r from-nepal-red/10 to-usa-blue/10 rounded-xl p-6 border border-nepal-red/20"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-nepal-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-white mb-2">Regular Programs</h4>
            <p className="text-gray-300">
              We conduct regular workshops and activities throughout the year. These programs are designed to engage children of all ages in learning about their heritage through fun and interactive methods including dance, music, language lessons, and cultural literature.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default KidsActivities
