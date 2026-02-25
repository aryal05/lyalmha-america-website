import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";

const AboutHero = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.BANNERS.GET_BY_LOCATION("about"),
      );
      const bannersData = response.data.data || [];
      setBanners(bannersData.length > 0 ? bannersData : []);
    } catch (error) {
      setBanners([]);
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

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={activeBanner?.image ? getImageUrl(activeBanner.image) : ""}
          alt="About Lyaymha America Guthi"
          style={{ display: activeBanner?.image ? "block" : "none" }}
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/95 via-royal-blue/90 to-cream-white/95"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #C4161C 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, #1F3C88 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-pure-white">About </span>
            <span className="text-newari-red">Lyaymha</span>
            <span className="text-gold-accent"> America</span>
          </h1>
          <p className="text-2xl md:text-3xl text-cream-white mb-6">
            ल्याय्​म्ह अमेरिका गुथी
          </p>
          <div className="pagoda-divider w-64 mx-auto mb-6"></div>
          <p className="text-xl text-pure-white/90 max-w-3xl mx-auto">
            Our focus is on the younger generation, as they are the future
            bearers of our legacy and identity. We strive to educate and raise
            awareness among our children about our culture, language, and
            festivals.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
