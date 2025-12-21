import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../config/api";

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TEAM.GET_ALL);
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const teamCategories = [
    {
      title: "Executive Team",
      description:
        "Our dedicated leadership team guiding Lyaymha America's vision and mission",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      color: "nepal-red",
      category: "Executive",
    },
    {
      title: "Advisors",
      description:
        "Experienced mentors providing strategic guidance and cultural expertise",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      color: "usa-blue",
      category: "Advisors",
    },
    {
      title: "Life Members",
      description:
        "Committed supporters who have made a lasting impact on our community",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      color: "nepal-red",
      category: "Life Members",
    },
  ];

  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-white mb-8">
          Our <span className="text-nepal-red">Team</span>
        </h2>
        <p className="text-gray-400">Loading team members...</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-white mb-8">
        Our <span className="text-nepal-red">Team</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {teamCategories.map((team, index) => {
          const membersCount = teamMembers.filter(
            (m) => m.category === team.category
          ).length;
          const isExpanded = expandedCategory === team.category;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-accent-gray rounded-xl p-6 hover:shadow-lg hover:shadow-nepal-red/20 transition-all duration-300 group cursor-pointer ${
                isExpanded ? "ring-2 ring-nepal-red" : ""
              }`}
              onClick={() => toggleCategory(team.category)}
            >
              <div
                className={`w-16 h-16 bg-${team.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{team.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
                {team.title}
              </h3>
              <p className="text-gray-300 text-sm mb-2">{team.description}</p>
              {membersCount > 0 && (
                <p className="text-gray-400 text-xs">
                  {membersCount} member{membersCount > 1 ? "s" : ""}
                </p>
              )}
              <button className="mt-4 text-usa-blue font-semibold hover:text-nepal-red transition-colors duration-300 inline-flex items-center">
                {isExpanded ? "Show Less" : "Learn More"}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : "group-hover:translate-x-2"
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isExpanded ? (
                    <path d="M5 15l7-7 7 7"></path>
                  ) : (
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  )}
                </svg>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Team Members Details Section */}
      <AnimatePresence mode="wait">
        {expandedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className="bg-gradient-to-br from-accent-gray to-deep-black rounded-2xl p-8 border border-nepal-red/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {
                    teamCategories.find((t) => t.category === expandedCategory)
                      ?.title
                  }
                  <span className="text-nepal-red"> Members</span>
                </h3>
                <button
                  onClick={() => setExpandedCategory(null)}
                  className="text-gray-400 hover:text-nepal-red transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers
                  .filter((member) => member.category === expandedCategory)
                  .map((member, idx) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-deep-black/50 rounded-xl p-6 border border-gray-700 hover:border-nepal-red/50 transition-all duration-300"
                    >
                      {/* Member Avatar */}
                      <div className="w-20 h-20 bg-gradient-to-br from-nepal-red to-usa-blue rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-white text-2xl font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>

                      {/* Member Info */}
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-white mb-1">
                          {member.name}
                        </h4>
                        <p className="text-usa-blue text-sm font-semibold mb-3">
                          {member.role}
                        </p>
                        {member.bio && (
                          <p className="text-gray-400 text-xs leading-relaxed">
                            {member.bio}
                          </p>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-block mt-3 text-nepal-red text-xs hover:underline"
                          >
                            Contact
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>

              {teamMembers.filter((m) => m.category === expandedCategory)
                .length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    No members in this category yet.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Teams;
