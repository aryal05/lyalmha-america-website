import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import KidsActivities from "../components/KidsActivities";
import ScrollToTop from "../components/ScrollToTop";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";

const KidsActivitiesPage = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-cycle through banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BANNERS.GET_BY_LOCATION("kids-activities"),
      );
      setBanners(response.data.data || []);
    } catch (error) {
      // silently handle
    }
  };

  const activeBanner = banners[currentBanner];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <Navbar />

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {activeBanner?.image && (
            <img
              src={getImageUrl(activeBanner.image)}
              alt="Kids Activities Banner"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/90 to-cream-white"></div>
          <div className="absolute inset-0 mandala-pattern opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="relative inline-block mb-6">
              {/* Decorative Cultural Patterns */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-gold-accent/40 rounded-tl-lg"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-gold-accent/40 rounded-tr-lg"></div>

              <h1 className="text-5xl md:text-7xl font-bold text-white px-8">
                Kids{" "}
                <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                  Activities
                </span>
              </h1>

              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-gold-accent/40 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gold-accent/40 rounded-br-lg"></div>
            </div>

            {/* Pagoda Divider */}
            <div className="flex justify-center mb-6">
              <div className="pagoda-divider w-64"></div>
            </div>

            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Facilitate children's workshops to educate and raise awareness
              about our culture, language, arts, and music through various
              activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <KidsActivities />
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default KidsActivitiesPage;
