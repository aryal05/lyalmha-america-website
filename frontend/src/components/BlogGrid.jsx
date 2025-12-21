import React, { useState, useEffect } from 'react'
import BlogCard from './BlogCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { apiClient, API_ENDPOINTS } from "../config/api";

const BlogGrid = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOGS.GET_ALL);
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Featured slider blogs (first 3)
  const featuredBlogs = blogs.slice(0, 3);

  // Auto-slide effect
  useEffect(() => {
    if (featuredBlogs.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredBlogs.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredBlogs.length) % featuredBlogs.length
    );
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl animate-pulse">
            Loading blogs...
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="heading-xl mb-4">No blogs yet</h2>
          <p className="text-muted-text">
            Check back soon for amazing content!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-black relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gold-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-newari-red/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-4">
            Latest{" "}
            <span className="bg-gradient-to-r from-newari-red to-gold-accent bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-paragraph-text text-lg max-w-2xl mx-auto">
            Dive into the rich tapestry of Newari culture through our curated
            collection of articles, stories, and insights from our vibrant
            community.
          </p>
        </motion.div>

        {/* Premium Featured Slider */}
        {featuredBlogs.length > 0 && (
          <div className="mb-16 relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-premium group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <img
                    src={
                      featuredBlogs[currentSlide].banner
                        ? `http://localhost:5000${featuredBlogs[currentSlide].banner}`
                        : "https://via.placeholder.com/800x500"
                    }
                    alt={featuredBlogs[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/70 to-transparent"></div>

                  {/* Decorative Border */}
                  <div className="absolute inset-0 border-2 border-gold-accent/20 rounded-2xl"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block px-4 py-2 bg-gradient-to-r from-gold-accent to-gold-accent/80 text-charcoal-black text-sm font-bold rounded-full mb-4 shadow-gold"
                    >
                      ✨ {featuredBlogs[currentSlide].category}
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                    >
                      {featuredBlogs[currentSlide].title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-paragraph-text text-lg mb-6 max-w-3xl"
                    >
                      {featuredBlogs[currentSlide].excerpt}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center text-muted-text">
                        <span className="mr-4 font-medium">
                          By {featuredBlogs[currentSlide].author}
                        </span>
                        <span>
                          •{" "}
                          {new Date(
                            featuredBlogs[currentSlide].created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <Link to="/blogs" className="btn-gold">
                        Read More →
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Premium Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 glass-effect text-white rounded-full flex items-center justify-center hover:bg-gold-accent/20 hover:border-gold-accent transition-all duration-300 z-10 group"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 glass-effect text-white rounded-full flex items-center justify-center hover:bg-gold-accent/20 hover:border-gold-accent transition-all duration-300 z-10 group"
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              {/* Gold Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {featuredBlogs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? "bg-gradient-to-r from-gold-accent to-gold-accent/80 w-12 shadow-gold"
                        : "bg-white/40 w-8 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Premium Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(3).map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>

        {/* Premium Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-10 py-4 bg-transparent border-2 border-gold-accent text-gold-accent font-bold rounded-lg hover:bg-gold-accent hover:text-charcoal-black transform hover:scale-105 hover:shadow-gold transition-all duration-300 group"
          >
            Explore All Blogs
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogGrid
