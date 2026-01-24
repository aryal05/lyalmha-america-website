import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const AdminContacts = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.CONTACT.GET_ALL);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.patch(API_ENDPOINTS.CONTACT.MARK_READ(id));
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      alert('Failed to mark message as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await apiClient.delete(API_ENDPOINTS.CONTACT.DELETE(id));
      setSelectedMessage(null);
      fetchMessages();
      alert('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const unreadCount = messages.filter((msg) => msg.status === 'unread').length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-gold-accent bg-clip-text text-transparent">
              Contact Messages
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? (
                <span className="text-newari-red font-semibold">
                  {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                </span>
              ) : (
                "All messages have been read"
              )}
            </p>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-royal-blue to-gold-accent rounded-lg shadow-lg">
            <p className="text-white text-sm font-medium">Total Messages</p>
            <p className="text-white text-3xl font-bold">{messages.length}</p>
          </div>
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-gold-accent to-newari-red rounded-full mt-4"></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
            filter === "all"
              ? "bg-gradient-to-r from-royal-blue to-gold-accent text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
            filter === "unread"
              ? "bg-gradient-to-r from-royal-blue to-gold-accent text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
            filter === "read"
              ? "bg-gradient-to-r from-royal-blue to-gold-accent text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
          }`}
        >
          Read ({messages.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto"></div>
          <p className="mt-4 text-paragraph-text">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-blue-50 to-gold-accent/5 rounded-xl border-2 border-dashed border-gray-300"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-royal-blue/10 to-gold-accent/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">No messages to display</p>
          <p className="text-gray-400 text-sm mt-2">Contact messages will appear here</p>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all shadow-md hover:shadow-xl ${
                  selectedMessage?.id === message.id
                    ? "border-royal-blue bg-gradient-to-r from-blue-50 to-gold-accent/5"
                    : message.status === "unread"
                    ? "border-newari-red/40 bg-gradient-to-r from-red-50 to-newari-red/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === "unread") {
                    markAsRead(message.id);
                  }
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-royal-blue to-gold-accent flex items-center justify-center text-white font-bold shadow-lg">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-black flex items-center gap-2">
                        {message.name}
                        {message.status === "unread" && (
                          <span className="w-2.5 h-2.5 bg-newari-red rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <p className="text-sm text-paragraph-text">
                        {message.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-semibold text-royal-blue text-sm mb-1">
                  {message.subject}
                </p>
                <p className="text-sm text-paragraph-text line-clamp-2">
                  {message.message}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:sticky lg:top-6 h-fit">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h2 className="text-2xl font-bold text-charcoal-black">
                        {selectedMessage.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-royal-blue ml-7">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-6">
                  {/* Subject */}
                  <div className="bg-blue-50 border-l-4 border-royal-blue p-4 rounded-r-lg">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                      Subject
                    </p>
                    <p className="text-lg font-semibold text-royal-blue">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                      Message
                    </p>
                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
                      <p className="text-paragraph-text leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Received timestamp */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Received:</span>
                    <span>{formatDate(selectedMessage.created_at)}</span>
                  </div>

                  {/* Reply button */}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="btn-gold w-full justify-center mt-6 inline-flex"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
