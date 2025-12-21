import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getImageUrl } from "../utils/imageHelper";

const BlogCard = ({ blog, index }) => {
  return (
    <Link to="/blogs" className="block group">
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
        className="card-premium h-full flex flex-col cursor-pointer temple-corner"
      >
        {/* Premium Blog Image with Overlay */}
        <div className="relative h-56 overflow-hidden rounded-t-xl">
          {/* Mandala Pattern Overlay */}
          <div className="absolute inset-0 mandala-pattern opacity-20 z-10 pointer-events-none"></div>

          <img
            src={
              getImageUrl(blog.banner) || "https://via.placeholder.com/400x300"
            }
            alt={blog.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300";
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-20"></div>

          {/* Premium Category Badge */}
          <div className="absolute top-4 left-4 z-30">
            <span className="px-4 py-1.5 bg-gold-accent text-charcoal-black text-xs font-bold rounded-lg shadow-lg uppercase tracking-wider">
              {blog.category}
            </span>
          </div>

          {/* Bookmark Icon */}
          <motion.div
            className="absolute top-4 right-4 w-10 h-10 bg-dark-navy/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gold-accent cursor-pointer hover:bg-newari-red hover:text-white transition-colors duration-300 z-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </motion.div>
        </div>

        {/* Blog Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Date & Read Time */}
          <div className="flex items-center gap-3 text-muted-text text-sm mb-3">
            <span className="flex items-center gap-1">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="w-1 h-1 bg-muted-text rounded-full"></span>
            <span className="flex items-center gap-1">
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
              {blog.read_time || 5} min
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-primary-text mb-3 group-hover:text-gold-accent transition-colors duration-300 line-clamp-2">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-paragraph-text text-sm mb-6 line-clamp-3 flex-1">
            {blog.excerpt}
          </p>

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-4 border-t border-border-line">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-newari-red to-gold-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {blog.author?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-primary-text text-sm font-semibold">
                  {blog.author || "Admin"}
                </p>
                <p className="text-muted-text text-xs">Author</p>
              </div>
            </div>

            {/* Read More Button */}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center text-gold-accent font-semibold text-sm group-hover:text-newari-red transition-colors duration-300"
            >
              Read
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default BlogCard
