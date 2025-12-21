import React, { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/logo/lyama (1) (1).png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/blogs", label: "Blogs" },
    { path: "/culture", label: "Culture" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-charcoal-black/95 backdrop-blur-lg shadow-premium border-b border-border-line/30"
          : "bg-transparent"
      }`}
    >
      {/* Subtle Mandala Pattern Overlay */}
      {scrolled && (
        <div className="absolute inset-0 mandala-pattern opacity-5 pointer-events-none"></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo with Traditional Corners */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
              {/* Traditional Corner Accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-gold-accent/0 group-hover:border-gold-accent/60 transition-all duration-300 rounded-tl"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-gold-accent/0 group-hover:border-gold-accent/60 transition-all duration-300 rounded-br"></div>

              <div className="absolute inset-0 bg-gold-accent/20 rounded-full blur-xl group-hover:bg-gold-accent/30 transition-all duration-300"></div>
              <img
                src={logo}
                alt="Lyalmha America"
                className="h-14 w-14 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-primary-text group-hover:text-gold-accent transition-colors duration-300">
                Lyalmha America
              </h1>
              <p className="text-xs text-gold-accent font-medium">
                Newari Culture & Heritage
              </p>
            </div>
          </Link>

          {/* Premium Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 group"
              >
                <span
                  className={`relative z-10 font-medium transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-gold-accent"
                      : "text-paragraph-text group-hover:text-gold-accent"
                  }`}
                >
                  {link.label}
                </span>

                {/* Pagoda-Style Active Indicator */}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    {/* Pagoda Roof */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[5px] border-transparent border-b-newari-red"></div>
                    </div>
                    {/* Gradient Line */}
                    <div className="h-0.5 bg-gradient-to-r from-newari-red via-gold-accent to-newari-red"></div>
                  </motion.div>
                )}

                {/* Traditional Corner Accents on Hover */}
                <span className="absolute inset-0 rounded-lg transition-all duration-300 group-hover:shadow-[inset_0_0_0_1px_rgba(242,201,76,0.2)]"></span>
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-accent/0 group-hover:border-gold-accent/40 transition-all duration-300 rounded-tl"></span>
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-accent/0 group-hover:border-gold-accent/40 transition-all duration-300 rounded-br"></span>
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              to="/contact"
              className="ml-4 btn-secondary !py-2 !px-6 text-sm"
            >
              Get Involved
            </Link>
          </div>

          {/* Premium Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 rounded-lg bg-dark-navy border border-border-line text-gold-accent focus:outline-none focus:ring-2 focus:ring-gold-accent transition-all duration-300 hover:bg-gold-accent/10"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-center justify-center w-full h-full space-y-1.5">
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="w-5 h-0.5 bg-current transition-all"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-current transition-all"
              />
              <motion.span
                animate={
                  mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="w-5 h-0.5 bg-current transition-all"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-effect border-t border-border-line/30"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 px-4 rounded-lg font-medium transition-all duration-300 relative ${
                      isActive(link.path)
                        ? "bg-gold-accent/20 text-gold-accent border-l-4 border-gold-accent"
                        : "text-paragraph-text hover:text-gold-accent hover:bg-dark-navy/50 hover:translate-x-2"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                    {/* Small decorative corner for active state */}
                    {isActive(link.path) && (
                      <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-newari-red rounded-tr"></span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-4"
              >
                <Link
                  to="/contact"
                  className="block btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Involved
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar
