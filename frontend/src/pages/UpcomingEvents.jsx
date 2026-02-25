import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  const [shareOpenId, setShareOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShareOpenId(null);
    if (shareOpenId !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [shareOpenId]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdowns = {};
      events.forEach((event) => {
        newCountdowns[event.id] = calculateCountdown(
          event.event_date,
          event.event_time,
        );
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENTS.GET_UPCOMING);
      setEvents(response.data.data || []);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    // Convert 24h time to 12h format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-slate-50">
      <Navbar />

      {/* Hero Section */}
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Upcoming </span>
              <span className="text-gold-accent">Events</span>
            </h1>
            <p className="text-xl text-cream-white/90 max-w-3xl mx-auto">
              Join us for our upcoming cultural celebrations and community
              gatherings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const countdown = countdowns[event.id];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-gold-accent"
                >
                  {/* Event Image */}
                  {event.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-gold-accent text-charcoal-black text-xs font-bold rounded-full">
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-royal-blue mb-3">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-paragraph-text text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-paragraph-text">
                        <svg
                          className="w-4 h-4 text-gold-accent"
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
                        {formatDate(event.event_date)}
                        {event.event_time &&
                          ` at ${formatTime(event.event_time)}`}
                        {event.event_end_time &&
                          ` - ${formatTime(event.event_end_time)}`}
                        {(event.event_time || event.event_end_time) && " ET"}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-paragraph-text">
                          <svg
                            className="w-4 h-4 text-gold-accent"
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
                          </svg>
                          {event.location}
                        </div>
                      )}
                    </div>

                    {/* Event Link */}
                    {event.event_link && (
                      <div className="mb-4">
                        <a
                          href={event.event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 underline hover:text-blue-800 transition-colors text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          {event.event_link_title || "Event Link"}
                        </a>
                      </div>
                    )}

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
                            className="bg-gradient-to-br from-gold-accent/20 to-royal-blue/20 rounded-lg p-2 text-center border border-gold-accent/40"
                          >
                            <div className="text-newari-red font-bold text-lg">
                              {item.value}
                            </div>
                            <div className="text-royal-blue text-xs font-semibold">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/gallery/event/${event.id}`)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-royal-blue to-gold-accent text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/contact`)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-newari-red to-gold-accent text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        RSVP Now
                      </button>

                      {/* Share Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareOpenId(
                              shareOpenId === event.id ? null : event.id,
                            );
                          }}
                          className="w-full px-4 py-2 bg-white border-2 border-gray-200 text-paragraph-text font-semibold rounded-lg hover:border-gold-accent hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          Share
                        </button>

                        {shareOpenId === event.id && (
                          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                            {/* Facebook */}
                            <button
                              onClick={() => {
                                const eventUrl = encodeURIComponent(
                                  `${window.location.origin}/gallery/event/${event.id}`,
                                );
                                window.open(
                                  `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
                                  "_blank",
                                  "width=600,height=400",
                                );
                                setShareOpenId(null);
                              }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                Facebook
                              </span>
                            </button>
                            {/* X (Twitter) */}
                            <button
                              onClick={() => {
                                const eventUrl = encodeURIComponent(
                                  `${window.location.origin}/gallery/event/${event.id}`,
                                );
                                const text = encodeURIComponent(
                                  event.title || "",
                                );
                                window.open(
                                  `https://twitter.com/intent/tweet?url=${eventUrl}&text=${text}`,
                                  "_blank",
                                  "width=600,height=400",
                                );
                                setShareOpenId(null);
                              }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                X (Twitter)
                              </span>
                            </button>
                            {/* Copy Link */}
                            <button
                              onClick={() => {
                                const eventUrl = `${window.location.origin}/gallery/event/${event.id}`;
                                navigator.clipboard
                                  .writeText(eventUrl)
                                  .then(() => {
                                    setCopiedId(event.id);
                                    setTimeout(() => setCopiedId(null), 2000);
                                  });
                                setShareOpenId(null);
                              }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-green-50 transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-4 h-4 text-white"
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
                              <span className="text-sm font-medium text-gray-700">
                                {copiedId === event.id
                                  ? "✓ Copied!"
                                  : "Copy Link"}
                              </span>
                            </button>
                          </div>
                        )}

                        {copiedId === event.id && shareOpenId !== event.id && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                            Link copied!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-paragraph-text text-lg">
              No upcoming events at the moment.
            </p>
          </div>
        )}
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};;;

export default UpcomingEvents;
