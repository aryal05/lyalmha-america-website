import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const AdminRSVPs = () => {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.RSVP.GET_ALL);
      setRsvps(response.data.data || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this RSVP?')) return;

    try {
      await apiClient.delete(API_ENDPOINTS.RSVP.DELETE(id));
      setRsvps(rsvps.filter(rsvp => rsvp.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      alert('Failed to delete RSVP');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="mb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-royal-blue hover:text-gold-accent mb-6 transition-colors font-semibold group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </motion.button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-gold-accent bg-clip-text text-transparent">Event RSVPs</h1>
            <p className="text-gray-600 mt-1">Manage event registrations and attendee information</p>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-royal-blue to-gold-accent rounded-lg shadow-lg">
            <p className="text-white text-sm font-medium">Total RSVPs</p>
            <p className="text-white text-3xl font-bold">{rsvps.length}</p>
          </div>
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-gold-accent to-newari-red rounded-full mt-4"></div>
      </div>

      {rsvps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-blue-50 to-gold-accent/5 rounded-xl border-2 border-dashed border-gray-300"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-royal-blue/10 to-gold-accent/10 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No RSVPs yet</p>
          <p className="text-gray-400 text-sm mt-2">Event registrations will appear here</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {rsvps.map((rsvp, index) => (
            <motion.div
              key={rsvp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gold-accent hover:shadow-xl transition-all duration-300"
            >
              {/* Collapsed View */}
              <div
                onClick={() => setExpandedId(expandedId === rsvp.id ? null : rsvp.id)}
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-gold-accent/5 transition-all"
              >
                <div className="flex-1 grid grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-blue to-gold-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {rsvp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="font-bold text-royal-blue">{rsvp.name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Event</p>
                    <p className="font-semibold text-gray-800 truncate">{rsvp.event_title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Attendees</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-gold-accent to-newari-red text-white font-bold rounded-full text-sm">
                        {rsvp.attendees}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-sm text-gray-600">{formatDate(rsvp.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(rsvp.id);
                    }}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-transparent hover:border-red-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                  
                  <motion.div
                    animate={{ rotate: expandedId === rsvp.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gold-accent"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Expanded View */}
              <AnimatePresence>
                {expandedId === rsvp.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t-2 border-gray-200 bg-gradient-to-br from-blue-50 via-white to-gold-accent/5"
                  >
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm">
                          <h3 className="text-sm font-bold text-royal-blue mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Contact Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <svg className="w-5 h-5 text-gold-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-gray-800 font-medium">{rsvp.name}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <svg className="w-5 h-5 text-gold-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <a href={`mailto:${rsvp.email}`} className="text-royal-blue hover:text-gold-accent transition-colors font-medium">{rsvp.email}</a>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <svg className="w-5 h-5 text-gold-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <a href={`tel:${rsvp.phone}`} className="text-royal-blue hover:text-gold-accent transition-colors font-medium">{rsvp.phone}</a>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm">
                          <h3 className="text-sm font-bold text-royal-blue mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Event Details
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Event Name</p>
                              <p className="font-bold text-gray-800">{rsvp.event_title}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Event Date</p>
                              <p className="text-gray-800">{formatDate(rsvp.event_date)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Location</p>
                              <p className="text-gray-800">{rsvp.location}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Number of Attendees</p>
                              <div className="inline-block px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-white font-bold rounded-lg text-lg shadow-lg">
                                {rsvp.attendees}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t-2 border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
                        <p className="text-xs text-gray-500">RSVP Submitted</p>
                        <p className="text-sm text-gray-700 font-medium">{formatDate(rsvp.created_at)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRSVPs;
