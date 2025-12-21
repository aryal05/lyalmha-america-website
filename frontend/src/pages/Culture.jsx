import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";

const Culture = () => {
  const [festivals, setFestivals] = useState([]);
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroBanner, setHeroBanner] = useState(null);

  useEffect(() => {
    fetchCultureData();
  }, []);

  const fetchCultureData = async () => {
    try {
      const [festivalsRes, traditionsRes, bannerRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.CULTURE.GET_FESTIVALS),
        apiClient.get(API_ENDPOINTS.CULTURE.GET_TRADITIONS),
        apiClient.get(API_ENDPOINTS.BANNERS.GET_BY_LOCATION("culture")),
      ]);

      console.log("Culture banner response:", bannerRes.data.data);
      console.log("Festivals response:", festivalsRes.data.data);

      // Use database festivals or fallback to static data
      const dbFestivals = festivalsRes.data.data || [];
      const staticFestivals = [
        {
          id: "static-1",
          title: "Dashain",
          description:
            "The longest and most auspicious festival in Nepal, celebrating the victory of good over evil.",
          image:
            "https://images.unsplash.com/photo-1604055933218-4c3e72c4e1fa?w=800&h=600&fit=crop",
          highlights: JSON.stringify([
            "15 days of celebration",
            "Family gatherings",
            "Traditional blessings",
          ]),
        },
        {
          id: "static-2",
          title: "Tihar",
          description:
            "The festival of lights, honoring different animals and the bond between brothers and sisters.",
          image:
            "https://images.unsplash.com/photo-1605811774534-8f4e6b93e16b?w=800&h=600&fit=crop",
          highlights: JSON.stringify([
            "Festival of lights",
            "Worship of Laxmi",
            "Bhai Tika ceremony",
          ]),
        },
        {
          id: "static-3",
          title: "Losar",
          description:
            "Tibetan New Year celebration, marking new beginnings with family and community.",
          image:
            "https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?w=800&h=600&fit=crop",
          highlights: JSON.stringify([
            "New Year celebration",
            "Traditional dances",
            "Community feasts",
          ]),
        },
      ];

      setFestivals(dbFestivals.length > 0 ? dbFestivals : staticFestivals);
      setTraditions(traditionsRes.data.data || []);

      const banners = bannerRes.data.data || [];
      if (banners.length > 0) {
        setHeroBanner(banners[0]);
      }
    } catch (error) {
      console.error("Error fetching culture data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              heroBanner?.image
                ? getImageUrl(heroBanner.image)
                : "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop"
            }
            alt="Culture Background"
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
              Newari <span className="text-nepal-red">Culture</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the rich heritage, traditions, and festivals that define
              the Newari civilization
            </p>
          </motion.div>

          {/* Major Festivals */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Major <span className="text-nepal-red">Festivals</span>
            </h2>
            {loading ? (
              <p className="text-gray-400 text-center">Loading festivals...</p>
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
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="bg-accent-gray rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-nepal-red/20 transition-all duration-300"
                    >
                      {festival.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImageUrl(festival.image)}
                            alt={festival.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent"></div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {festival.title}
                        </h3>
                        <p className="text-gray-300 mb-4">
                          {festival.description}
                        </p>
                        {highlights.length > 0 && (
                          <div className="space-y-2">
                            {highlights.map((highlight, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-sm text-gray-400"
                              >
                                <svg
                                  className="w-4 h-4 mr-2 text-usa-blue"
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

          {/* Cultural Traditions */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Our <span className="text-nepal-red">Traditions</span>
            </h2>
            {loading ? (
              <p className="text-gray-400 text-center">Loading traditions...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {traditions.map((tradition, index) => (
                  <motion.div
                    key={tradition.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-accent-gray rounded-xl p-6 hover:bg-gradient-to-br hover:from-accent-gray hover:to-nepal-red/10 transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-4">{tradition.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
                      {tradition.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {tradition.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* About Newari Civilization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-nepal-red/10 to-usa-blue/10 rounded-2xl p-8 md:p-12 border border-nepal-red/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              The Newari Civilization
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
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
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Culture;
