import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { apiClient, API_ENDPOINTS } from '../config/api'
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageHelper";

const Gallery = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("past");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [pastRes, upcomingRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.EVENTS.GET_PAST),
        apiClient.get(API_ENDPOINTS.EVENTS.GET_UPCOMING)
      ]);
      setPastEvents(pastRes.data.data || []);
      setUpcomingEvents(upcomingRes.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayEvents = filter === "past" ? pastEvents : upcomingEvents;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        {/* Blue gradient overlay matching Contact/Culture pages */}
        <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/90 to-cream-white z-0"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-blue/20 rounded-full blur-3xl z-0" />
        <div className="absolute inset-0 mandala-pattern opacity-5 pointer-events-none z-0" />

        {/* Decorative corner patterns */}
        <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-gold-accent/30 z-0"></div>
        <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-gold-accent/30 z-0"></div>

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
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Photo </span>
              <span className="text-gold-accent">Gallery</span>
            </h1>
            <p className="text-xl text-cream-white/90 max-w-3xl mx-auto leading-relaxed">
              Capturing moments of celebration, tradition, and community spirit
              through our cultural events and activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter("past")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === "past"
                ? "bg-gold-accent text-white shadow-gold"
                : "bg-white text-gray-700 hover:text-royal-blue border-2 border-gray-300 hover:border-royal-blue hover:shadow-md"
            }`}
          >
            Past Events
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === "upcoming"
                ? "bg-gold-accent text-white shadow-gold"
                : "bg-white text-gray-700 hover:text-royal-blue border-2 border-gray-300 hover:border-royal-blue hover:shadow-md"
            }`}
          >
            Upcoming Events
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {displayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate(`/gallery/event/${event.id}`)}
                >
                  {/* Image Section */}
                  <div className="aspect-square overflow-hidden">
                    {event.image ? (
                      <img
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-royal-blue to-newari-red flex items-center justify-center">
                        <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Info Section - Always Visible */}
                  <div className="bg-white p-4 border-t-2 border-gold-accent group-hover:border-newari-red transition-colors">
                    <h3 className="text-primary-text font-bold text-lg mb-2 group-hover:text-gold-accent transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-paragraph-text text-sm line-clamp-2 mb-2">
                        {event.description}
                      </p>
                    )}
                    <p className="text-gold-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && displayEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-paragraph-text text-lg">
              No {filter} events found.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold-accent transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={getImageUrl(selectedImage.image)}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-xl mb-2">
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Gallery
