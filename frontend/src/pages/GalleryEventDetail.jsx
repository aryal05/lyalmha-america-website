import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { API_URL } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";

const GalleryEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromTab = searchParams.get("from") || "";
  const backUrl = fromTab ? `/gallery?tab=${fromTab}` : "/gallery";
  const [images, setImages] = useState([]);
  const [event, setEvent] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      // Fetch event details with images in a single request
      const res = await fetch(`${API_URL}/api/admin/events/${id}`);
      const data = await res.json();

      if (data.success && data.data) {
        setEvent(data.data);
        // Extract images from the response (excluding thumbnail)
        const eventImages = data.data.images || [];
        setImages(
          eventImages
            .filter((img) => !img.is_thumbnail)
            .map((img) => img.image_url),
        );
      } else {
        setEvent(null);
        setImages([]);
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      setEvent(null);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (selectedImageIndex === -1) {
      setSelectedImageIndex(0);
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex === -1) {
      setSelectedImageIndex(images.length - 1);
    } else if (selectedImageIndex === 0) {
      setSelectedImageIndex(-1);
    } else {
      setSelectedImageIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-royal-blue font-semibold text-xl animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h2 className="text-3xl font-bold text-royal-blue mb-4">
            Event not found
          </h2>
          <button
            onClick={() => navigate(backUrl)}
            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold"
          >
            ← Back to Gallery
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
      <Navbar />

      {/* Hero Section with Event Info */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/90 to-cream-white z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-blue/20 rounded-full blur-3xl z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={() => navigate(backUrl)}
              className="inline-flex items-center gap-2 text-cream-white hover:text-gold-accent transition-colors mb-6"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Gallery
            </button>
          </motion.div>
        </div>
      </section>

      {/* Thumbnail Image Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        {event?.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
            onClick={() => openLightbox(-1)}
          >
            <img
              src={
                event.image.startsWith("http")
                  ? event.image
                  : `${API_URL}${event.image}`
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </section>

      {/* Event Title and Description */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-royal-blue">
            {event?.title}
          </h1>

          {event?.description && (
            <p className="text-xl text-paragraph-text max-w-3xl mx-auto mb-6">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-paragraph-text">
            {event?.event_date && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gold-accent"
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
                <span>
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    timeZone: "America/New_York",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {event.event_time &&
                    (() => {
                      const [hours, minutes] = event.event_time.split(":");
                      const hour = parseInt(hours, 10);
                      const ampm = hour >= 12 ? "PM" : "AM";
                      const hour12 = hour % 12 || 12;
                      return ` at ${hour12}:${minutes} ${ampm} ET`;
                    })()}
                </span>
              </div>
            )}

            {event?.location && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gold-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Other Gallery Images */}
      {images.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-royal-blue text-center mb-8">
            Gallery Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`${event.title} - Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gold-accent transition-colors z-10"
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

            {/* Previous Button */}
            {(selectedImageIndex === -1
              ? images.length > 0
              : images.length > 1) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white hover:text-gold-accent transition-colors z-10"
              >
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  selectedImageIndex === -1
                    ? event.image.startsWith("http")
                      ? event.image
                      : `${API_URL}${event.image}`
                    : getImageUrl(images[selectedImageIndex])
                }
                alt={
                  selectedImageIndex === -1
                    ? event.title
                    : `${event.title} - Image ${selectedImageIndex + 1}`
                }
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                {selectedImageIndex === -1
                  ? "Main Image"
                  : `${selectedImageIndex + 1} / ${images.length}`}
              </div>
            </motion.div>

            {/* Next Button */}
            {(selectedImageIndex === -1
              ? images.length > 0
              : images.length > 1) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white hover:text-gold-accent transition-colors z-10"
              >
                <svg
                  className="w-12 h-12"
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default GalleryEventDetail;
