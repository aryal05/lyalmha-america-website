import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/logo/lyama (1) (1).png'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/blogs', icon: '📝', label: 'Blogs' },
    { path: '/admin/team', icon: '👥', label: 'Team' },
    { path: '/admin/events', icon: '📅', label: 'Events' },
    { path: '/admin/supporters', icon: '🤝', label: 'Supporters' },
    { path: '/admin/banners', icon: '🖼️', label: 'Banners' }
  ]

  return (
    <div className="min-h-screen bg-deep-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-accent-gray border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-white font-bold text-lg">Lyalmha CMS</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-nepal-red text-white'
                  : 'text-gray-400 hover:bg-deep-black hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              <p className="text-white font-medium">{user?.email}</p>
              <p className="text-xs">Super Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-nepal-red transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-accent-gray border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h2>
            <Link
              to="/"
              target="_blank"
              className="px-4 py-2 bg-usa-blue text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
            >
              View Website →
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
