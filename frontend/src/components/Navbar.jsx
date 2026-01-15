import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/logo/Letter pad copy.jpg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation with navbar offset
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          const navbarHeight = 100; // Account for navbar height
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location]);

  const handleSubmenuClick = (e, path) => {
    e.preventDefault();
    const [pathname, hash] = path.split("#");

    if (location.pathname === pathname && hash) {
      // Already on the page, just scroll to section
      const element = document.getElementById(hash);
      if (element) {
        const navbarHeight = 100; // Account for navbar height
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // Navigate to the page with hash
      navigate(path);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    {
      path: "/about",
      label: "About Us",
      hasDropdown: true,
      submenu: [
        { path: "/about#executive", label: "Executive Members" },
        { path: "/about#projects", label: "Project Biska" },
        { path: "/about#advisors", label: "Advisors" },
      ],
    },
    {
      path: "/news",
      label: "News & Press",
      hasDropdown: true,
      submenu: [
        { path: "/news", label: "News" },
        { path: "/blogs", label: "Blogs" },
        { path: "/gallery", label: "Gallery" },
      ],
    },
    { path: "/culture", label: "Culture" },
    { path: "/kids-activities", label: "Kids Activities" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50"
          : "bg-white/70 backdrop-blur-lg"
      }`}
    >
      {/* Subtle Mandala Pattern Overlay */}
      {scrolled && (
        <div className="absolute inset-0 mandala-pattern opacity-5 pointer-events-none"></div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* Premium Logo with Letterpad Image */}
          <Link to="/" className="flex items-center group relative py-1">
            <div className="relative">
              {/* Traditional Corner Accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-gold-accent/0 group-hover:border-gold-accent/60 transition-all duration-300 rounded-tl"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-gold-accent/0 group-hover:border-gold-accent/60 transition-all duration-300 rounded-br"></div>

              <div className="absolute inset-0 bg-gold-accent/10 rounded-xl blur-xl group-hover:bg-gold-accent/30 transition-all duration-500"></div>
              <img
                src={logo}
                alt="Lyaymha America Guthi"
                className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[380px] sm:max-w-[480px] md:max-w-[580px] lg:max-w-[680px] relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl object-contain bg-white rounded-xl px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 shadow-2xl border-2 border-gold-accent/20 group-hover:border-gold-accent/50"
              />
            </div>
          </Link>

          {/* Premium Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group/dropdown">
                <Link to={link.path} className="relative px-4 py-2 group block">
                  <span
                    className={`relative z-10 font-semibold transition-colors duration-300 ${
                      isActive(link.path)
                        ? "text-royal-blue"
                        : "text-primary-text hover:text-royal-blue"
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <svg
                        className="inline-block w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>

                  {/* Pagoda-Style Active Indicator */}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
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

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 bg-white border-2 border-royal-blue/30 rounded-xl shadow-2xl overflow-hidden">
                    {link.submenu.map((sublink, index) => (
                      <a
                        key={sublink.path}
                        href={sublink.path}
                        onClick={(e) => handleSubmenuClick(e, sublink.path)}
                        className="block px-4 py-3 text-gray-900 hover:text-royal-blue hover:bg-royal-blue/10 transition-all duration-300 border-b border-gray-200 last:border-b-0 cursor-pointer font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-newari-red"></span>
                          {sublink.label}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
