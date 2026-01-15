import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS } from '../../config/api'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    team: 0,
    events: 0,
    supporters: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [blogs, team, events, supporters] = await Promise.all([
        apiClient.get(API_ENDPOINTS.BLOGS.GET_ADMIN_ALL),
        apiClient.get(API_ENDPOINTS.TEAM.GET_ALL),
        apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL),
        apiClient.get(API_ENDPOINTS.SUPPORTERS.GET_ALL)
      ])

      setStats({
        blogs: blogs.data.data.length,
        team: team.data.data.length,
        events: events.data.data.length,
        supporters: supporters.data.data.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Blogs",
      value: stats.blogs,
      icon: "📝",
      color: "newari-red",
      link: "/admin/blogs",
    },
    {
      title: "Team Members",
      value: stats.team,
      icon: "👥",
      color: "gold-accent",
      link: "/admin/team",
    },
    {
      title: "Events",
      value: stats.events,
      icon: "📅",
      color: "newari-red",
      link: "/admin/events",
    },
    {
      title: "Supporters",
      value: stats.supporters,
      icon: "🤝",
      color: "gold-accent",
      link: "/admin/supporters",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-royal-blue text-xl animate-pulse font-semibold">
            Loading dashboard...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="mandala-pattern absolute top-0 right-0 w-64 h-64 animate-spin-slow"></div>
        </div>

        {/* Premium Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-accent to-newari-red flex items-center justify-center shadow-lg shadow-gold-accent/20">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="heading-xl !text-3xl text-royal-blue">
                Welcome back!
              </h1>
              <p className="text-paragraph-text font-medium">
                Here's what's happening with your website today
              </p>
            </div>
          </div>
          <div className="pagoda-divider opacity-30 my-4"></div>
        </motion.div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.a
              key={card.title}
              href={card.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium group hover:border-gold-accent/50 hover:shadow-lg hover:shadow-gold-accent/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5 mandala-pattern group-hover:opacity-10 transition-opacity"></div>

              {/* Temple Corner Decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 temple-corner opacity-10 group-hover:opacity-20 transition-opacity"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${
                      card.color === "newari-red"
                        ? "from-newari-red/20 to-newari-red/5"
                        : "from-gold-accent/20 to-gold-accent/5"
                    } shadow-lg`}
                  >
                    {card.icon}
                  </motion.div>
                  <motion.span
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className={`text-${
                      card.color
                    } text-4xl font-bold bg-gradient-to-r ${
                      card.color === "newari-red"
                        ? "from-newari-red to-gold-accent"
                        : "from-gold-accent to-newari-red"
                    } bg-clip-text text-transparent drop-shadow-lg`}
                  >
                    {card.value}
                  </motion.span>
                </div>
                <h3 className="text-muted-text text-sm font-semibold uppercase tracking-wider">
                  {card.title}
                </h3>
                <div className="pagoda-divider opacity-20 mt-3"></div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Premium Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border-2 border-gray-300 rounded-xl p-6 hover:border-royal-blue transition-all duration-300 shadow-lg relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-newari-red to-gold-accent rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-royal-blue">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.a
                whileHover={{ y: -4 }}
                href="/admin/blogs"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-white to-blue-50/30 border-2 border-gray-300 rounded-lg hover:border-newari-red hover:shadow-md transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-newari-red/0 via-newari-red/5 to-newari-red/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 bg-gradient-to-br from-newari-red/20 to-newari-red/5 rounded-lg group-hover:scale-110 transition-transform shadow-lg relative z-10">
                  <span className="text-3xl">📝</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-royal-blue font-semibold group-hover:text-newari-red transition-colors flex items-center gap-2">
                    New Blog Post
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </h3>
                  <p className="text-paragraph-text text-sm">
                    Create a new article
                  </p>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ y: -4 }}
                href="/admin/events"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-white to-blue-50/30 border-2 border-gray-300 rounded-lg hover:border-gold-accent hover:shadow-md transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold-accent/0 via-gold-accent/5 to-gold-accent/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 bg-gradient-to-br from-gold-accent/20 to-gold-accent/5 rounded-lg group-hover:scale-110 transition-transform shadow-lg relative z-10">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-royal-blue font-semibold group-hover:text-gold-accent transition-colors flex items-center gap-2">
                    Add Event
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </h3>
                  <p className="text-paragraph-text text-sm">
                    Schedule new event
                  </p>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ y: -4 }}
                href="/admin/team"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-white to-blue-50/30 border-2 border-gray-300 rounded-lg hover:border-newari-red hover:shadow-md transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-newari-red/0 via-newari-red/5 to-newari-red/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-3 bg-gradient-to-br from-newari-red/20 to-newari-red/5 rounded-lg group-hover:scale-110 transition-transform shadow-lg relative z-10">
                  <span className="text-3xl">👥</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-royal-blue font-semibold group-hover:text-newari-red transition-colors flex items-center gap-2">
                    Add Team Member
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </h3>
                  <p className="text-paragraph-text text-sm">
                    Manage your team
                  </p>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard
