import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import EventsSidebar from "./EventsSidebar";

const BlogGrid = () => {
  const [activeBlog, setActiveBlog] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STORIES.GET_ALL);
      setStories(response.data.data || []);
    } catch (error) {
      // Improved error logging for debugging
      console.error("Error fetching stories:", error);
      if (error.response) {
        console.error("Response:", error.response);
      } else if (error.request) {
        console.error("Request:", error.request);
      } else {
        console.error("Message:", error.message);
      }
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  // Featured list (first 2)
  const featuredStories = stories.slice(0, 2);

  const openBlog = (blog) => setActiveBlog(blog);
  const closeBlog = () => setActiveBlog(null);

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

  if (stories.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-charcoal-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="heading-xl mb-4">No stories yet</h2>
          <p className="text-muted-text">
            Check back soon for amazing content!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-gray-900 to-charcoal-black relative overflow-hidden">
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
          <p className="text-cream-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
            Dive into the rich tapestry of Newari culture through our curated
            collection of articles, stories, and insights from our vibrant
            community.
          </p>
        </motion.div>

        {/* Layout: Left = Latest Stories + Blog Grid, Right = EventsSidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left: Latest Stories + Blog Grid */}
          <div className="lg:col-span-2">
            {/* Latest Stories list (first 3) */}
            {featuredStories.length > 0 && (
              <div className="space-y-6 mb-10">
                {featuredStories.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-3xl overflow-hidden bg-white shadow-lg h-full"
                  >
                    <div className="md:flex md:items-stretch h-full">
                      {/* Left: Image */}
                      <div className="md:w-1/2 w-full h-56 md:h-auto flex flex-col">
                        {story.banner ? (
                          <img
                            src={getImageUrl(story.banner)}
                            alt={story.title}
                            className="w-full h-full object-cover min-h-56 flex-1"
                            style={{ height: "100%" }}
                          />
                        ) : (
                          <div className="w-full h-full min-h-56 flex-1 bg-gray-100" />
                        )}
                      </div>

                      {/* Right: Content */}
                      <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-between h-full">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-semibold rounded-full shadow-sm mb-4">
                          {story.category || "Featured"}
                        </span>

                        <h3 className="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
                          {story.title}
                        </h3>

                        <div className="w-14 h-1 bg-gold-accent rounded-full mb-6" />

                        <p className="text-paragraph-text mb-6 max-w-xl">
                          {story.excerpt}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-muted-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-gold-accent"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <div className="text-xs text-muted-text">
                                Started
                              </div>
                              <div className="font-medium text-charcoal-black">
                                {new Date(story.created_at).getFullYear() ||
                                  "—"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-muted-text">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-newari-red"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 0011.314-11.314l-4.657 4.657z"
                              />
                            </svg>
                            <div>
                              <div className="text-xs text-muted-text">
                                Location
                              </div>
                              <div className="font-medium text-charcoal-black">
                                {story.location || "Online"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            onClick={() => openBlog(story)}
                            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white font-semibold rounded-lg shadow-md"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Remaining blog cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {stories.slice(2).map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          </div>

          {/* Right: Events Sidebar (reuse component from AboutUs) */}
          <div className="lg:col-span-1">
            <EventsSidebar />
          </div>
        </div>

        {/* Read More Modal */}
        {activeBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60" onClick={closeBlog} />
            <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-xl z-10">
              {activeBlog.banner && (
                <img
                  src={getImageUrl(activeBlog.banner)}
                  alt={activeBlog.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{activeBlog.title}</h2>
                <div className="text-muted-text text-sm mb-4">
                  By {activeBlog.author} •{" "}
                  {new Date(activeBlog.created_at).toLocaleDateString()}
                </div>
                <div className="prose max-w-none text-paragraph-text">
                  {/* Prefer `content` if available, fallback to excerpt */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: activeBlog.content || activeBlog.excerpt,
                    }}
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeBlog}
                    className="px-6 py-3 bg-gray-200 rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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

export default BlogGrid;
