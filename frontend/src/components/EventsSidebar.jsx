import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { apiClient, API_ENDPOINTS } from "../config/api";
import event1 from "../assets/images/posts/471944315_555366943987150_1453996420800501859_n.jpg";
import event2 from "../assets/images/posts/467736461_487936857446592_6777699176984050234_n (1).jpg";
import event3 from "../assets/images/posts/462650425_598936739649734_2260957587124948845_n.jpg";

const EventsSidebar = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [countdowns, setCountdowns] = useState({});

  // Fallback images for past events
  const fallbackImages = [event1, event2, event3];

  useEffect(() => {
    fetchEvents();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      upcomingEvents.forEach((event) => {
        newCountdowns[event.id] = calculateCountdown(event.event_date);
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingEvents]);

  const fetchEvents = async () => {
    try {
      // Fetch upcoming events
      const upcomingResponse = await apiClient.get(
        API_ENDPOINTS.EVENTS.GET_UPCOMING
      );
      setUpcomingEvents(upcomingResponse.data.data || []);

      // Fetch past events
      const pastResponse = await apiClient.get(API_ENDPOINTS.EVENTS.GET_PAST);
      setPastEvents(pastResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCountdown = (eventDate) => {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const distance = eventTime - now;

    if (distance < 0) return null;

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPastDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const shareEvent = (event, platform) => {
    const url = window.location.href;
    const text = `Check out ${event.title} on ${formatDate(event.event_date)}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const handleRSVP = (event) => {
    setSelectedEvent(event);
    setShowRSVPModal(true);
  };

  return (
    <div className="space-y-8 sticky top-24">
      {/* Upcoming Events with Premium Styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-premium temple-corner p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 mandala-pattern opacity-5"></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center mr-3 shadow-lg">
              <svg
                className="w-5 h-5 text-charcoal-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
              Upcoming Events
            </span>
          </h3>

          <div className="pagoda-divider w-32 mb-6"></div>

          {loading ? (
            <div className="text-center py-8">
              <motion.div
                className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-gold-accent to-newari-red"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-paragraph-text mt-4">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => {
                const countdown = countdowns[event.id];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-charcoal-black/50 to-dark-navy/50 border-l-4 border-gold-accent pl-6 pr-4 py-4 rounded-r-lg hover:border-newari-red transition-all duration-300 cursor-pointer relative group"
                  >
                    <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-10 transition-opacity rounded-r-lg"></div>

                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black text-xs font-bold rounded-full mb-3 capitalize shadow-lg">
                        {event.event_type}
                      </span>

                      <h4 className="font-bold text-primary-text mb-2 text-lg group-hover:text-gold-accent transition-colors">
                        {event.title}
                      </h4>

                      <p className="text-sm text-paragraph-text mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gold-accent"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {formatDate(event.event_date)}
                      </p>

                      <p className="text-xs text-paragraph-text mb-4 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-newari-red"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {event.location}
                      </p>

                      {/* Countdown Timer */}
                      {countdown && (
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[
                            { value: countdown.days, label: "Days" },
                            { value: countdown.hours, label: "Hrs" },
                            { value: countdown.minutes, label: "Min" },
                            { value: countdown.seconds, label: "Sec" },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-gradient-to-br from-gold-accent/10 to-newari-red/10 rounded-lg p-2 text-center border border-gold-accent/20"
                            >
                              <div className="text-gold-accent font-bold text-lg">
                                {item.value}
                              </div>
                              <div className="text-paragraph-text text-xs">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRSVP(event)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transition-all duration-300 text-sm shadow-lg"
                        >
                          RSVP
                        </motion.button>

                        {/* Social Share Dropdown */}
                        <div className="relative group/share">
                          <button className="px-4 py-2 bg-gradient-to-br from-charcoal-black to-dark-navy border border-gold-accent/30 rounded-lg hover:border-gold-accent transition-all text-gold-accent">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                          </button>

                          <div className="absolute right-0 mt-2 w-40 bg-charcoal-black border border-gold-accent/30 rounded-lg shadow-xl opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all z-50">
                            <button
                              onClick={() => shareEvent(event, "facebook")}
                              className="w-full px-4 py-2 text-left text-paragraph-text hover:text-gold-accent hover:bg-dark-navy transition-colors flex items-center gap-2"
                            >
                              <span>📘</span> Facebook
                            </button>
                            <button
                              onClick={() => shareEvent(event, "twitter")}
                              className="w-full px-4 py-2 text-left text-paragraph-text hover:text-gold-accent hover:bg-dark-navy transition-colors flex items-center gap-2"
                            >
                              <span>🐦</span> Twitter
                            </button>
                            <button
                              onClick={() => shareEvent(event, "whatsapp")}
                              className="w-full px-4 py-2 text-left text-paragraph-text hover:text-gold-accent hover:bg-dark-navy transition-colors flex items-center gap-2"
                            >
                              <span>💬</span> WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-charcoal-black/30 to-dark-navy/30 rounded-lg border border-gold-accent/20">
              <p className="text-paragraph-text">No upcoming events</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-charcoal-black font-bold rounded-lg hover:from-gold-accent hover:to-newari-red transition-all duration-300 shadow-lg"
          >
            View All Events
          </motion.button>
        </div>
      </motion.div>

      {/* Past Events Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-premium temple-corner p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 mandala-pattern opacity-5"></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center mr-3 shadow-lg">
              <svg
                className="w-5 h-5 text-charcoal-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
              Past Events
            </span>
          </h3>

          <div className="pagoda-divider w-32 mb-6"></div>

          {loading ? (
            <div className="text-center py-8">
              <motion.div
                className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-newari-red to-gold-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-paragraph-text mt-4">Loading events...</p>
            </div>
          ) : pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="group cursor-pointer relative"
                >
                  <div className="relative h-40 rounded-lg overflow-hidden mb-3 border-2 border-gold-accent/20 group-hover:border-gold-accent transition-all">
                    <img
                      src={
                        event.image
                          ? `http://localhost:5000${event.image}`
                          : fallbackImages[index % fallbackImages.length]
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/50 to-transparent"></div>

                    {/* Mandala Overlay */}
                    <div className="absolute inset-0 mandala-pattern opacity-0 group-hover:opacity-20 transition-opacity"></div>

                    {/* View Gallery Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      📸 View
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-charcoal-black/80 border border-gold-accent text-gold-accent text-xs font-semibold rounded-full">
                        {formatPastDate(event.event_date)}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-primary-text group-hover:text-gold-accent transition-colors duration-300 text-lg">
                    {event.title}
                  </h4>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-charcoal-black/30 to-dark-navy/30 rounded-lg border border-gold-accent/20">
              <p className="text-paragraph-text">No past events</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full px-6 py-3 border-2 border-gold-accent text-gold-accent font-bold rounded-lg hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300"
          >
            📸 View Full Gallery
          </motion.button>
        </div>
      </motion.div>

      {/* Life Membership CTA with Premium Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-premium temple-corner p-8 text-center relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 mandala-pattern opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        ></motion.div>

        <div className="relative z-10">
          <motion.div
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-accent via-newari-red to-gold-accent flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                "0 0 40px rgba(242, 201, 76, 0.5)",
                "0 0 60px rgba(196, 22, 28, 0.5)",
                "0 0 40px rgba(242, 201, 76, 0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg
              className="w-8 h-8 text-charcoal-black"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </motion.div>

          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
            Become a Life Member
          </h3>

          <div className="pagoda-divider w-32 mx-auto mb-4"></div>

          <p className="text-paragraph-text text-sm mb-6 leading-relaxed">
            Join our community of dedicated supporters and help preserve Newari
            culture for future generations.
          </p>

          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transition-all duration-300 shadow-lg"
            >
              Join Now
            </motion.button>
          </Link>

          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
        </div>
      </motion.div>

      {/* RSVP Modal */}
      <AnimatePresence>
        {showRSVPModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRSVPModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card-premium temple-corner max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 mandala-pattern opacity-5"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                    RSVP to Event
                  </h3>
                  <button
                    onClick={() => setShowRSVPModal(false)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-newari-red to-gold-accent flex items-center justify-center text-charcoal-black font-bold hover:scale-110 transition-transform"
                  >
                    ✕
                  </button>
                </div>

                <div className="pagoda-divider w-32 mb-6"></div>

                <div className="mb-6 p-4 bg-gradient-to-br from-charcoal-black/50 to-dark-navy/50 rounded-lg border border-gold-accent/20">
                  <h4 className="font-bold text-primary-text mb-2">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-sm text-paragraph-text">
                    {formatDate(selectedEvent.event_date)}
                  </p>
                  <p className="text-xs text-paragraph-text">
                    {selectedEvent.location}
                  </p>
                </div>

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-charcoal-black border border-gold-accent/30 rounded-lg text-primary-text focus:border-gold-accent focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-charcoal-black border border-gold-accent/30 rounded-lg text-primary-text focus:border-gold-accent focus:outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 bg-charcoal-black border border-gold-accent/30 rounded-lg text-primary-text focus:border-gold-accent focus:outline-none transition-colors"
                  />
                  <select className="w-full px-4 py-3 bg-charcoal-black border border-gold-accent/30 rounded-lg text-primary-text focus:border-gold-accent focus:outline-none transition-colors">
                    <option>Number of Attendees</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transition-all duration-300 shadow-lg"
                  >
                    Confirm RSVP
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsSidebar;
