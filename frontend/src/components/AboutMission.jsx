import React from 'react'
import { motion } from 'framer-motion'

const AboutMission = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-12"
    >
      {/* Premium About Us Card */}
      <div className="card-premium temple-corner relative group">
        {/* Mandala Pattern Background */}
        <div className="absolute inset-0 mandala-pattern opacity-5 rounded-xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Decorative Corner Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-accent/10 to-transparent rounded-tr-xl"></div>

          <h2 className="heading-lg mb-8">
            About <span className="text-gold-accent">Us</span>
          </h2>

          {/* Pagoda Divider */}
          <div className="flex mb-8">
            <div className="pagoda-divider w-48"></div>
          </div>

          <div className="space-y-6 text-paragraph-text leading-relaxed text-justify">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg"
            >
              <strong className="text-primary-text bg-gradient-to-r from-gold-accent/20 to-transparent px-2 py-1 rounded">
                ल्याय्​म्ह अमेरिका गुथी: Lyaymha America Guthi (LAG)
              </strong>{" "}
              is a registered U.S.-based non-profit organization devoted to
              nurturing the next generation through newari art, culture, and
              language, helping U.S.-born children take pride in their heritage
              and identity.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our focus is on the younger generation, as they are the future
              bearers of our legacy and identity. We strive to educate and raise
              awareness among our children about our culture, language, and
              festivals. Lyaymha America Guthi has consistently demonstrated its
              concern for and commitment to preserving our identity through
              various programs.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Premium Objectives Card */}
      <div id="objectives" className="card-premium temple-corner relative">
        {/* Mandala Pattern Background */}
        <div className="absolute inset-0 mandala-pattern opacity-5 rounded-xl pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="heading-lg mb-8">
            Our{" "}
            <span className="text-gold-accent">Objectives and Missions</span>
          </h2>

          {/* Pagoda Divider */}
          <div className="flex mb-10">
            <div className="pagoda-divider w-48"></div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start group/item"
            >
              {/* Premium Icon Badge */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gold-accent/20 rounded-full blur-xl group-hover/item:bg-gold-accent/30 transition-all duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-gold-accent to-newari-red rounded-full flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-charcoal-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>

              <div className="flex-1 ml-6">
                <h3 className="text-2xl font-bold text-primary-text mb-3 group-hover/item:text-gold-accent transition-colors duration-300">
                  Educational Workshops
                </h3>
                <p className="text-paragraph-text leading-relaxed">
                  Facilitate children's workshops to educate and raise awareness
                  about our culture, language, arts, and music through various
                  activities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start group/item"
            >
              {/* Premium Icon Badge */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-newari-red/20 rounded-full blur-xl group-hover/item:bg-newari-red/30 transition-all duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-newari-red to-gold-accent rounded-full flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>

              <div className="flex-1 ml-6">
                <h3 className="text-2xl font-bold text-primary-text mb-3 group-hover/item:text-gold-accent transition-colors duration-300">
                  Cultural Preservation
                </h3>
                <p className="text-paragraph-text leading-relaxed">
                  Preserve our culture, language, arts, and music, inspiring the
                  community to foster intercultural understanding and
                  appreciation through high-quality, meaningful, and accessible
                  musical and cultural collaborations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start group/item"
            >
              {/* Premium Icon Badge */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gold-accent/20 rounded-full blur-xl group-hover/item:bg-gold-accent/30 transition-all duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-gold-accent via-newari-red to-gold-accent rounded-full flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-charcoal-black"
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
              </div>

              <div className="flex-1 ml-6">
                <h3 className="text-2xl font-bold text-primary-text mb-3 group-hover/item:text-gold-accent transition-colors duration-300">
                  Community Platform
                </h3>
                <p className="text-paragraph-text leading-relaxed">
                  Provide a platform for all community members to learn about
                  our culture, language, and festivals, enabling musicians and
                  artists to perform, promote, network, and sustain activities
                  related to music, arts, and culture.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default AboutMission
