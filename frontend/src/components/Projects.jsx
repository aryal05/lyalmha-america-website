import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import biskaImage from '../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg'

const Projects = () => {
  const [showDetails, setShowDetails] = useState(false)

  const projectTeam = {
    advisors: [
      { name: 'Shyam Kaji Shrestha', role: 'Nayo Pahmaa' },
      { name: 'Guru Arjun Shrestha', role: 'Project Advisor' }
    ],
    coordinator: 'Puskar Prajapti',
    woodworkTeam: [
      { name: 'Hari Hyamthaku Shrestha', role: 'Lead Woodwork Expert' },
      { name: 'Sugandha Shrestha', role: 'Chief Woodwork Assist' },
      { name: 'Mani Shrestha', role: 'Chief Woodwork Assist' },
      { name: 'Roshan Shrestha', role: 'Team Member' },
      { name: 'Bigyan Shrestha', role: 'Team Member' },
      { name: 'Nirajan Shrestha', role: 'Team Member' },
      { name: 'Vishwa Shrestha', role: 'Team Member' },
      { name: 'Bal Krishna Prajapati', role: 'Team Member' },
      { name: 'Sanam Sikhrakar', role: 'Team Member' },
      { name: 'Delesh Shrestha', role: 'Team Member' }
    ]
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        Our <span className="text-nepal-red">Projects</span>
      </h2>

      <motion.div
        className="bg-accent-gray rounded-xl overflow-hidden shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-auto overflow-hidden">
            <img
              src={biskaImage}
              alt="Biskaa Jatra Project"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-black/50 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-nepal-red text-white text-xs font-semibold rounded-full mb-4 w-fit">
              Featured Project
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Biskaa Jatra Celebration Project
            </h3>
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              Lyaymha America Guthi continues the auspicious Biskaa Jatra Celebration in the DMV region, started in 2022. 
              This weeklong celebration during Khai-Salhu welcomes Spring Bloom, Good Health, Peace, and Prosperity.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-usa-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Started: 2022 | 2nd Celebration: April 13, 2024
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-usa-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                DMV Region (DC, Maryland, Virginia)
              </div>
            </div>

            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-3 bg-nepal-red text-white rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 w-fit"
            >
              {showDetails ? 'Show Less' : 'View Full Details'}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-8 border-t border-gray-700 space-y-8">
                {/* Project Description */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-nepal-red" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    About the Project
                  </h4>
                  <div className="text-gray-300 space-y-3 leading-relaxed">
                    <p>
                      The auspicious Biskaa Jatra is a weeklong celebration during Khai-Salhu (the Spring Equinox of the Nepalese Luni-Solar Calendar) 
                      welcoming the Spring Bloom, Good health, Peace, and Prosperity of the World. This celebration is joined by both people and the 
                      Gods and Goddesses along with Halin-Pataa, displaying marvellous Dhime and Khin music and dances.
                    </p>
                    <p>
                      Our coordinating committee members and volunteers worked tirelessly to build a Replica of a Dyou-Kha (an auspicious chariot 
                      of the Gods and Goddesses) and a Chhatra. The Biskaa Jatra Dyou-Kha symbolizes the Newah Civilization prior to the invention 
                      of wheels in human history. This Dyou-Kha is carried on human shoulders.
                    </p>
                    <p>
                      The Dyou-Kha is about <strong className="text-white">8 feet tall, 150 lb weight</strong>, carried by 8 to 12 Jatra participants. 
                      The Chhatra stands on the waistline and is revolved by hand continuously. This replica, crafted with authentic ornaments by 
                      artists from Nepal, was built for the first time outside Nepal-Mandala in the free land of Americas.
                    </p>
                  </div>
                </div>

                {/* Project Team */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-usa-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Project Team (2023)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Advisors */}
                    <div className="bg-deep-black/50 rounded-lg p-4">
                      <h5 className="font-semibold text-nepal-red mb-3">Project Advisors from Nepal</h5>
                      {projectTeam.advisors.map((advisor, idx) => (
                        <div key={idx} className="text-gray-300 mb-2">
                          <span className="text-white">{advisor.name}</span> - {advisor.role}
                        </div>
                      ))}
                    </div>

                    {/* Coordinator */}
                    <div className="bg-deep-black/50 rounded-lg p-4">
                      <h5 className="font-semibold text-usa-blue mb-3">Project Coordinator</h5>
                      <div className="text-white">{projectTeam.coordinator}</div>
                    </div>
                  </div>

                  {/* Woodwork Team */}
                  <div className="mt-4 bg-deep-black/50 rounded-lg p-4">
                    <h5 className="font-semibold text-nepal-red mb-3">Woodwork Team</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {projectTeam.woodworkTeam.map((member, idx) => (
                        <div key={idx} className="text-gray-300">
                          <div className="text-white text-sm">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Note about supporters */}
                <div className="bg-gradient-to-r from-nepal-red/10 to-usa-blue/10 rounded-lg p-6 border border-nepal-red/20">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-nepal-red mr-3 flex-shrink-0 mt-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <div>
                      <h5 className="font-semibold text-white mb-2">Community Support</h5>
                      <p className="text-gray-300 text-sm">
                        This project was made possible through the generous support of over 30 individual supporters and 8 corporate sponsors 
                        from our community. Their dedication and contributions helped preserve and celebrate our cultural heritage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  )
}

export default Projects
