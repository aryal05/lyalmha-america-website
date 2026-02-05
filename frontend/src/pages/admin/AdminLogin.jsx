import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/images/logo/lyama (1) (1).png'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-dark-navy to-charcoal-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="mandala-pattern absolute top-10 right-10 w-96 h-96 animate-spin-slow"></div>
        <div className="mandala-pattern absolute bottom-10 left-10 w-96 h-96 animate-spin-slow-reverse"></div>
      </div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 temple-corner opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 temple-corner opacity-10 rotate-180"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card-premium relative overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

          {/* Corner Decorations */}
          <div className="absolute top-0 right-0 w-24 h-24 temple-corner opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 temple-corner opacity-20 rotate-180"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block"
              >
                <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-accent/20 to-newari-red/20 p-1 shadow-lg shadow-gold-accent/20">
                  <div className="w-full h-full bg-gradient-to-br from-dark-navy to-charcoal-black rounded-full flex items-center justify-center p-3">
                    <motion.img
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      src={logo}
                      alt="Lyaymha America Guthi"
                      className="w-full h-full object-contain drop-shadow-gold"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-white via-gold-accent to-white bg-clip-text text-transparent mb-2"
              >
                Admin Login
              </motion.h2>
              <p className="text-gold-accent/60 font-medium">
                Lyaymha America Guthi CMS
              </p>
              <div className="pagoda-divider opacity-30 mt-4"></div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-newari-red/10 border border-newari-red/50 text-newari-red px-4 py-3 rounded-lg mb-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="username"
                  className="block text-gold-accent/80 mb-2 font-semibold flex items-center gap-2"
                >
                  <span className="text-lg">👤</span>
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-all duration-300 placeholder-muted-text"
                  placeholder="admin"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="password"
                  className="block text-gold-accent/80 mb-2 font-semibold flex items-center gap-2"
                >
                  <span className="text-lg">🔒</span>
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-all duration-300 placeholder-muted-text"
                  placeholder="Enter your password"
                />
              </motion.div>

              <div className="pagoda-divider opacity-20 my-4"></div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-newari-red to-gold-accent text-white font-bold rounded-lg hover:shadow-lg hover:shadow-newari-red/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                      <motion.span
                        className="inline-block"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-accent to-newari-red opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-muted-text text-sm flex items-center justify-center gap-2">
                <span className="text-gold-accent">🔐</span>
                Authorized personnel only
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin
