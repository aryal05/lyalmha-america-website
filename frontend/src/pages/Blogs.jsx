import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, bannerRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.BLOGS.GET_ALL),
          apiClient.get(API_ENDPOINTS.BANNERS.GET_BY_LOCATION("blogs")),
        ]);

        const blogsData = blogsRes.data.data || blogsRes.data;
        setBlogPosts(Array.isArray(blogsData) ? blogsData : []);

        const bannersData = bannerRes.data.data || [];
        setBanners(bannersData.length > 0 ? bannersData : []);
      } catch (error) {
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-cycle through banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const activeBanner = banners[currentBanner];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
      <Navbar />

      {/* Premium Hero Section with Cultural Elements */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Mandala Pattern */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeBanner?.image ? getImageUrl(activeBanner.image) : ""}
            alt="Blog Background"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            style={{ display: activeBanner?.image ? "block" : "none" }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/90 to-cream-white"></div>
          <div className="absolute inset-0 mandala-pattern opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {/* Title with Traditional Corner Decorations */}
            <div className="relative inline-block mb-6">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-gold-accent/40 rounded-tl-lg"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-gold-accent/40 rounded-tr-lg"></div>

              <h1 className="text-5xl md:text-6xl font-bold text-white px-8">
                Our{" "}
                <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                  Stories
                </span>
              </h1>

              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-gold-accent/40 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gold-accent/40 rounded-br-lg"></div>
            </div>

            {/* Pagoda Divider */}
            <div className="flex justify-center mb-6">
              <div className="pagoda-divider w-64"></div>
            </div>

            <p className="text-xl text-paragraph-text  text-white max-w-3xl mx-auto">
              Stories, insights, and updates from our community's journey in
              preserving and celebrating newari culture
            </p>
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-accent"></div>
              <p className="text-muted-text mt-4">Loading blogs...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-text text-lg">No blogs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => navigate(`/blogs/${post.id}`)}
                  className="card-premium group cursor-pointer hover:border-gold-accent/50 hover:shadow-gold transition-all duration-500 temple-corner"
                >
                  {/* Premium Blog Image with Cultural Overlays */}
                  <div className="relative h-56 overflow-hidden rounded-t-xl">
                    {/* Mandala Pattern Overlay */}
                    <div className="absolute inset-0 mandala-pattern opacity-20 z-10 pointer-events-none"></div>

                    <img
                      src={getImageUrl(post.banner)}
                      alt={post.title}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-20"></div>

                    {/* Premium Category Badge */}
                    <span className="absolute top-4 left-4 px-4 py-1.5 bg-gold-accent text-charcoal-black text-xs font-bold rounded-lg shadow-lg uppercase tracking-wider z-30">
                      {post.category}
                    </span>

                    {/* Traditional Corner Accents */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold-accent/30 to-transparent rounded-bl-3xl z-30">
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-newari-red"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-newari-red/20 to-transparent rounded-tr-3xl z-30">
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold-accent"></div>
                    </div>
                  </div>

                  {/* Premium Blog Content */}
                  <div className="p-6">
                    {/* Date with Icon */}
                    <div className="flex items-center gap-2 text-muted-text text-sm mb-3">
                      <svg
                        className="w-4 h-4 text-gold-accent"
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
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary-text mb-3 group-hover:text-gold-accent transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-paragraph-text text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between pt-4 border-t border-border-line">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gold-accent to-newari-red rounded-full flex items-center justify-center text-charcoal-black font-bold text-xs">
                          {post.author?.charAt(0) || "L"}
                        </div>
                        <span className="text-sm text-muted-text">
                          {post.author || "Lyalmha"}
                        </span>
                      </div>
                      <button className="text-gold-accent font-semibold hover:text-newari-red transition-colors duration-300 flex items-center gap-1 group/btn">
                        Read
                        <svg
                          className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
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
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blogs;
