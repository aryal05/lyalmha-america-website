import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from "framer-motion";
import logo from "../../assets/images/logo/lyama (1) (1).png";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/blogs", icon: "📝", label: "Blogs" },
    { path: "/admin/stories", icon: "📖", label: "Latest Stories" },
    { path: "/admin/news", icon: "📰", label: "News" },
    { path: "/admin/team", icon: "👥", label: "Team" },
    { path: "/admin/events", icon: "📅", label: "Events" },
    { path: "/admin/supporters", icon: "🤝", label: "Supporters" },
    { path: "/admin/banners", icon: "🖼️", label: "Banners" },
    { path: "/admin/gallery", icon: "🎨", label: "Gallery" },
    { path: "/admin/contacts", icon: "✉️", label: "Messages" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50 flex relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="mandala-pattern animate-spin-slow absolute top-10 right-10 w-96 h-96"></div>
        <div className="mandala-pattern animate-spin-slow-reverse absolute bottom-10 left-10 w-96 h-96"></div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-royal-blue/95 via-royal-blue to-royal-blue/95 backdrop-blur-xl border-r border-gold-accent/30 flex flex-col relative shadow-2xl">
        {/* Decorative Top Corner */}
        <div className="absolute top-0 left-0 w-full h-20 temple-corner opacity-20 pointer-events-none"></div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-gold-accent/20 relative"
        >
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.img
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              src={logo}
              alt="Logo"
              className="w-12 h-12 object-contain drop-shadow-gold"
            />
            <div>
              <h1 className="text-white font-bold text-lg bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                Lyalmha CMS
              </h1>
              <p className="text-gold-accent/60 text-xs font-medium">
                Admin Panel
              </p>
            </div>
          </Link>
          {/* Pagoda Divider */}
          <div className="pagoda-divider opacity-30 mt-4"></div>
        </motion.div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 relative">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-newari-red to-gold-accent text-white shadow-lg shadow-newari-red/30"
                      : "text-gold-accent/70 hover:text-white hover:bg-gold-accent/10"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-newari-red to-gold-accent"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <span className="text-xl relative z-10 transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-medium relative z-10">
                    {item.label}
                  </span>
                  {!isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gold-accent group-hover:h-full transition-all duration-300"></span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 border-t border-gold-accent/20 relative backdrop-blur-sm"
        >
          <div className="card-premium !bg-gradient-to-r from-gold-accent/5 to-newari-red/5 p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gold-accent/70 flex-1 min-w-0">
                <p className="text-white font-semibold truncate text-sm">
                  {user?.email}
                </p>
                <p className="text-xs bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent font-bold">
                  Super Admin
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 ml-2 bg-newari-red/20 text-newari-red hover:bg-newari-red hover:text-white rounded-lg transition-all duration-300 shadow-lg"
                title="Logout"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
          {/* Decorative Bottom Corner */}
          <div className="absolute bottom-0 right-0 w-32 h-32 temple-corner opacity-10 pointer-events-none rotate-180"></div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-dark-navy/90 via-charcoal-black/90 to-dark-navy/90 backdrop-blur-xl border-b border-gold-accent/20 px-8 py-4 shadow-lg relative overflow-hidden"
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="mandala-pattern w-full h-full"></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-white text-2xl font-bold bg-gradient-to-r from-white via-gold-accent to-white bg-clip-text text-transparent">
                {menuItems.find((item) => item.path === location.pathname)
                  ?.label || "Admin"}
              </h2>
              <div className="pagoda-divider opacity-40 mt-1 w-24"></div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                target="_blank"
                className="px-6 py-2.5 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 text-sm font-semibold flex items-center gap-2"
              >
                <span>View Website</span>
                <span className="text-lg">→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 relative">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout
