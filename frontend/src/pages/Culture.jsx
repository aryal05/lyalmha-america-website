import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import fallbackBanner from "../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg";

const Culture = () => {
  const [festivals, setFestivals] = useState([]);
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetchCultureData();
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

  const fetchCultureData = async () => {
    try {
      const [festivalsRes, traditionsRes, bannerRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.CULTURE.GET_FESTIVALS),
        apiClient.get(API_ENDPOINTS.CULTURE.GET_TRADITIONS),
        apiClient.get(API_ENDPOINTS.BANNERS.GET_BY_LOCATION("culture")),
      ]);

      console.log("Culture banner response:", bannerRes.data.data);
      console.log("Festivals response:", festivalsRes.data.data);
      setFestivals(festivalsRes.data.data || []);
      setTraditions(traditionsRes.data.data || []);

      const banners = bannerRes.data.data || [];
      setBanners(banners.length > 0 ? banners : []);
    } catch (error) {
      console.error("Error fetching culture data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
      <Navbar />

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              activeBanner?.image
                ? getImageUrl(activeBanner.image)
                : fallbackBanner
            }
            alt="Culture Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-royal-blue/95 via-royal-blue/90 to-cream-white"></div>
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
                Newari{" "}
                <span className="bg-gradient-to-r from-newari-red to-gold-accent bg-clip-text text-transparent">
                  Culture
                </span>
              </h1>

              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-gold-accent/40 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gold-accent/40 rounded-br-lg"></div>
            </div>

            {/* Pagoda Divider */}
            <div className="flex justify-center mb-6">
              <div className="pagoda-divider w-64"></div>
            </div>

            <p className="text-xl text-paragraph-text max-w-3xl mx-auto">
              Discover the rich heritage, traditions, and festivals that define
              the Newari civilization
            </p>
          </motion.div>

          {/* Premium Major Festivals */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12"
            >
              <span className="text-white">Major</span>{" "}
              <span className="text-gold-accent">Festivals</span>
            </motion.h2>
            {loading ? (
              <p className="text-muted-text text-center animate-pulse">
                Loading festivals...
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {festivals.map((festival, index) => {
                  const highlights = festival.highlights
                    ? JSON.parse(festival.highlights)
                    : [];
                  return (
                    <motion.div
                      key={festival.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.6 }}
                      className="card-premium group hover:border-gold-accent/50 hover:shadow-gold transition-all duration-500 temple-corner"
                    >
                      {festival.image && (
                        <div className="relative h-56 overflow-hidden rounded-t-xl">
                          {/* Mandala Pattern Overlay */}
                          <div className="absolute inset-0 mandala-pattern opacity-20 z-10"></div>

                          <img
                            src={getImageUrl(festival.image)}
                            alt={festival.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/50 to-transparent z-20"></div>

                          {/* Gold Corner Accent with Traditional Pattern */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold-accent/30 to-transparent rounded-bl-3xl z-30">
                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-newari-red"></div>
                          </div>

                          {/* Bottom Left Cultural Accent */}
                          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-newari-red/20 to-transparent rounded-tr-3xl z-30">
                            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold-accent"></div>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="heading-md mb-3 group-hover:text-gold-accent transition-colors">
                          {festival.title}
                        </h3>
                        <p className="text-paragraph-text mb-4 leading-relaxed">
                          {festival.description}
                        </p>
                        {highlights.length > 0 && (
                          <div className="space-y-2 pt-4 border-t border-border-line">
                            {highlights.map((highlight, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-sm text-muted-text group-hover:text-paragraph-text transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 mr-2 text-gold-accent flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {highlight}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Premium Cultural Traditions */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12"
            >
              <span className="text-white">Our</span>{" "}
              <span className="text-gold-accent">Traditions</span>
            </motion.h2>
            {loading ? (
              <p className="text-muted-text text-center animate-pulse">
                Loading traditions...
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {traditions.map((tradition, index) => (
                  <motion.div
                    key={tradition.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="card-premium group hover:border-newari-red/50 hover:shadow-premium transition-all duration-500 text-center"
                  >
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {tradition.icon}
                    </div>
                    <h3 className="heading-md mb-3 group-hover:text-newari-red transition-colors duration-300">
                      {tradition.title}
                    </h3>
                    <p className="text-paragraph-text text-sm leading-relaxed">
                      {tradition.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Premium About Newari Civilization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 card-premium border-gold-accent/30 bg-gradient-to-br from-dark-navy/50 to-charcoal-black/50"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-accent"></div>
              <h2 className="heading-lg text-center">
                The{" "}
                <span className="text-gold-accent">Newari Civilization</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-accent"></div>
            </div>
            <div className="space-y-4 text-paragraph-text leading-relaxed">
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-gold-accent first-letter:mr-2 first-letter:float-left">
                The Newari people are the indigenous inhabitants of the
                Kathmandu Valley in Nepal, with a rich cultural heritage
                spanning over two millennia. Our civilization has contributed
                significantly to art, architecture, trade, and culture in the
                Himalayan region.
              </p>
              <p>
                The Dyou-Kha (chariot) symbolizes our civilization prior to the
                invention of wheels in human history, carried on human shoulders
                as a testament to our ancestors' ingenuity and community spirit.
              </p>
              <p>
                In America, we continue to preserve and celebrate these
                traditions, ensuring that future generations remain connected to
                their roots while embracing their new homeland.
              </p>
            </div>

            {/* Decorative Border */}
            <div className="mt-8 pt-8 border-t border-gold-accent/20 text-center">
              <p className="text-sm text-muted-text italic">
                "Preserving our heritage for generations to come"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Culture;
