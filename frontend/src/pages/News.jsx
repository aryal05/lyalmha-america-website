import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { apiClient, API_ENDPOINTS } from '../config/api'
import { getImageUrl } from '../utils/imageHelper'
import { Link } from 'react-router-dom'

const News = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetchNews();
    fetchBanners();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NEWS.GET_ALL);
      setNews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BANNERS.GET_BY_LOCATION("news")
      );
      setBanners(response.data.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  // Auto-cycle through banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const activeBanner = banners[currentBanner];

  const categories = [
    "all",
    "announcement",
    "press-release",
    "media-coverage",
    "event",
  ];
  const filteredNews =
    selectedCategory === "all"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        {/* Background Banner Image */}
        {activeBanner && (
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(activeBanner.image)}
              alt="News Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/90 to-cream-white"></div>
          </div>
        )}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-newari-red/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 mandala-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-gold-accent to-gold-accent/80 rounded-full shadow-gold"
            >
              <svg
                className="w-10 h-10 text-charcoal-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">News & </span>
              <span className="text-gold-accent">Press</span>
            </h1>
            <p className="text-xl text-cream-white/90 max-w-3xl mx-auto leading-relaxed">
              Stay updated with our latest announcements, press releases, and
              media coverage about Lyaymha America Guthi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gold-accent text-white shadow-gold"
                  : "bg-white text-gray-700 hover:text-royal-blue border-2 border-gray-300 hover:border-royal-blue hover:shadow-md"
              }`}
            >
              {category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredNews.map((item, index) => (
                <Link to={`/news/${item.id}`} key={item.id}>
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-premium group hover:border-gold-accent/50 transition-all duration-300 cursor-pointer h-full"
                  >
                    {item.image && (
                      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-gold-accent text-charcoal-black text-xs font-semibold rounded-full">
                            {item.category.split("-").join(" ")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-paragraph-text mb-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(item.published_date)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-primary-text mb-3 group-hover:text-gold-accent transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-paragraph-text mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border-line">
                      <span className="text-sm text-paragraph-text">
                        {formatDate(item.published_date)}
                      </span>
                      <span className="text-gold-accent hover:text-gold-accent/80 transition-colors font-medium text-sm">
                        Read More →
                      </span>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-paragraph-text text-lg">
              No news articles found in this category.
            </p>
          </div>
        )}
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default News
