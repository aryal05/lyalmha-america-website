import React from 'react'
import { motion } from 'framer-motion'

const Teams = () => {
  const teamCategories = [
    {
      title: 'Executive Team',
      description: 'Our dedicated leadership team guiding Lyaymha America\'s vision and mission',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      color: 'nepal-red'
    },
    {
      title: 'Advisors',
      description: 'Experienced mentors providing strategic guidance and cultural expertise',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      color: 'usa-blue'
    },
    {
      title: 'Life Members',
      description: 'Committed supporters who have made a lasting impact on our community',
      icon: (
        <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      color: 'nepal-red'
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        Our <span className="text-nepal-red">Team</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamCategories.map((team, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-accent-gray rounded-xl p-6 hover:shadow-lg hover:shadow-nepal-red/20 transition-all duration-300 group cursor-pointer"
          >
            <div className={`w-16 h-16 bg-${team.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <div className="text-white">{team.icon}</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
              {team.title}
            </h3>
            <p className="text-gray-300 text-sm">
              {team.description}
            </p>
            <button className="mt-4 text-usa-blue font-semibold hover:text-nepal-red transition-colors duration-300 inline-flex items-center">
              Learn More
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default Teams
