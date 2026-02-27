import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl, getCrossOriginProps } from "../utils/imageHelper";
import logo from "../assets/images/logo/lyama (1) (1).png";
import MembershipRegistrationModal from "./MembershipRegistrationModal";

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed textContent and featuredProjects related state
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Filter banners with images and get their URLs
  const validBanners = banners.filter((banner) => banner.image);

  const backgroundImages =
    validBanners.length > 0
      ? validBanners.map((banner) => getImageUrl(banner.image)).filter(Boolean)
      : [];

  // Fetch banners from API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BANNERS.GET_BY_LOCATION("home"),
      );
      setBanners(response.data.data || []);
    } catch (error) {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-change background every 6 seconds
  useEffect(() => {
    if (backgroundImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden py-16 sm:py-20 bg-black">
      {/* Donate Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#181A20] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative border border-gold-accent"
            >
              <button
                onClick={() => setShowDonateModal(false)}
                className="absolute top-4 right-4 text-lg text-gold-accent hover:text-newari-red transition-colors"
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col items-center gap-4">
                <span className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <span className="inline-block">
                    <svg
                      className="w-7 h-7 text-pink-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                      <path d="M12 7a5 5 0 100 10 5 5 0 000-10z" />
                    </svg>
                  </span>
                  Payment Methods
                </span>
                <div className="flex flex-col gap-2 mt-4">
                  <span className="flex items-center gap-2 text-lg font-semibold text-gray-200">
                    <span className="inline-block">
                      <svg
                        className="w-6 h-6 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                        <path d="M17 9l-5 5-3-3" />
                      </svg>
                    </span>
                    Zelle (No Service Fee)
                  </span>
                  <span className="flex items-center gap-2 text-lg">
                    <span className="inline-block">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 4h16v16H4V4zm8 2a6 6 0 100 12 6 6 0 000-12z" />
                      </svg>
                    </span>
                    <a
                      href="mailto:LyaymhaAmerica@gmail.com"
                      className="text-green-300 underline hover:text-green-400 transition-colors"
                    >
                      LyaymhaAmerica@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Premium Background with Overlay */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {backgroundImages.length > 0 && (
              <img
                src={backgroundImages[currentBg]}
                alt="Cultural background"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay - Enhanced for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-newari-red rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-royal-blue rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-accent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>
      Content
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 flex flex-col items-center justify-center mt-32 md:mt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto"
        >
          {/* Donate Button - Primary CTA */}
          <motion.button
            type="button"
            onClick={() => setShowDonateModal(true)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-newari-red via-deep-maroon to-newari-red text-white font-bold rounded-xl shadow-2xl hover:shadow-newari-red/50 transition-all duration-300 border-2 border-newari-red hover:border-gold-accent flex items-center justify-center gap-3 text-base w-full sm:w-auto min-w-[200px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-accent/0 via-gold-accent/20 to-gold-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              className="w-6 h-6 animate-pulse relative z-10"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="relative z-10">Donate Now</span>
          </motion.button>

          {/* Register Button - Secondary CTA */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => setShowRegisterModal(true)}
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-gold-accent via-yellow-500 to-gold-accent text-charcoal-black font-bold rounded-xl shadow-2xl hover:shadow-gold-accent/50 transition-all duration-300 border-2 border-gold-accent hover:border-newari-red flex items-center justify-center gap-3 text-base w-full sm:w-auto min-w-[200px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-newari-red/0 via-newari-red/20 to-newari-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-6 h-6 relative z-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
              </svg>
              <span className="relative z-10">Life MemberShip</span>
            </button>
          </motion.div>

          {/* Explore Stories - Tertiary CTA */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/blogs"
              className="group relative overflow-hidden px-8 py-4 border-2 border-gold-accent text-gold-accent font-bold rounded-xl hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-gold-accent/30 flex items-center justify-center gap-3 text-base w-full sm:w-auto min-w-[200px] bg-black/40 backdrop-blur-sm"
            >
              <span className="relative z-10">Explore Stories</span>
              <svg
                className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      {/* Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-muted-text text-xs font-medium tracking-wider uppercase">
            Explore
          </span>
          <div className="w-5 h-8 border-2 border-gold-accent rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1 h-1 bg-gold-accent rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
      {/* Image Navigation Dots */}
      {backgroundImages.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-6 right-6 flex gap-2"
        >
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBg(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentBg
                  ? "bg-gold-accent w-6"
                  : "bg-border-line hover:bg-paragraph-text"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      )}
      {/* Membership Registration Modal */}
      <MembershipRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </section>
  );
};

export default Hero
