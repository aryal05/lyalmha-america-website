import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import logo from "../assets/images/logo/lyama (1) (1).png";
import fallbackBanner from "../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg";

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState("english");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Text content in both languages
  const textContent = {
    english: ["Welcome", "to", "Lyaymha", "America", "Guthi"],
    newari: ["ल्याय्म्ह", "अमेरिका", "गुथि", "यात", "स्वागत"],
  };

  // Featured Projects/Causes
  const featuredProjects = [
    {
      icon: "🎭",
      title: "Preserve Newari Culture",
      description:
        "Help us preserve and celebrate Newari culture for future generations. Your contribution supports cultural events, educational programs, and community initiatives.",
      stats: [
        { icon: "👥", label: "500+ Members" },
        { icon: "📊", label: "25+ Events Yearly" },
        { icon: "❤️", label: "Growing Strong" },
      ],
    },
    {
      icon: "🎪",
      title: "Biskaa Jatraa Festival",
      description:
        "Support our annual Biskaa Jatraa celebration, bringing the community together to honor our traditional New Year festival with authentic rituals and celebrations.",
      stats: [
        { icon: "🎉", label: "Annual Event" },
        { icon: "👨‍👩‍👧‍👦", label: "1000+ Attendees" },
        { icon: "🏛️", label: "Traditional Rituals" },
      ],
    },
    {
      icon: "👶",
      title: "Kids Cultural Programs",
      description:
        "Invest in the next generation. Our kids programs teach Newari language, traditional music, dance, and customs to keep our heritage alive.",
      stats: [
        { icon: "📚", label: "Weekly Classes" },
        { icon: "🎨", label: "Art & Music" },
        { icon: "🌟", label: "100+ Children" },
      ],
    },
    {
      icon: "🏠",
      title: "Community Center Fund",
      description:
        "Help us establish a permanent community center where we can host events, classes, and gatherings to strengthen our cultural bonds.",
      stats: [
        { icon: "🎯", label: "Goal: $500K" },
        { icon: "📈", label: "Growing Daily" },
        { icon: "🤝", label: "Community Owned" },
      ],
    },
  ];

  const validBanners = banners.filter(
    (banner) =>
      banner.image &&
      (banner.image.startsWith("http://") ||
        banner.image.startsWith("https://"))
  );

  const backgroundImages =
    validBanners.length > 0
      ? validBanners.map((banner) => getImageUrl(banner.image)).filter(Boolean)
      : [fallbackBanner];

  // Fetch banners from API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BANNERS.GET_BY_LOCATION("hero")
      );
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

  // Auto-change featured project every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animated text effect - word by word with smooth transitions
  useEffect(() => {
    const words = textContent[currentLanguage];
    setCurrentWordIndex(0);
    setIsTransitioning(true);

    // Fade in delay
    const fadeInTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    // Word progression
    let wordIdx = 0;
    const wordTimer = setInterval(() => {
      wordIdx++;
      if (wordIdx <= words.length) {
        setCurrentWordIndex(wordIdx);
      } else {
        clearInterval(wordTimer);

        // Hold complete text, then switch language
        setTimeout(() => {
          setCurrentLanguage((prev) =>
            prev === "english" ? "newari" : "english"
          );
        }, 3000);
      }
    }, 600);

    return () => {
      clearTimeout(fadeInTimer);
      clearInterval(wordTimer);
    };
  }, [currentLanguage]);

  const currentWords = textContent[currentLanguage];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background with Overlay */}
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/80 via-charcoal-black/70 to-charcoal-black"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-newari-red rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gold-accent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Premium Animated Title with Smooth Word Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4"
          >
            <div className="min-h-[100px] md:min-h-[120px] flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentLanguage}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-center"
                >
                  <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
                    {currentWords.map((word, index) => (
                      <motion.span
                        key={`${currentLanguage}-${index}`}
                        initial={{ opacity: 0, y: 50, rotateX: -90 }}
                        animate={{
                          opacity: index < currentWordIndex ? 1 : 0,
                          y: index < currentWordIndex ? 0 : 50,
                          rotateX: index < currentWordIndex ? 0 : -90,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.15,
                          type: "spring",
                          stiffness: 100,
                          damping: 12,
                        }}
                        className={
                          index < 2 ? "text-white" : "text-gold-accent"
                        }
                        style={{
                          display: "inline-block",
                          transformOrigin: "center bottom",
                          textShadow:
                            index >= 2
                              ? "0 0 30px rgba(242, 201, 76, 0.6), 0 0 60px rgba(242, 201, 76, 0.3)"
                              : "0 2px 10px rgba(0,0,0,0.5)",
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                </motion.h1>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base md:text-lg text-gold-accent font-semibold mb-8 flex items-center justify-center gap-2"
          >
            <span>🏛️</span>
            Celebrating Newari Culture in America
            <span>🎭</span>
          </motion.p>

          {/* Featured Project Slider */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="relative max-w-3xl w-full">
              {/* Decorative Corner Elements */}
              <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-gold-accent opacity-60"></div>
              <div className="absolute -top-3 -right-3 w-10 h-10 border-t-2 border-r-2 border-gold-accent opacity-60"></div>
              <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-2 border-l-2 border-newari-red opacity-60"></div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-newari-red opacity-60"></div>

              {/* Slider Container */}
              <div className="glass-effect rounded-2xl p-6 border-2 border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300 backdrop-blur-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProject}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Project Icon and Title */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-4xl">
                        {featuredProjects[currentProject].icon}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-gold-accent">
                        {featuredProjects[currentProject].title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-white mb-4 leading-relaxed">
                      {featuredProjects[currentProject].description}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 justify-center items-center">
                      {featuredProjects[currentProject].stats.map(
                        (stat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-gold-accent text-sm"
                          >
                            <span className="text-lg">{stat.icon}</span>
                            <span className="font-semibold">{stat.label}</span>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {featuredProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProject(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentProject === index
                          ? "bg-gold-accent w-6"
                          : "bg-gray-500 hover:bg-newari-red"
                      }`}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium CTA Buttons - Prominent Donate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-start mb-6 relative z-10"
          >
            {/* Donate Button - Prominent and Large with Dropdown */}
            <div
              className="relative z-20"
              onMouseEnter={() => setShowPaymentOptions(true)}
              onMouseLeave={() => setShowPaymentOptions(false)}
            >
              <a
                href="https://www.paypal.com/donate"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (showPaymentOptions) {
                    e.preventDefault();
                  }
                }}
                className="relative group overflow-hidden px-10 py-5 bg-gradient-to-r from-newari-red to-deep-maroon text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-newari-red hover:border-gold-accent inline-flex items-center"
              >
                <span className="relative z-10 flex items-center gap-3 text-xl">
                  <svg
                    className="w-7 h-7 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Donate Now
                  <svg
                    className={`w-6 h-6 transition-transform ${
                      showPaymentOptions ? "rotate-90" : ""
                    }`}
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
                </span>
                <div className="absolute inset-0 bg-gold-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </a>

              {/* Payment Options Dropdown */}
              <AnimatePresence>
                {showPaymentOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full mt-3 left-0 w-80 min-h-[300px] bg-charcoal-black/98 backdrop-blur-2xl rounded-xl p-4 border-2 border-gold-accent shadow-2xl shadow-gold-accent/30 z-[200] overflow-visible"
                  >
                    {/* Header */}
                    <div className="text-center mb-3 pb-3 border-b border-gold-accent/40">
                      <p className="text-gold-accent font-bold text-base flex items-center justify-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Choose Payment Method
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {/* Credit Card Option */}
                      <a
                        href="https://www.paypal.com/donate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3.5 rounded-lg bg-gradient-to-r from-dark-navy/90 to-dark-navy/70 hover:from-dark-navy hover:to-dark-navy transition-all duration-300 hover:scale-[1.02] border border-gold-accent/40 hover:border-gold-accent hover:shadow-lg hover:shadow-gold-accent/30"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-charcoal-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                            <path
                              fillRule="evenodd"
                              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-semibold text-sm">
                            Credit Card
                          </p>
                          <p className="text-gray-400 text-xs">
                            Visa, Mastercard, Amex
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-gold-accent group-hover:translate-x-1 transition-transform flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>

                      {/* PayPal Option */}
                      <a
                        href="https://www.paypal.com/donate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3.5 rounded-lg bg-gradient-to-r from-dark-navy/90 to-dark-navy/70 hover:from-dark-navy hover:to-dark-navy transition-all duration-300 hover:scale-[1.02] border border-gold-accent/40 hover:border-gold-accent hover:shadow-lg hover:shadow-gold-accent/30"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-charcoal-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-semibold text-sm">
                            PayPal
                          </p>
                          <p className="text-gray-400 text-xs">
                            Quick & Secure
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-gold-accent group-hover:translate-x-1 transition-transform flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>

                      {/* Bank Transfer Option */}
                      <a
                        href="mailto:info@lyalmha.org?subject=Bank Transfer Donation"
                        className="group flex items-center gap-3 p-3.5 rounded-lg bg-gradient-to-r from-dark-navy/90 to-dark-navy/70 hover:from-dark-navy hover:to-dark-navy transition-all duration-300 hover:scale-[1.02] border border-gold-accent/40 hover:border-gold-accent hover:shadow-lg hover:shadow-gold-accent/30"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-charcoal-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-semibold text-sm">
                            Bank Transfer
                          </p>
                          <p className="text-gray-400 text-xs">
                            Contact for details
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-gold-accent group-hover:translate-x-1 transition-transform flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Register Button */}
            <Link
              to="/contact"
              className="px-8 py-4 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                </svg>
                Register Here
              </span>
            </Link>

            {/* Explore Stories */}
            <Link
              to="/blogs"
              className="px-8 py-4 border-2 border-gold-accent text-gold-accent font-semibold rounded-xl hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Explore Stories
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
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
    </section>
  );
};

export default Hero
