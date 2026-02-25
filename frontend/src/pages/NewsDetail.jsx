import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { getImageUrl } from '../utils/imageHelper';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NEWS.GET_BY_ID(id));
      const data = response.data.data;
      // Clean content by removing common test patterns
      if (data.content) {
        data.content = data.content
          .replace(/<p>\s*test\d*\s*<\/p>/gi, '')
          .replace(/\btes\d+\b/gi, '')
          .trim();
      }
      setNewsItem(data);
    } catch (error) {
      console.error('Error fetching news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-primary-text mb-4">News Not Found</h1>
          <button
            onClick={() => navigate('/news')}
            className="text-gold-accent hover:text-gold-accent/80"
          >
            ← Back to News
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 text-gold-accent hover:text-gold-accent/80 mb-8 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to News
          </motion.button>

          {/* Category & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-white text-sm font-semibold rounded-full">
              {newsItem.category
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
            <div className="flex items-center gap-2 text-paragraph-text">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(newsItem.published_date)}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-primary-text mb-6 leading-tight"
          >
            {newsItem.title}
          </motion.h1>

          {/* Author */}
          {newsItem.author && newsItem.author.toLowerCase() !== "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8 pb-8 border-b border-border-line"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent to-newari-red flex items-center justify-center text-white font-bold text-lg">
                {newsItem.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-primary-text">
                  {newsItem.author}
                </p>
                <p className="text-sm text-paragraph-text">Author</p>
              </div>
            </motion.div>
          )}

          {/* Featured Image */}
          {newsItem.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl"
            >
              <img
                src={getImageUrl(newsItem.image)}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/20 to-transparent"></div>
            </motion.div>
          )}

          {/* Excerpt */}
          {newsItem.excerpt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-paragraph-text leading-relaxed mb-8 p-6 bg-gradient-to-r from-gold-accent/5 to-newari-red/5 rounded-xl border-l-4 border-gold-accent"
            >
              {newsItem.excerpt}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-paragraph-text leading-relaxed text-lg prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />

          {/* Link */}
          {newsItem.link && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-6"
            >
              <a
                href={newsItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 underline hover:text-blue-800 transition-colors font-medium text-lg"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {newsItem.link_title || newsItem.link}
              </a>
            </motion.div>
          )}

          {/* Tags */}
          {newsItem.tags && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-border-line"
            >
              <h3 className="text-sm font-semibold text-paragraph-text mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {newsItem.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-paragraph-text text-sm rounded-full hover:bg-gold-accent/10 transition-colors"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-8 border-t border-border-line"
          >
            <h3 className="text-lg font-semibold text-primary-text mb-4">
              Share this article
            </h3>
            <div className="flex gap-3">
              {/* Facebook */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                    "_blank",
                  );
                }}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                title="Share on Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              {/* X (Twitter) */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent(newsItem.title || "");
                  window.open(
                    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                    "_blank",
                  );
                }}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                title="Share on X"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default NewsDetail;
