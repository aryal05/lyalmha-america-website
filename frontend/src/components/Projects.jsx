import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import biskaImage from '../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg'

const Projects = () => {
  const [showDetails, setShowDetails] = useState(false)
  const [hoveredMember, setHoveredMember] = useState(null);

  const projectTeam = {
    advisors: [
      { name: "Shyam Kaji Shrestha", role: "Nayo Pahmaa" },
      { name: "Guru Arjun Shrestha", role: "Project Advisor" },
    ],
    coordinator: "Puskar Prajapti",
    woodworkTeam: [
      { name: "Hari Hyamthaku Shrestha", role: "Lead Woodwork Expert" },
      { name: "Sugandha Shrestha", role: "Chief Woodwork Assist" },
      { name: "Mani Shrestha", role: "Chief Woodwork Assist" },
      { name: "Roshan Shrestha", role: "Team Member" },
      { name: "Bigyan Shrestha", role: "Team Member" },
      { name: "Nirajan Shrestha", role: "Team Member" },
      { name: "Vishwa Shrestha", role: "Team Member" },
      { name: "Bal Krishna Prajapati", role: "Team Member" },
      { name: "Sanam Sikhrakar", role: "Team Member" },
      { name: "Delesh Shrestha", role: "Team Member" },
    ],
  };

  // Timeline milestones
  const timeline = [
    {
      year: "2022",
      event: "Project Initiated",
      description: "First Biskaa Jatra outside Nepal-Mandala",
    },
    {
      year: "2023",
      event: "Dyou-Kha Built",
      description: "8ft tall, 150lb authentic chariot crafted",
    },
    {
      year: "2024",
      event: "2nd Celebration",
      description: "Expanded community participation",
    },
    {
      year: "Future",
      event: "Growing Legacy",
      description: "Continuing tradition for generations",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="mb-12 text-center">
        <h2 className="heading-lg mb-6 relative inline-block">
          Our{" "}
          <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
            Projects
          </span>
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
        </h2>
        <div className="pagoda-divider w-48 mx-auto"></div>
      </div>

      <motion.div
        className="card-premium temple-corner overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Mandala Background Overlay */}
          <div className="absolute inset-0 mandala-pattern opacity-5"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
            {/* Image with Hover Effect */}
            <motion.div
              className="relative h-80 lg:h-auto overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={biskaImage}
                alt="Biskaa Jatra Project"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal-black/70 to-transparent"></div>

              {/* Decorative Corner Accents on Image */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-newari-red opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Mandala Overlay on Image */}
              <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            </motion.div>

            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <motion.div
                className="inline-block px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black text-sm font-bold rounded-full mb-6 w-fit shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(242, 201, 76, 0.5)",
                    "0 0 30px rgba(196, 22, 28, 0.5)",
                    "0 0 20px rgba(242, 201, 76, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐ Featured Project
              </motion.div>

              <h3 className="text-3xl lg:text-4xl font-bold text-primary-text mb-6 hover:text-gold-accent transition-colors">
                Biskaa Jatra Celebration Project
              </h3>

              <div className="pagoda-divider w-32 mb-6"></div>

              <p className="text-paragraph-text mb-6 leading-relaxed text-lg">
                Lyaymha America Guthi continues the auspicious Biskaa Jatra
                Celebration in the DMV region, started in 2022. This weeklong
                celebration during Khai-Salhu welcomes Spring Bloom, Good
                Health, Peace, and Prosperity.
              </p>

              <div className="space-y-4 mb-8">
                <motion.div
                  className="flex items-center text-paragraph-text group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl group-hover:shadow-gold-accent/50 transition-all">
                    <svg
                      className="w-5 h-5 text-charcoal-black"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gold-accent">
                      Started: 2022
                    </span>
                    <span className="mx-2">|</span>
                    <span>2nd Celebration: April 13, 2024</span>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center text-paragraph-text group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl group-hover:shadow-newari-red/50 transition-all">
                    <svg
                      className="w-5 h-5 text-charcoal-black"
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
                  </div>
                  <div>
                    <span className="font-semibold text-gold-accent">
                      Location:
                    </span>
                    <span className="ml-2">
                      DMV Region (DC, Maryland, Virginia)
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.button
                onClick={() => setShowDetails(!showDetails)}
                className="px-8 py-4 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transform hover:scale-105 transition-all duration-300 w-fit shadow-lg hover:shadow-xl"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {showDetails ? "🔼 Show Less" : "🔽 View Full Details"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden border-t border-gold-accent/20"
            >
              <div className="p-8 lg:p-12 space-y-12 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 mandala-pattern opacity-5"></div>

                {/* Timeline Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10"
                >
                  <h4 className="text-2xl font-bold mb-8 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-6 h-6 text-charcoal-black"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                      Project Timeline
                    </span>
                  </h4>

                  <div className="space-y-6">
                    {timeline.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-start group"
                      >
                        {/* Pagoda Marker */}
                        <div className="relative flex-shrink-0 mr-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center font-bold text-charcoal-black shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                            {item.year}
                          </div>
                          {idx < timeline.length - 1 && (
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-newari-red to-gold-accent"></div>
                          )}
                        </div>

                        <div className="card-premium temple-corner flex-1 p-6 group-hover:shadow-xl transition-all">
                          <div className="relative">
                            <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <h5 className="font-bold text-xl text-gold-accent mb-2 relative z-10">
                              {item.event}
                            </h5>
                            <p className="text-paragraph-text relative z-10">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Project Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative z-10"
                >
                  <h4 className="text-2xl font-bold mb-8 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-6 h-6 text-charcoal-black"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                      About the Project
                    </span>
                  </h4>

                  <div className="card-premium temple-corner p-8">
                    <div className="relative">
                      <div className="absolute inset-0 mandala-pattern opacity-5"></div>
                      <div className="text-paragraph-text space-y-4 leading-relaxed text-lg relative z-10">
                        <p>
                          The auspicious Biskaa Jatra is a weeklong celebration
                          during{" "}
                          <span className="text-gold-accent font-semibold">
                            Khai-Salhu
                          </span>{" "}
                          (the Spring Equinox of the Nepalese Luni-Solar
                          Calendar) welcoming the Spring Bloom, Good health,
                          Peace, and Prosperity of the World. This celebration
                          is joined by both people and the Gods and Goddesses
                          along with Halin-Pataa, displaying marvellous Dhime
                          and Khin music and dances.
                        </p>
                        <p>
                          Our coordinating committee members and volunteers
                          worked tirelessly to build a Replica of a{" "}
                          <span className="text-gold-accent font-semibold">
                            Dyou-Kha
                          </span>{" "}
                          (an auspicious chariot of the Gods and Goddesses) and
                          a Chhatra. The Biskaa Jatra Dyou-Kha symbolizes the
                          Newah Civilization prior to the invention of wheels in
                          human history. This Dyou-Kha is carried on human
                          shoulders.
                        </p>
                        <div className="bg-gradient-to-r from-gold-accent/10 to-newari-red/10 p-6 rounded-lg border-l-4 border-gold-accent">
                          <p className="text-primary-text">
                            The Dyou-Kha is about{" "}
                            <strong className="text-gold-accent text-xl">
                              8 feet tall, 150 lb weight
                            </strong>
                            , carried by 8 to 12 Jatra participants. The Chhatra
                            stands on the waistline and is revolved by hand
                            continuously. This replica, crafted with authentic
                            ornaments by artists from Nepal, was built{" "}
                            <strong className="text-newari-red">
                              for the first time outside Nepal-Mandala
                            </strong>{" "}
                            in the free land of Americas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Project Team */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative z-10"
                >
                  <h4 className="text-2xl font-bold mb-8 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent via-newari-red to-gold-accent flex items-center justify-center mr-4 shadow-lg">
                      <svg
                        className="w-6 h-6 text-charcoal-black"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                      Project Team (2023)
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Advisors */}
                    <motion.div
                      className="card-premium temple-corner p-6"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 mandala-pattern opacity-5"></div>
                        <h5 className="font-bold text-lg text-gold-accent mb-4 flex items-center relative z-10">
                          <span className="w-2 h-2 rounded-full bg-gold-accent mr-2 animate-pulse"></span>
                          Project Advisors from Nepal
                        </h5>
                        <div className="space-y-3 relative z-10">
                          {projectTeam.advisors.map((advisor, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-paragraph-text group cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center mr-3 text-charcoal-black font-bold text-sm group-hover:scale-110 transition-transform">
                                {advisor.name.charAt(0)}
                              </div>
                              <div>
                                <span className="text-primary-text font-semibold group-hover:text-gold-accent transition-colors">
                                  {advisor.name}
                                </span>
                                <span className="mx-2">-</span>
                                <span className="text-sm">{advisor.role}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Coordinator */}
                    <motion.div
                      className="card-premium temple-corner p-6"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 mandala-pattern opacity-5"></div>
                        <h5 className="font-bold text-lg text-newari-red mb-4 flex items-center relative z-10">
                          <span className="w-2 h-2 rounded-full bg-newari-red mr-2 animate-pulse"></span>
                          Project Coordinator
                        </h5>
                        <div className="flex items-center relative z-10">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center mr-4 text-charcoal-black font-bold text-2xl shadow-lg">
                            {projectTeam.coordinator.charAt(0)}
                          </div>
                          <span className="text-primary-text font-bold text-xl">
                            {projectTeam.coordinator}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Woodwork Team */}
                  <motion.div
                    className="card-premium temple-corner p-8"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 mandala-pattern opacity-5"></div>
                      <h5 className="font-bold text-lg mb-6 flex items-center relative z-10">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gold-accent to-newari-red mr-2 animate-pulse"></span>
                        <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                          Woodwork Team
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                        {projectTeam.woodworkTeam.map((member, idx) => (
                          <motion.div
                            key={idx}
                            className="bg-gradient-to-br from-charcoal-black/50 to-dark-navy/50 p-4 rounded-lg border border-gold-accent/20 hover:border-gold-accent transition-all group cursor-pointer"
                            onHoverStart={() => setHoveredMember(idx)}
                            onHoverEnd={() => setHoveredMember(null)}
                            whileHover={{ y: -5 }}
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center mr-3 text-charcoal-black font-bold group-hover:scale-110 transition-transform shadow-lg">
                                {member.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="text-primary-text font-semibold text-sm group-hover:text-gold-accent transition-colors">
                                  {member.name}
                                </div>
                                <div className="text-xs text-paragraph-text">
                                  {member.role}
                                </div>
                              </div>
                            </div>
                            {hoveredMember === idx && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 pt-2 border-t border-gold-accent/20"
                              >
                                <span className="text-xs text-gold-accent">
                                  ✓ Team Member #{idx + 1}
                                </span>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Community Support Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="card-premium temple-corner p-8 bg-gradient-to-br from-gold-accent/5 to-newari-red/5 border-2 border-gold-accent/30 relative z-10"
                >
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center flex-shrink-0 mr-6 shadow-lg">
                      <svg
                        className="w-8 h-8 text-charcoal-black"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-2xl mb-4 bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                        Community Support
                      </h5>
                      <p className="text-paragraph-text text-lg leading-relaxed">
                        This project was made possible through the generous
                        support of{" "}
                        <strong className="text-gold-accent">
                          over 30 individual supporters
                        </strong>{" "}
                        and{" "}
                        <strong className="text-newari-red">
                          8 corporate sponsors
                        </strong>
                        from our community. Their dedication and contributions
                        helped preserve and celebrate our cultural heritage for
                        generations to come.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}

export default Projects
