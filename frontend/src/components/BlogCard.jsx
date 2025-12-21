import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { API_URL } from "../config/api";

const BlogCard = ({ blog, index }) => {
  return (
    <Link to="/blogs" className="block">
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group bg-accent-gray rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-nepal-red/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      >
        {/* Blog Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              blog.banner
                ? `${API_URL}${blog.banner}`
                : "https://via.placeholder.com/400x300"
            }
            alt={blog.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-nepal-red text-white text-xs font-semibold rounded-full">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-6">
          {/* Date */}
          <p className="text-gray-400 text-sm mb-2">
            {new Date(blog.created_at).toLocaleDateString()}
          </p>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300 line-clamp-2">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {blog.excerpt}
          </p>

          {/* Read More Link */}
          <button className="inline-flex items-center text-usa-blue font-semibold hover:text-nepal-red transition-colors duration-300">
            Read More
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>

        {/* Author Info */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center">
          <div className="w-10 h-10 bg-usa-blue rounded-full flex items-center justify-center text-white font-bold mr-3">
            {blog.author.charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{blog.author}</p>
            <p className="text-gray-400 text-xs">{blog.read_time} min read</p>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default BlogCard
