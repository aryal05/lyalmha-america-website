import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/images/logo/lyama (1) (1).png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-royal-blue border-t border-gold-accent/20 relative overflow-hidden">
      {/* Decorative Background with Mandala Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="mandala-pattern w-full h-full"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-accent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bright-blue rounded-full blur-3xl"></div>
      </div>

      {/* Traditional Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-accent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Section - Takes more space */}
          <div className="col-span-1 md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white rounded-full p-1 flex-shrink-0 overflow-hidden">
                  <img
                    src={logo}
                    alt="Lyaymha America Guthi"
                    className="h-24 w-24 object-contain scale-150"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-pure-white">
                    Lyaymha America Guthi
                  </h3>
                  <p className="text-gold-accent font-semibold text-sm">
                    Newari Culture & Heritage
                  </p>
                </div>
              </div>
              <p className="text-cream-white/90 mb-6 max-w-md leading-relaxed">
                Connecting and celebrating Newari heritage across America. Join
                us in preserving our rich cultural traditions, vibrant
                festivals, and timeless values for future generations.
              </p>

              {/* Premium Social Media Links */}
              <div className="flex gap-3">
                {[
                  {
                    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                    label: "Facebook",
                    url: "https://www.facebook.com/LyaymhaAmerica/",
                  },
                  {
                    icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                    label: "Twitter",
                    url: "#",
                  },
                  {
                    icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                    label: "YouTube",
                    url: "https://www.youtube.com/@LyaymhaAmerica",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-bright-blue/20 border border-gold-accent/30 rounded-lg flex items-center justify-center text-gold-accent hover:text-royal-blue hover:bg-gold-accent hover:border-gold-accent transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Blogs", path: "/blogs" },
                  {
                    name: "Culture & Tradition",
                    path: "/culture-and-tradition",
                  },
                  { name: "About Us", path: "/about" },
                  { name: "Contact", path: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-cream-white/90 hover:text-gold-accent transition-colors duration-300 flex items-center group"
                    >
                      <span className="text-gold-accent mr-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-white font-bold mb-6 text-lg">Resources</h4>
              <ul className="space-y-3">
                {[
                  { name: "Kids Activities", path: "/kids-activities" },
                  { name: "News", path: "/news" },
                  { name: "Gallery", path: "/gallery" },
                  {
                    name: "Culture & Tradition",
                    path: "/culture-and-tradition",
                  },
                  { name: "Contact", path: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-cream-white/90 hover:text-gold-accent transition-colors duration-300 flex items-center group"
                    >
                      <span className="text-gold-accent mr-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-white font-bold mb-6 text-lg">
                Get in Touch
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="w-10 h-10 bg-dark-navy rounded-lg flex items-center justify-center text-gold-accent mr-3 group-hover:bg-gold-accent group-hover:text-charcoal-black transition-all duration-300 flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-cream-white/60 text-xs uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:lyaymhaAmerica@gmail.com"
                      className="text-cream-white/90 hover:text-gold-accent transition-colors"
                    >
                      lyaymhaAmerica@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="w-10 h-10 bg-dark-navy rounded-lg flex items-center justify-center text-gold-accent mr-3 group-hover:bg-gold-accent group-hover:text-charcoal-black transition-all duration-300 flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-cream-white/60 text-xs uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-cream-white/90">
                      Virginia City, VA, United States
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Premium Bottom Bar */}
        <div className="pt-8 border-t border-border-line/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-cream-white/70 text-sm text-center md:text-left"
            >
              © {currentYear}{" "}
              <span className="text-gold-accent font-semibold">
                Lyaymha America Guthi
              </span>
              . All rights reserved.
              <span className="hidden md:inline">
                {" "}
                | Established{" "}
                <span className="text-newari-red font-semibold">2020</span>
              </span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-6 text-sm"
            >
              <Link
                to="/privacy"
                className="text-cream-white/90 hover:text-gold-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-cream-white/90 hover:text-gold-accent transition-colors"
              >
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
