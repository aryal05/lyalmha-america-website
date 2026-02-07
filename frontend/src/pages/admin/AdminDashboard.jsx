import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from "react-router-dom";
import { apiClient, API_ENDPOINTS } from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    team: 0,
    events: 0,
    supporters: 0,
    memberships: 0,
    rsvps: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogs, team, events, supporters, memberships, rsvps, messages] =
        await Promise.all([
          apiClient
            .get(API_ENDPOINTS.BLOGS.GET_ADMIN_ALL)
            .catch(() => ({ data: { data: [] } })),
          apiClient
            .get(API_ENDPOINTS.TEAM.GET_ALL)
            .catch(() => ({ data: { data: [] } })),
          apiClient
            .get(API_ENDPOINTS.EVENTS.GET_ALL)
            .catch(() => ({ data: { data: [] } })),
          apiClient
            .get(API_ENDPOINTS.SUPPORTERS.GET_ALL)
            .catch(() => ({ data: { data: [] } })),
          apiClient
            .get(API_ENDPOINTS.MEMBERSHIP.GET_STATS)
            .catch(() => ({ data: { data: { total: 0 } } })),
          apiClient
            .get(API_ENDPOINTS.RSVP.GET_ALL)
            .catch(() => ({ data: { data: [] } })),
          apiClient
            .get(API_ENDPOINTS.CONTACT.GET_ALL)
            .catch(() => ({ data: { data: [] } })),
        ]);

      const messagesData = messages.data.data || [];
      const unreadCount = messagesData.filter(
        (m) => m.status === "unread",
      ).length;

      setStats({
        blogs: blogs.data.data?.length || 0,
        team: team.data.data?.length || 0,
        events: events.data.data?.length || 0,
        supporters: supporters.data.data?.length || 0,
        memberships: memberships.data.data?.total || 0,
        rsvps: rsvps.data.data?.length || 0,
        messages: messagesData.length,
        unreadMessages: unreadCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const mainStats = [
    {
      title: "Total Blogs",
      value: stats.blogs,
      icon: "📝",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/blogs",
    },
    {
      title: "Team Members",
      value: stats.team,
      icon: "👥",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      link: "/admin/team",
    },
    {
      title: "Events",
      value: stats.events,
      icon: "📅",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/events",
    },
    {
      title: "RSVPs",
      value: stats.rsvps,
      icon: "✅",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      link: "/admin/rsvps",
    },
  ];

  const secondaryStats = [
    {
      title: "Memberships",
      value: stats.memberships,
      icon: "🎫",
      color: "from-rose-500 to-rose-600",
      link: "/admin/membership",
    },
    {
      title: "Messages",
      value: stats.messages,
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
      icon: "✉️",
      color: "from-cyan-500 to-cyan-600",
      link: "/admin/contacts",
    },
    {
      title: "Supporters",
      value: stats.supporters,
      icon: "🤝",
      color: "from-indigo-500 to-indigo-600",
      link: "/admin/supporters",
    },
  ];

  // Calculate percentages for the bar chart
  const maxValue = Math.max(
    stats.blogs,
    stats.events,
    stats.rsvps,
    stats.memberships,
    1,
  );
  const chartData = [
    { label: "Blogs", value: stats.blogs, color: "bg-blue-500" },
    { label: "Events", value: stats.events, color: "bg-purple-500" },
    { label: "RSVPs", value: stats.rsvps, color: "bg-amber-500" },
    { label: "Members", value: stats.memberships, color: "bg-rose-500" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-royal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-royal-blue text-xl font-semibold animate-pulse">
              Loading dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="mandala-pattern absolute top-0 right-0 w-96 h-96 animate-spin-slow"></div>
          <div
            className="mandala-pattern absolute bottom-0 left-0 w-64 h-64 animate-spin-slow"
            style={{ animationDirection: "reverse" }}
          ></div>
        </div>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative z-10"
        >
          <div className="flex items-center gap-4 mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center shadow-lg shadow-gold-accent/30"
            >
              <span className="text-3xl">👋</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-royal-blue">
                Welcome back, Admin!
              </h1>
              <p className="text-paragraph-text font-medium">
                Here's what's happening with your website today
              </p>
            </div>
          </div>
          <div className="pagoda-divider opacity-30 my-4"></div>
        </motion.div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-royal-blue hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-2xl">{stat.icon}</span>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-right"
                    >
                      <motion.span
                        key={stat.value}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-royal-blue block"
                      >
                        {stat.value}
                      </motion.span>
                    </motion.div>
                  </div>
                  <h3 className="text-gray-600 font-semibold group-hover:text-royal-blue transition-colors">
                    {stat.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gold-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View details</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Middle Section: Chart + Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-royal-blue transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-gold-accent to-newari-red rounded-full"></div>
              <h2 className="text-xl font-bold text-royal-blue">
                Content Overview
              </h2>
            </div>

            <div className="space-y-6">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-20 text-sm font-medium text-gray-600">
                    {item.label}
                  </div>
                  <div className="flex-1 h-10 bg-gray-100 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.max((item.value / maxValue) * 100, 5)}%`,
                      }}
                      transition={{
                        duration: 1,
                        delay: 0.6 + index * 0.1,
                        ease: "easeOut",
                      }}
                      className={`h-full ${item.color} rounded-full relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="w-12 text-right font-bold text-royal-blue"
                  >
                    {item.value}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Mini Stats Row */}
            <div className="mt-8 pt-6 border-t-2 border-gray-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-royal-blue to-gold-accent bg-clip-text text-transparent">
                  {stats.blogs + stats.events}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Total Content
                </p>
              </div>
              <div className="text-center border-x-2 border-gray-100">
                <p className="text-2xl font-bold bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                  {stats.rsvps + stats.memberships}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Registrations
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-newari-red to-purple-500 bg-clip-text text-transparent">
                  {stats.team + stats.supporters}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Team & Partners
                </p>
              </div>
            </div>
          </motion.div>

          {/* Secondary Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {secondaryStats.map((stat, index) => (
              <Link
                key={stat.title}
                to={stat.link}
                className="block bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-royal-blue hover:shadow-lg transition-all duration-300 group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-royal-blue">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  {stat.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-8 h-8 bg-newari-red text-white rounded-full flex items-center justify-center font-bold text-sm animate-pulse"
                    >
                      {stat.badge}
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            ))}

            {/* Circular Progress for Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-royal-blue to-gold-accent rounded-xl p-5 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80 font-medium">
                    Response Rate
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.messages > 0
                      ? Math.round(
                          ((stats.messages - stats.unreadMessages) /
                            stats.messages) *
                            100,
                        )
                      : 100}
                    %
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {stats.messages - stats.unreadMessages} of {stats.messages}{" "}
                    read
                  </p>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white/20"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-white"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 220" }}
                      animate={{
                        strokeDasharray: `${stats.messages > 0 ? ((stats.messages - stats.unreadMessages) / stats.messages) * 220 : 220} 220`,
                      }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-royal-blue transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-gradient-to-b from-newari-red to-gold-accent rounded-full"></div>
            <h2 className="text-xl font-bold text-royal-blue">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "New Blog Post",
                desc: "Create article",
                icon: "📝",
                link: "/admin/blogs",
                color: "hover:border-blue-400 hover:bg-blue-50",
              },
              {
                title: "Add Event",
                desc: "Schedule event",
                icon: "📅",
                link: "/admin/events",
                color: "hover:border-purple-400 hover:bg-purple-50",
              },
              {
                title: "View RSVPs",
                desc: "Check registrations",
                icon: "✅",
                link: "/admin/rsvps",
                color: "hover:border-amber-400 hover:bg-amber-50",
              },
              {
                title: "Messages",
                desc: `${stats.unreadMessages} unread`,
                icon: "✉️",
                link: "/admin/contacts",
                color: "hover:border-cyan-400 hover:bg-cyan-50",
              },
            ].map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className={`flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl transition-all duration-300 group ${action.color}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all"
                  >
                    <span className="text-2xl">{action.icon}</span>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-royal-blue group-hover:text-gold-accent transition-colors flex items-center gap-2">
                      {action.title}
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </h3>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard
