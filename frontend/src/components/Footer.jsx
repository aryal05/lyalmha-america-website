import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo from '../assets/images/logo/lyama (1) (1).png'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer-bg border-t border-border-line relative overflow-hidden">
      {/* Decorative Background with Mandala Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="mandala-pattern w-full h-full"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-accent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-newari-red rounded-full blur-3xl"></div>
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
                <div className="relative">
                  <div className="absolute inset-0 bg-gold-accent/20 rounded-full blur-xl"></div>
                  <img
                    src={logo}
                    alt="Lyalmha America"
                    className="relative h-16 w-16 drop-shadow-2xl"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-text">
                    Lyalmha America
                  </h3>
                  <p className="text-gold-accent font-semibold text-sm">
                    Newari Culture & Heritage
                  </p>
                </div>
              </div>
              <p className="text-muted-text mb-6 max-w-md leading-relaxed">
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
                  },
                  {
                    icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                    label: "Twitter",
                  },
                  {
                    icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
                    label: "Instagram",
                  },
                  {
                    icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                    label: "YouTube",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-dark-navy border border-border-line rounded-lg flex items-center justify-center text-gold-accent hover:text-charcoal-black hover:bg-gold-accent hover:border-gold-accent transition-all duration-300 group"
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
              <h4 className="text-primary-text font-bold mb-6 text-lg">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {["Home", "Blogs", "Culture", "About Us", "Contact"].map(
                  (item, index) => (
                    <li key={index}>
                      <Link
                        to={`/${item.toLowerCase().replace(" ", "")}`}
                        className="text-paragraph-text hover:text-gold-accent transition-colors duration-300 flex items-center group"
                      >
                        <span className="text-gold-accent mr-2 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                        {item}
                      </Link>
                    </li>
                  )
                )}
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
              <h4 className="text-primary-text font-bold mb-6 text-lg">
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  "Events",
                  "Festivals",
                  "Community",
                  "Support Us",
                  "Newsletter",
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to="#"
                      className="text-paragraph-text hover:text-gold-accent transition-colors duration-300 flex items-center group"
                    >
                      <span className="text-gold-accent mr-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                      {item}
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
              <h4 className="text-primary-text font-bold mb-6 text-lg">
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
                    <p className="text-muted-text text-xs uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:info@lyalmha-america.org"
                      className="text-paragraph-text hover:text-gold-accent transition-colors"
                    >
                      info@lyalmha-america.org
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-muted-text text-xs uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+15551234567"
                      className="text-paragraph-text hover:text-gold-accent transition-colors"
                    >
                      +1 (555) 123-4567
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
                    <p className="text-muted-text text-xs uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-paragraph-text">
                      United States of America
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
              className="text-muted-text text-sm text-center md:text-left"
            >
              © {currentYear}{" "}
              <span className="text-gold-accent font-semibold">
                Lyalmha America
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
                className="text-paragraph-text hover:text-gold-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-paragraph-text hover:text-gold-accent transition-colors"
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
