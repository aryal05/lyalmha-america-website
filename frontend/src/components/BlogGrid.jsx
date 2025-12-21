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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-deep-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl">Loading blogs...</div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-deep-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">No blogs yet</h2>
          <p className="text-gray-400">Check back soon for amazing content!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-deep-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Latest <span className="text-nepal-red">Stories</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dive into the rich tapestry of Newari culture through our curated
            collection of articles, stories, and insights from our vibrant
            community.
          </p>
        </motion.div>

        {/* Featured Slider */}
        {featuredBlogs.length > 0 && (
          <div className="mb-16 relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <span className="inline-block px-4 py-2 bg-nepal-red text-white text-sm font-semibold rounded-full mb-4">
                      {featuredBlogs[currentSlide].category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {featuredBlogs[currentSlide].title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                      {featuredBlogs[currentSlide].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400">
                        <span className="mr-4">
                          By {featuredBlogs[currentSlide].author}
                        </span>
                        <span>
                          •{" "}
                          {new Date(
                            featuredBlogs[currentSlide].created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        to="/blogs"
                        className="inline-block px-6 py-3 bg-usa-blue text-white rounded-lg hover:bg-nepal-red transition-colors duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-nepal-red transition-all duration-300 z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-nepal-red transition-all duration-300 z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {featuredBlogs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-nepal-red w-8"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(3).map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/blogs"
            className="inline-block px-8 py-4 bg-transparent border-2 border-nepal-red text-nepal-red font-semibold rounded-lg hover:bg-nepal-red hover:text-white transform hover:scale-105 transition-all duration-300"
          >
            Explore All Blogs
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogGrid
