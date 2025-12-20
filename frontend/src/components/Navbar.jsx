import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/images/logo/lyama (1) (1).png'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-accent-gray/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src={logo}
              alt="Lyalmha America"
              className="h-14 w-14 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Lyalmha America</h1>
              <p className="text-xs text-nepal-red">Newari Culture Blog</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-nepal-red transition-colors duration-300 font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-nepal-red transition-colors duration-300 font-medium">
              About Us
            </Link>
            <Link to="/blogs" className="text-white hover:text-nepal-red transition-colors duration-300 font-medium">
              Blogs
            </Link>
            <Link to="/culture" className="text-white hover:text-nepal-red transition-colors duration-300 font-medium">
              Culture
            </Link>
            <Link to="/contact" className="text-white hover:text-nepal-red transition-colors duration-300 font-medium">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
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
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-accent-gray"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-white hover:text-nepal-red transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-white hover:text-nepal-red transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/blogs"
              className="block py-2 text-white hover:text-nepal-red transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to="/culture"
              className="block py-2 text-white hover:text-nepal-red transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Culture
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-white hover:text-nepal-red transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
