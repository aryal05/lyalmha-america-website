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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-deep-black">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white">Loading supporters...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-deep-black">
      <div className="max-w-7xl mx-auto">
        {/* Financial Supporters */}
        {financialSupporters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Financial <span className="text-nepal-red">Supporters</span>
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              We extend our heartfelt gratitude to these individuals and
              families who have generously supported the Biskaa Jatra project
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {financialSupporters.map((supporter, index) => (
                <motion.div
                  key={supporter.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02, duration: 0.4 }}
                  className="bg-accent-gray rounded-lg p-4 text-center hover:bg-gradient-to-r hover:from-nepal-red/10 hover:to-usa-blue/10 transition-all duration-300"
                >
                  <p className="text-white font-medium text-sm">
                    {supporter.name}
                  </p>
                  {supporter.description && (
                    <p className="text-gray-400 text-xs mt-1">
                      {supporter.description}
                    </p>
                  )}
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Corporate <span className="text-usa-blue">Sponsors</span>
            </h2>
            <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
              Special thanks to our corporate partners who have contributed to
              preserving our cultural heritage
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {corporateSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-gradient-to-br from-accent-gray to-usa-blue/5 rounded-xl p-6 text-center hover:shadow-xl hover:shadow-usa-blue/20 transition-all duration-300 group"
                >
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-usa-blue transition-colors duration-300">
                    {sponsor.name}
                  </h3>
                  {sponsor.contact_person && (
                    <p className="text-gray-400 text-sm">
                      {sponsor.contact_person}
                    </p>
                  )}
                  {sponsor.description && (
                    <p className="text-gray-500 text-xs mt-2">
                      {sponsor.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-nepal-red/10 to-usa-blue/10 rounded-2xl p-8 text-center border border-nepal-red/20"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            धन्यवाद (Thank You)
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your generous support has made the Biskaa Jatra celebration possible
            in the DMV region. Together, we are preserving our rich Newari
            heritage and passing it on to future generations. This project
            stands as a testament to our community's unity and dedication to
            cultural preservation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Supporters;
