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

  // Text content in both languages
  const textContent = {
    english: ["Welcome", "to", "Lyalmha", "America"],
    newari: ["ल्याल्म्हा", "अमेरिकायात", "स्वागत", "जुयाः"],
  };

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Traditional Newari Logo with Mandala Background */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex justify-center mb-12"
          >
            <div className="relative">
              {/* Mandala Pattern Background */}
              <motion.div
                className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 -left-12 -top-12 md:-left-14 md:-top-14"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full mandala-pattern opacity-40"></div>
              </motion.div>

              {/* Traditional Corner Decorations */}
              <div className="absolute -top-8 -left-8 w-16 h-16 border-t-2 border-l-2 border-gold-accent opacity-60"></div>
              <div className="absolute -top-8 -right-8 w-16 h-16 border-t-2 border-r-2 border-gold-accent opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 border-b-2 border-l-2 border-gold-accent opacity-60"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 border-b-2 border-r-2 border-gold-accent opacity-60"></div>

              {/* Glowing Aura */}
              <div className="absolute inset-0 bg-gold-accent/30 rounded-full blur-2xl animate-pulse"></div>

              {/* Logo */}
              <img
                src={logo}
                alt="Lyalmha America Logo"
                className="relative h-40 w-40 md:h-52 md:w-52 object-contain drop-shadow-2xl z-10"
              />
            </div>
          </motion.div>

          {/* Premium Animated Title with Smooth Word Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <div className="min-h-[160px] md:min-h-[220px] flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentLanguage}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center"
                >
                  <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
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
            {/* Traditional Pagoda-Style Divider */}
            <motion.div
              className="flex justify-center mt-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2.5, duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-48">
                {/* Pagoda Roof Layers */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3, duration: 0.5 }}
                >
                  <div className="flex flex-col items-center gap-1">
                    {/* Top tier */}
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-transparent border-b-newari-red"></div>
                    {/* Middle tier */}
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[10px] border-transparent border-b-gold-accent"></div>
                    {/* Base tier */}
                    <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[12px] border-transparent border-b-newari-red"></div>
                  </div>
                </motion.div>

                {/* Decorative Line with Pattern */}
                <motion.div
                  className="h-1 w-full bg-gradient-to-r from-newari-red via-gold-accent to-newari-red rounded-full shadow-gold relative"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(242, 201, 76, 0.3)",
                      "0 0 20px rgba(242, 201, 76, 0.6)",
                      "0 0 10px rgba(242, 201, 76, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Traditional Pattern Overlays */}
                  <div className="absolute inset-0 flex justify-around items-center opacity-60\">
                    <div className="w-1 h-1 bg-newari-red rounded-full\"></div>
                    <div className="w-1 h-1 bg-gold-accent rounded-full\"></div>
                    <div className="w-1 h-1 bg-newari-red rounded-full\"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Subtitle with Icon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-xl md:text-3xl text-gold-accent font-semibold mb-4 flex items-center justify-center gap-3">
              <span className="text-2xl">🏛️</span>
              Celebrating Newari Culture in America
              <span className="text-2xl">🎭</span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base md:text-lg text-paragraph-text mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the rich heritage, vibrant traditions, colorful festivals,
            and inspiring stories of the Newari community thriving across the
            United States. Join us in preserving our cultural legacy for
            generations to come.
          </motion.p>

          {/* Premium CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link
              to="/blogs"
              className="btn-primary group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Our Stories
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
            <Link to="/culture" className="btn-secondary group">
              <span className="flex items-center gap-2">
                Discover Culture
                <svg
                  className="w-5 h-5 group-hover:rotate-12 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Stats/Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: "📚", label: "Cultural Stories", value: "Endless" },
              { icon: "🎉", label: "Festivals", value: "Year-Round" },
              { icon: "🤝", label: "Community", value: "Growing" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:bg-dark-navy/90 transition-all duration-300 hover:scale-105 group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-gold-accent font-bold text-2xl mb-1">
                  {stat.value}
                </div>
                <div className="text-paragraph-text text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-muted-text text-sm font-medium tracking-wider uppercase">
            Explore
          </span>
          <div className="w-6 h-10 border-2 border-gold-accent rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-gold-accent rounded-full"
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
          className="absolute bottom-10 right-10 flex gap-2"
        >
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBg(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBg
                  ? "bg-gold-accent w-8"
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
