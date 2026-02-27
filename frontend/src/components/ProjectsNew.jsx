import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.GET_ACTIVE);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

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

      <div className="space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card-premium temple-corner overflow-hidden"
            whileHover={{ scale: 1.01 }}
          >
            <div className="relative">
              <div className="absolute inset-0 mandala-pattern opacity-5"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
                {/* Image */}
                <motion.div
                  className="relative h-80 lg:h-auto overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={getImageUrl(project.image)}
                    alt={project.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal-black/70 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-newari-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                </motion.div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {project.featured === 1 && (
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
                  )}

                  <h3 className="text-3xl lg:text-4xl font-bold text-primary-text mb-6 hover:text-gold-accent transition-colors">
                    {project.title}
                  </h3>

                  <div className="pagoda-divider w-32 mb-6"></div>

                  <p className="text-paragraph-text mb-6 leading-relaxed text-lg">
                    {project.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    {project.start_date && (
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
                            Started: {project.start_date}
                          </span>
                          {project.end_date && (
                            <>
                              <span className="mx-2">|</span>
                              <span>Ended: {project.end_date}</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {project.location && (
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
                          <span className="ml-2">{project.location}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {project.full_description && (
                    <motion.button
                      onClick={() =>
                        setExpandedProject(
                          expandedProject === project.id ? null : project.id,
                        )
                      }
                      className="px-8 py-4 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transform hover:scale-105 transition-all duration-300 w-fit shadow-lg hover:shadow-xl"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {expandedProject === project.id
                        ? "🔼 Show Less"
                        : "🔽 View Full Details"}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedProject === project.id && project.full_description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden border-t border-gold-accent/20"
                >
                  <div className="p-8 lg:p-12 relative">
                    <div className="absolute inset-0 mandala-pattern opacity-5"></div>
                    <div
                      className="text-paragraph-text leading-relaxed text-lg relative z-10"
                      dangerouslySetInnerHTML={{
                        __html: project.full_description,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Projects;
