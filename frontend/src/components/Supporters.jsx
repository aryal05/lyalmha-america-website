import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../config/api";

const Supporters = () => {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupporters();
  }, []);

  const fetchSupporters = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUPPORTERS.GET_ALL);
      const data = response.data.data || response.data || [];
      setSupporters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching supporters:", error);
      setSupporters([]);
    } finally {
      setLoading(false);
    }
  };

  const financialSupporters = supporters.filter((s) => s.type === "financial");
  const corporateSponsors = supporters.filter((s) => s.type === "corporate");

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mandala-pattern opacity-10 h-32 flex items-center justify-center">
            <p className="text-royal-blue text-xl font-semibold">
              Loading supporters...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/20 to-slate-50 overflow-hidden">
      {/* Background Mandala */}
      <div className="absolute inset-0 mandala-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-6 relative inline-block">
            Our{" "}
            <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
              Supporters
            </span>
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
          </h2>
          <div className="pagoda-divider w-48 mx-auto mb-6"></div>
          <p className="text-paragraph-text text-lg max-w-3xl mx-auto">
            We are deeply grateful to our community supporters who make our
            cultural preservation efforts possible
          </p>
        </motion.div>

        {/* Financial Supporters */}
        {financialSupporters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center text-royal-blue mb-8">
              Financial Supporters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {financialSupporters.map((supporter, index) => (
                <motion.div
                  key={supporter.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="card-premium temple-corner p-4 text-center group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative z-10">
                      <p className="text-primary-text font-medium text-sm group-hover:text-gold-accent transition-colors">
                        {supporter.name}
                      </p>
                      {supporter.description && (
                        <p className="text-paragraph-text text-xs mt-1 line-clamp-2">
                          {supporter.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Corporate Sponsors */}
        {corporateSponsors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center text-royal-blue mb-8">
              Corporate Sponsors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {corporateSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -5 }}
                  className="card-premium temple-corner p-6 text-center group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative z-10">
                      {/* Logo or Icon */}
                      {sponsor.logo ? (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-white/5 border-2 border-gold-accent/30 flex items-center justify-center p-3 group-hover:border-gold-accent transition-all shadow-lg">
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                          🏢
                        </div>
                      )}
                      <h4 className="text-primary-text font-bold text-lg mb-2 group-hover:text-gold-accent transition-colors">
                        {sponsor.name}
                      </h4>
                      {sponsor.contact_person && (
                        <p className="text-paragraph-text text-sm">
                          {sponsor.contact_person}
                        </p>
                      )}
                      {sponsor.description && (
                        <p className="text-paragraph-text text-xs mt-2 line-clamp-3">
                          {sponsor.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card-premium temple-corner p-12 text-center relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 mandala-pattern opacity-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          ></motion.div>

          <div className="relative z-10">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-newari-red via-gold-accent to-newari-red flex items-center justify-center text-4xl shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 40px rgba(242, 201, 76, 0.5)",
                  "0 0 60px rgba(196, 22, 28, 0.5)",
                  "0 0 40px rgba(242, 201, 76, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🙏
            </motion.div>

            <h3 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold-accent via-newari-red to-gold-accent bg-clip-text text-transparent">
                धन्यवाद (Thank You)
              </span>
            </h3>

            <div className="pagoda-divider w-48 mx-auto mb-6"></div>

            <p className="text-paragraph-text text-lg max-w-3xl mx-auto leading-relaxed">
              Your generous support has made the Biskaa Jatra celebration
              possible in the DMV region. Together, we are preserving our rich
              Newari heritage and passing it on to future generations. This
              project stands as a testament to our community's unity and
              dedication to cultural preservation.
            </p>

            {/* Decorative Corners */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold-accent"></div>
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-accent"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-newari-red"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-newari-red"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Supporters;
