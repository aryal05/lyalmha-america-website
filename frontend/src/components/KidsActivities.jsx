import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiClient, API_ENDPOINTS } from "../config/api";
import workshop1 from "../assets/images/posts/430057563_377416895039960_1581867728642530497_n.jpg";
import workshop2 from "../assets/images/posts/433421627_946258180277784_6165530352102042076_n.jpg";
import madalBanner from "../assets/images/posts/Madal and Dhimay Picture Banner_1.png";
import danceImg from "../assets/images/posts/438077842_407204048727911_1401114441457624925_n.jpg";

const KidsActivities = () => {
  const navigate = useNavigate();
  const [flippedCard, setFlippedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const fallbackImages = [
    workshop1,
    workshop2,
    madalBanner,
    danceImg,
    workshop1,
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ACTIVITIES.GET_ALL);
      const kidsActivities = response.data.data
        .filter((a) => a.category === "kids" && a.active === 1)
        .sort((a, b) => a.order_index - b.order_index)
        .map((activity) => ({
          ...activity,
          image: activity.image || fallbackImages[0],
          category: "Workshop",
          ageGroup: "All ages",
          benefits: [
            "Cultural Identity",
            "Heritage Learning",
            "Community Building",
          ],
        }));
      setActivities(kidsActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      quote:
        "My kids love the workshops! They're so excited to learn about our culture.",
      parent: "Anita D.",
      rating: 5,
    },
    {
      quote:
        "The music program is exceptional. My son can now play the Madal beautifully!",
      parent: "Rajesh M.",
      rating: 5,
    },
    {
      quote:
        "Best cultural program for kids in the DMV area. Highly recommend!",
      parent: "Sunita S.",
      rating: 5,
    },
  ];

  const handleFlip = (index) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="heading-lg mb-6 relative inline-block">
          Kids{" "}
          <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
            Activities
          </span>
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
        </h2>
        <div className="pagoda-divider w-48 mx-auto mb-4"></div>
        <p className="text-paragraph-text text-lg max-w-2xl mx-auto">
          Engaging cultural programs designed to connect young hearts with their
          heritage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-start">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="relative mb-8"
            style={{ perspective: "1000px" }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
              animate={{
                rotateY: flippedCard === index ? 180 : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              {/* Front of Card */}
              <div
                className="backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="card-premium temple-corner overflow-hidden group cursor-pointer"
                  onClick={() => handleFlip(index)}
                >
                  <div className="relative flex flex-col">
                    {/* Image with Overlay */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/50 to-transparent"></div>

                      {/* Mandala Overlay */}
                      <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black text-sm font-bold rounded-full shadow-lg">
                          {activity.icon} {activity.category}
                        </span>
                      </div>

                      {/* Age Group Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-charcoal-black/80 border border-gold-accent text-gold-accent text-xs font-semibold rounded-full">
                          {activity.ageGroup}
                        </span>
                      </div>

                      {/* Flip Indicator */}
                      <motion.div
                        className="absolute bottom-4 right-4"
                        animate={{
                          rotate: hoveredCard === index ? 180 : 0,
                          scale: hoveredCard === index ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center text-charcoal-black font-bold shadow-lg">
                          ↻
                        </div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 relative flex flex-col">
                      <div className="absolute inset-0 mandala-pattern opacity-5"></div>

                      <div className="relative z-10 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-primary-text mb-3 group-hover:text-gold-accent transition-colors duration-300">
                          {activity.title}
                        </h3>
                        <div className="mb-4 flex-1">
                          <p className="text-paragraph-text leading-relaxed whitespace-pre-line">
                            {expandedDescriptions[activity.id]
                              ? activity.description
                              : activity.description
                                  .split(" ")
                                  .slice(0, 25)
                                  .join(" ") + "..."}
                          </p>
                          {activity.description.split(" ").length > 25 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedDescriptions((prev) => ({
                                  ...prev,
                                  [activity.id]: !prev[activity.id],
                                }));
                              }}
                              className="mt-2 text-sm font-semibold text-gold-accent hover:text-newari-red transition-colors duration-300 flex items-center gap-1"
                            >
                              {expandedDescriptions[activity.id]
                                ? "Read Less"
                                : "Read More"}
                              <svg
                                className={`w-4 h-4 transform transition-transform duration-300 ${
                                  expandedDescriptions[activity.id]
                                    ? "rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gold-accent/20">
                          <span className="text-gold-accent font-semibold text-sm">
                            Click to flip →
                          </span>
                          <motion.div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-accent to-newari-red"
                            animate={{
                              boxShadow:
                                hoveredCard === index
                                  ? "0 0 20px rgba(242, 201, 76, 0.6)"
                                  : "0 0 10px rgba(242, 201, 76, 0.3)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Back of Card */}
              <div
                className="absolute top-0 left-0 w-full backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <motion.div
                  className="card-premium temple-corner p-8 cursor-pointer"
                  onClick={() => handleFlip(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative flex flex-col">
                    <div className="absolute inset-0 mandala-pattern opacity-10"></div>

                    <div className="relative z-10 flex-1 flex flex-col">
                      {/* Back Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-4xl">{activity.icon}</div>
                        <motion.div
                          animate={{ rotate: 180 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center text-charcoal-black font-bold"
                        >
                          ↻
                        </motion.div>
                      </div>

                      <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                        Program Details
                      </h3>

                      <div className="pagoda-divider w-24 mb-6"></div>

                      <p className="text-paragraph-text mb-6 leading-relaxed flex-1">
                        {activity.description}
                      </p>

                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        <h4 className="text-gold-accent font-semibold text-sm uppercase tracking-wider">
                          Key Benefits:
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {activity.benefits.map((benefit, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center text-paragraph-text"
                            >
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-charcoal-black font-bold text-xs">
                                  ✓
                                </span>
                              </div>
                              <span>{benefit}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/contact");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transition-all duration-300 shadow-lg"
                      >
                        Register Interest
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Parent Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
              Parent
            </span>{" "}
            Testimonials
          </h3>
          <div className="pagoda-divider w-48 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-premium temple-corner p-8 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 mandala-pattern opacity-5"></div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="text-gold-accent text-xl"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-paragraph-text italic mb-6 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Parent Name */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center text-charcoal-black font-bold mr-3">
                      {testimonial.parent.charAt(0)}
                    </div>
                    <span className="text-gold-accent font-semibold">
                      {testimonial.parent}
                    </span>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-gold-accent to-newari-red rounded-full opacity-10 blur-xl"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 card-premium temple-corner p-8 relative"
      >
        <div className="absolute inset-0 mandala-pattern opacity-5"></div>

        <div className="flex items-start relative z-10">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-charcoal-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div className="ml-6">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
              Regular Programs Throughout the Year
            </h4>
            <div className="pagoda-divider w-32 mb-4"></div>
            <p className="text-paragraph-text text-lg leading-relaxed">
              We conduct regular workshops and activities throughout the year.
              These programs are designed to engage children of all ages in
              learning about their heritage through fun and interactive methods
              including dance, music, language lessons, and cultural literature.
              Join us in preserving and celebrating our beautiful Newari
              traditions!
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-charcoal-black/50 to-dark-navy/50 p-4 rounded-lg border border-gold-accent/20">
                <div className="text-gold-accent text-2xl mb-2">📅</div>
                <div className="text-sm text-paragraph-text">
                  Weekly Sessions
                </div>
              </div>
              <div className="bg-gradient-to-br from-charcoal-black/50 to-dark-navy/50 p-4 rounded-lg border border-gold-accent/20">
                <div className="text-gold-accent text-2xl mb-2">👥</div>
                <div className="text-sm text-paragraph-text">Small Groups</div>
              </div>
              <div className="bg-gradient-to-br from-charcoal-black/50 to-dark-navy/50 p-4 rounded-lg border border-gold-accent/20">
                <div className="text-gold-accent text-2xl mb-2">🎓</div>
                <div className="text-sm text-paragraph-text">
                  Expert Teachers
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default KidsActivities;
