import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import event1 from '../assets/images/posts/471944315_555366943987150_1453996420800501859_n.jpg'
import event2 from '../assets/images/posts/467736461_487936857446592_6777699176984050234_n (1).jpg'
import event3 from '../assets/images/posts/462650425_598936739649734_2260957587124948845_n.jpg'

const EventsSidebar = () => {
  const upcomingEvents = [
    {
      title: 'Annual Cultural Festival 2026',
      date: 'March 15, 2026',
      location: 'Community Center',
      type: 'Festival'
    },
    {
      title: 'Children\'s Language Workshop',
      date: 'February 20, 2026',
      location: 'Online',
      type: 'Workshop'
    },
    {
      title: 'Traditional Music Concert',
      date: 'April 10, 2026',
      location: 'Main Hall',
      type: 'Concert'
    }
  ]

  const pastEvents = [
    {
      title: 'Biska Jatra Celebration 2024',
      date: 'April 2024',
      image: event1
    },
    {
      title: 'Cultural Dance Workshop',
      date: 'November 2024',
      image: event2
    },
    {
      title: 'Community Gathering',
      date: 'September 2024',
      image: event3
    }
  ]

  return (
    <div className="space-y-8 sticky top-24">
      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-accent-gray rounded-xl p-6"
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-nepal-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Upcoming Events
        </h3>

        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-nepal-red pl-4 py-2 hover:bg-deep-black/50 transition-colors duration-300 rounded-r cursor-pointer"
            >
              <span className="inline-block px-2 py-1 bg-usa-blue text-white text-xs rounded mb-2">
                {event.type}
              </span>
              <h4 className="font-semibold text-white mb-1">{event.title}</h4>
              <p className="text-sm text-gray-400">{event.date}</p>
              <p className="text-xs text-gray-500">{event.location}</p>
            </motion.div>
          ))}
        </div>

        <button className="mt-6 w-full px-4 py-2 bg-nepal-red text-white rounded-lg hover:bg-opacity-90 transition-all duration-300">
          View All Events
        </button>
      </motion.div>

      {/* Past Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-accent-gray rounded-xl p-6"
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-usa-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Past Events
        </h3>

        <div className="space-y-4">
          {pastEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
              </div>
              <h4 className="font-semibold text-white group-hover:text-nepal-red transition-colors duration-300">
                {event.title}
              </h4>
              <p className="text-sm text-gray-400">{event.date}</p>
            </motion.div>
          ))}
        </div>

        <button className="mt-6 w-full px-4 py-2 border border-usa-blue text-usa-blue rounded-lg hover:bg-usa-blue hover:text-white transition-all duration-300">
          View Gallery
        </button>
      </motion.div>

      {/* Life Membership CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-nepal-red to-usa-blue rounded-xl p-6 text-center"
      >
        <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
        <h3 className="text-xl font-bold text-white mb-2">
          Become a Life Member
        </h3>
        <p className="text-white/90 text-sm mb-4">
          Join our community of dedicated supporters and help preserve Newari culture for future generations.
        </p>
        <Link to="/contact" className="inline-block px-6 py-3 bg-white text-nepal-red font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
          Join Now
        </Link>
      </motion.div>
    </div>
  )
}

export default EventsSidebar
