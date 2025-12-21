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
    { title: 'Total Blogs', value: stats.blogs, icon: '📝', color: 'nepal-red', link: '/admin/blogs' },
    { title: 'Team Members', value: stats.team, icon: '👥', color: 'usa-blue', link: '/admin/team' },
    { title: 'Events', value: stats.events, icon: '📅', color: 'nepal-red', link: '/admin/events' },
    { title: 'Supporters', value: stats.supporters, icon: '🤝', color: 'usa-blue', link: '/admin/supporters' }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Here's what's happening with your website today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.a
              key={card.title}
              href={card.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-accent-gray rounded-xl p-6 hover:shadow-xl hover:shadow-nepal-red/10 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{card.icon}</span>
                <span className={`text-${card.color} text-3xl font-bold group-hover:scale-110 transition-transform`}>
                  {card.value}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
            </motion.a>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent-gray rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/blogs"
              className="flex items-center space-x-3 p-4 bg-deep-black rounded-lg hover:bg-nepal-red/10 transition-colors group"
            >
              <span className="text-2xl">📝</span>
              <div>
                <h3 className="text-white font-medium group-hover:text-nepal-red transition-colors">New Blog Post</h3>
                <p className="text-gray-400 text-sm">Create a new article</p>
              </div>
            </a>
            <a
              href="/admin/events"
              className="flex items-center space-x-3 p-4 bg-deep-black rounded-lg hover:bg-usa-blue/10 transition-colors group"
            >
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="text-white font-medium group-hover:text-usa-blue transition-colors">Add Event</h3>
                <p className="text-gray-400 text-sm">Schedule new event</p>
              </div>
            </a>
            <a
              href="/admin/team"
              className="flex items-center space-x-3 p-4 bg-deep-black rounded-lg hover:bg-nepal-red/10 transition-colors group"
            >
              <span className="text-2xl">👥</span>
              <div>
                <h3 className="text-white font-medium group-hover:text-nepal-red transition-colors">Add Team Member</h3>
                <p className="text-gray-400 text-sm">Manage your team</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
