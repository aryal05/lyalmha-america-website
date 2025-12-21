import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import logo from "../assets/images/logo/lyama (1) (1).png";

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use banners from database - handle both local and Cloudinary URLs
  const backgroundImages = banners
    .map((banner) => getImageUrl(banner.image))
    .filter(Boolean);

  // Fetch banners from API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BANNERS.GET_BY_LOCATION("hero")
      );
      console.log("Hero banners response:", response.data.data);
      setBanners(response.data.data || []);
    } catch (error) {
      console.error("Error fetching hero banners:", error);
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sliding Background Images */}
      <div className="absolute inset-0">
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
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-deep-black/75"></div>
      </div>

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #C4161C 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, #1F3C88 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <img
              src={logo}
              alt="Lyalmha America Logo"
              className="h-48 w-48 object-contain"
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">Welcome to </span>
            <span className="text-nepal-red">Lyalmha</span>
            <span className="text-usa-blue"> America</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Celebrating and Preserving Newari Culture in America
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Discover the rich heritage, traditions, festivals, and stories of
            the Newari community thriving in the United States. Join us on a
            journey through culture, cuisine, and community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/blogs"
              className="px-8 py-4 bg-nepal-red text-white font-semibold rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-nepal-red/50"
            >
              Explore Blogs
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-usa-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-usa-blue/50"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center"
        >
          <span className="text-gray-400 text-sm mb-2">Scroll Down</span>
          <svg
            className="w-6 h-6 text-nepal-red"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero
