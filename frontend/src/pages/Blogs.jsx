import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import fallbackBanner from "../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg";

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, bannerRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.BLOGS.GET_ALL),
          apiClient.get(API_ENDPOINTS.BANNERS.GET_BY_LOCATION("blogs")),
        ]);

        const blogsData = blogsRes.data.data || blogsRes.data;
        setBlogPosts(Array.isArray(blogsData) ? blogsData : []);

        console.log("Blogs banner response:", bannerRes.data.data);
        const banners = bannerRes.data.data || [];
        if (banners.length > 0) {
          setHeroBanner(banners[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-deep-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              heroBanner?.image ? getImageUrl(heroBanner.image) : fallbackBanner
            }
            alt="Blog Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-deep-black/85"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-nepal-red">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stories, insights, and updates from our community's journey in
              preserving and celebrating Newari culture
            </p>
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nepal-red"></div>
              <p className="text-gray-400 mt-4">Loading blogs...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No blogs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-accent-gray rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-nepal-red/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={`http://localhost:5000${post.banner}`}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
                    <span className="absolute top-4 left-4 px-3 py-1 bg-nepal-red text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-400 text-sm mb-2">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        By {post.author}
                      </span>
                      <button className="text-usa-blue font-semibold hover:text-nepal-red transition-colors duration-300">
                        Read More →
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
