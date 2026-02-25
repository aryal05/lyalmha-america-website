import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import SuccessPopup from "./SuccessPopup";
import MembershipRegistrationModal from "./MembershipRegistrationModal";
import event1 from "../assets/images/posts/471944315_555366943987150_1453996420800501859_n.jpg";
import event2 from "../assets/images/posts/467736461_487936857446592_6777699176984050234_n (1).jpg";
import event3 from "../assets/images/posts/462650425_598936739649734_2260957587124948845_n.jpg";

const EventsSidebar = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [countdowns, setCountdowns] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    attendees: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [copiedEventId, setCopiedEventId] = useState(null);

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
        newCountdowns[event.id] = calculateCountdown(
          event.event_date,
          event.event_time,
        );
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingEvents]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showRSVPModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showRSVPModal]);

  const fetchEvents = async () => {
    try {
      // Fetch upcoming events
      const upcomingResponse = await apiClient.get(
        API_ENDPOINTS.EVENTS.GET_UPCOMING,
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

  const calculateCountdown = (eventDate, eventTimeStr) => {
    // Get current time in Eastern Time
    const nowET = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
    );
    // Build event datetime in Eastern Time (event_time is stored as ET)
    const timeStr = eventTimeStr || "00:00";
    const eventDT = new Date(`${eventDate.split("T")[0]}T${timeStr}:00`);
    const distance = eventDT.getTime() - nowET.getTime();

    if (distance < 0) return null;

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  const formatDate = (dateString, timeString, endTimeString) => {
    const date = new Date(dateString + "T00:00:00Z");
    const formatted = date.toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (timeString) {
      const [h, m] = timeString.split(":");
      const hr = parseInt(h, 10);
      const ampm = hr >= 12 ? "PM" : "AM";
      const h12 = hr % 12 || 12;
      let timeStr = `${formatted} at ${h12}:${m} ${ampm}`;
      if (endTimeString) {
        const [eh, em] = endTimeString.split(":");
        const ehr = parseInt(eh, 10);
        const eampm = ehr >= 12 ? "PM" : "AM";
        const eh12 = ehr % 12 || 12;
        timeStr += ` - ${eh12}:${em} ${eampm}`;
      }
      return timeStr + " ET";
    }
    return formatted;
  };

  const formatPastDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
    });
  };

  const shareEvent = (event, platform) => {
    const eventUrl = `${window.location.origin}/gallery/event/${event.id}`;
    const text = `Check out ${event.title} on ${formatDate(event.event_date)}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`,
    };

    if (platform === "copylink") {
      navigator.clipboard.writeText(eventUrl).then(() => {
        setCopiedEventId(event.id);
        setTimeout(() => setCopiedEventId(null), 2000);
      });
      return;
    }

    window.open(shareUrls[platform], "_blank");
  };

  const handleRSVP = (event) => {
    setSelectedEvent(event);
    setFormData({ name: "", email: "", phone: "", attendees: "" });
    setShowRSVPModal(true);
  };

  const handleSubmitRSVP = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiClient.post(API_ENDPOINTS.RSVP.SUBMIT, {
        event_id: selectedEvent.id,
        ...formData,
      });

      setShowRSVPModal(false);
      setFormData({ name: "", email: "", phone: "", attendees: "" });
      setPopupConfig({
        title: "RSVP Confirmed!",
        message: `Thank you for your RSVP to "${selectedEvent.title}". We look forward to seeing you!`,
        type: "success",
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setShowRSVPModal(false);
      setPopupConfig({
        title: "RSVP Failed",
        message:
          error.response?.data?.message ||
          "Failed to submit RSVP. Please try again.",
        type: "error",
      });
      setShowPopup(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 sticky top-24">
      {/* Upcoming Events with Premium Styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border-2 border-gold-accent/30 shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 50%, #FFFBF0 100%)",
        }}
      >
        <div className="absolute inset-0 mandala-pattern opacity-5"></div>

        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-newari-red via-gold-accent to-royal-blue"></div>

        <div className="relative z-10 p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent via-newari-red to-royal-blue flex items-center justify-center mr-3 shadow-lg animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-gold-accent via-newari-red to-royal-blue bg-clip-text text-transparent font-extrabold">
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
              {upcomingEvents.slice(0, 2).map((event, index) => {
                const countdown = countdowns[event.id];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => navigate(`/gallery/event/${event.id}`)}
                    className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-white border-l-4 border-gold-accent pl-6 pr-4 py-5 rounded-xl hover:border-newari-red transition-all duration-300 cursor-pointer relative group shadow-lg hover:shadow-2xl"
                    style={{
                      boxShadow: "0 4px 15px rgba(212, 175, 55, 0.15)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-accent/5 to-royal-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>

                    <div className="relative z-10">
                      <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-gold-accent via-newari-red to-gold-accent text-white text-xs font-bold rounded-full mb-3 capitalize shadow-md">
                        {event.event_type}
                      </span>

                      <h4 className="font-bold text-royal-blue mb-2 text-lg group-hover:text-gold-accent transition-colors">
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
                        {formatDate(
                          event.event_date,
                          event.event_time,
                          event.event_end_time,
                        )}
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
                              className="bg-gradient-to-br from-gold-accent/20 via-newari-red/10 to-royal-blue/20 rounded-lg p-2 text-center border-2 border-gold-accent/40 shadow-md hover:shadow-lg transition-all hover:scale-105"
                            >
                              <div className="text-newari-red font-extrabold text-xl">
                                {item.value}
                              </div>
                              <div className="text-royal-blue text-xs font-semibold">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRSVP(event);
                          }}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-newari-red via-gold-accent to-newari-red text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 text-sm shadow-lg"
                          style={{
                            boxShadow: "0 4px 15px rgba(196, 30, 58, 0.4)",
                          }}
                        >
                          RSVP
                        </motion.button>

                        {/* Social Share Dropdown */}
                        <div className="relative group/share">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-3 bg-gradient-to-br from-royal-blue to-royal-blue/80 border-2 border-royal-blue rounded-lg hover:border-gold-accent hover:bg-gradient-to-br hover:from-gold-accent hover:to-newari-red transition-all text-white shadow-md"
                          >
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

                          <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gold-accent/50 rounded-xl shadow-2xl opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all z-50 overflow-hidden">
                            {/* Facebook - real logo */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shareEvent(event, "facebook");
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-all flex items-center gap-3 font-medium"
                            >
                              <div className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">
                                Facebook
                              </span>
                            </button>
                            {/* X (Twitter) - real logo */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shareEvent(event, "twitter");
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-all flex items-center gap-3 font-medium border-t border-gray-100"
                            >
                              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3.5 h-3.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">
                                X (Twitter)
                              </span>
                            </button>
                            {/* Copy Link */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shareEvent(event, "copylink");
                              }}
                              className="w-full px-4 py-2.5 text-left hover:bg-green-50 transition-all flex items-center gap-3 font-medium border-t border-gray-100"
                            >
                              <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3.5 h-3.5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">
                                {copiedEventId === event.id
                                  ? "✓ Copied!"
                                  : "Copy Link"}
                              </span>
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

          <Link to="/events">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-charcoal-black font-bold rounded-lg hover:from-gold-accent hover:to-newari-red transition-all duration-300 shadow-lg"
            >
              View All Events{" "}
              {upcomingEvents.length > 2 &&
                `(${upcomingEvents.length - 2} more)`}
            </motion.button>
          </Link>
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
                  onClick={() => navigate(`/gallery/event/${event.id}`)}
                  className="group cursor-pointer relative"
                >
                  <div className="relative h-40 rounded-lg overflow-hidden mb-3 border-2 border-gold-accent/20 group-hover:border-gold-accent transition-all">
                    <img
                      src={
                        getImageUrl(event.image) ||
                        fallbackImages[index % fallbackImages.length]
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

          <Link to="/gallery">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full px-6 py-3 border-2 border-gold-accent text-gold-accent font-bold rounded-lg hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300"
            >
              📸 View Full Gallery
            </motion.button>
          </Link>
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
            Join our community of dedicated supporters and help preserve newari
            culture for future generations.
          </p>

          <motion.button
            onClick={() => setShowMembershipModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-bold rounded-lg hover:from-newari-red hover:to-gold-accent transition-all duration-300 shadow-lg"
          >
            Join Now
          </motion.button>

          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
        </div>
      </motion.div>

      {/* RSVP Modal - Rendered via Portal */}
      {showRSVPModal &&
        selectedEvent &&
        ReactDOM.createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{
                zIndex: 999999,
                background:
                  "linear-gradient(135deg, rgba(10, 49, 97, 0.92) 0%, rgba(30, 58, 138, 0.85) 50%, rgba(248, 250, 252, 0.88) 100%)",
                backdropFilter: "blur(12px)",
              }}
              onClick={() => setShowRSVPModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white max-w-md w-full p-8 relative rounded-xl shadow-2xl border-2 border-gold-accent/30"
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 1000000 }}
              >
                <div className="absolute inset-0 mandala-pattern opacity-5"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-royal-blue">
                      RSVP to Event
                    </h3>
                    <button
                      onClick={() => setShowRSVPModal(false)}
                      className="w-10 h-10 rounded-full bg-newari-red flex items-center justify-center text-white font-bold hover:scale-110 hover:bg-royal-blue transition-all shadow-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="pagoda-divider w-32 mb-6"></div>

                  <div className="mb-6 p-4 bg-gradient-to-br from-royal-blue/10 via-gold-accent/5 to-royal-blue/10 rounded-lg border-2 border-gold-accent/30">
                    <h4 className="font-bold text-royal-blue mb-2">
                      {selectedEvent.title}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {formatDate(
                        selectedEvent.event_date,
                        selectedEvent.event_time,
                        selectedEvent.event_end_time,
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedEvent.location}
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRSVP} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 focus:outline-none transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 focus:outline-none transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 focus:outline-none transition-all"
                    />
                    <select
                      value={formData.attendees}
                      onChange={(e) =>
                        setFormData({ ...formData, attendees: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 focus:outline-none transition-all"
                    >
                      <option value="">Number of Attendees</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10+">10+</option>
                    </select>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Confirm RSVP"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}

      {/* Success/Error Popup */}
      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />

      {/* Membership Registration Modal */}
      <MembershipRegistrationModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
      />
    </div>
  );
};

export default EventsSidebar;
