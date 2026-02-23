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

  useEffect(() => {
    fetchEvents();
  }, []);

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
      console.error('Error fetching events:', error);
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      timeZone: "America/New_York",
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
    return `${hour12}:${minutes} ${ampm} ET`;
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
              Join us for our upcoming cultural celebrations and community gatherings
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
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-paragraph-text text-lg">No upcoming events at the moment.</p>
          </div>
        )}
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default UpcomingEvents;
