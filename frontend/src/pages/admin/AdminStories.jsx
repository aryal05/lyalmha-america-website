import React, { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../../config/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { getImageUrl } from '../../utils/imageHelper';
import { motion } from 'framer-motion';

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    banner: null,
    category: "",
    location: "",
    created_at: "",
    author: "",
    link: "",
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STORIES.GET_ALL);
      setStories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("author", formData.author);
      data.append("link", formData.link);
      if (formData.banner) {
        data.append("banner", formData.banner);
      }
      if (editingStory) {
        await apiClient.put(
          API_ENDPOINTS.STORIES.UPDATE(editingStory.id),
          data,
        );
      } else {
        await apiClient.post(API_ENDPOINTS.STORIES.CREATE, data);
      }
      fetchStories();
      resetForm();
    } catch (error) {
      console.error("Error saving story:", error);
      alert(
        "Error saving story: " + (error.response?.data?.error || error.message),
      );
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      banner: null,
      category: story.category,
      location: story.location,
      created_at: story.created_at,
      author: story.author,
      link: story.link || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.STORIES.DELETE(id));
        fetchStories();
      } catch (error) {
        console.error("Error deleting story:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      banner: null,
      category: "",
      location: "",
      created_at: "",
      author: "",
      link: "",
    });
    setEditingStory(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="relative max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-royal-blue">
                Homepage Stories
              </h1>
              <span className="px-3 py-1 bg-royal-blue/10 text-royal-blue text-sm font-bold rounded-full">
                {stories.length}
              </span>
            </div>
            <p className="text-paragraph-text">
              Add, edit, or remove stories for the homepage section.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingStory(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            + Add Story
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-300 rounded-2xl p-8 mb-10 shadow-lg max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Story title"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Category"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Location"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Author"
                  />
                </div>
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-paragraph-text mt-1">
                  External link for this story
                </p>
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Excerpt *
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                  placeholder="Short excerpt"
                />
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Content *
                </label>
                <textarea
                  required
                  rows="5"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                  placeholder="Full content"
                />
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, banner: e.target.files[0] })
                  }
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                />
                {editingStory?.banner && !formData.banner && (
                  <div className="mt-4">
                    <p className="text-paragraph-text text-sm mb-2">
                      Current banner:
                    </p>
                    <img
                      src={getImageUrl(editingStory.banner)}
                      alt="Current banner"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                {formData.banner && (
                  <div className="mt-4">
                    <p className="text-paragraph-text text-sm mb-2">
                      New banner preview:
                    </p>
                    <img
                      src={URL.createObjectURL(formData.banner)}
                      alt="New banner preview"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-300"
                >
                  {editingStory ? "Update Story" : "Create Story"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-white text-royal-blue rounded-lg border-2 border-gray-300 hover:border-gold-accent font-semibold transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Stories List */}
        {stories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              No Stories Yet
            </h3>
            <p className="text-paragraph-text mb-6">
              Click "Add Story" to create your first homepage story.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-gold-accent/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="sm:w-48 w-full h-40 sm:h-auto flex-shrink-0">
                    {story.banner ? (
                      <img
                        src={getImageUrl(story.banner)}
                        alt={story.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-gold-accent/20 to-newari-red/20 text-newari-red text-xs font-bold rounded-full border border-newari-red/20">
                            {story.category || "Featured"}
                          </span>
                          {story.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-paragraph-text">
                              <svg
                                className="w-3 h-3"
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
                              {story.location}
                            </span>
                          )}
                          {story.author && (
                            <span className="inline-flex items-center gap-1 text-xs text-paragraph-text">
                              <svg
                                className="w-3 h-3"
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
                              {story.author}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-text whitespace-nowrap">
                          {story.created_at
                            ? new Date(story.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-charcoal-black mb-1 truncate">
                        {story.title}
                      </h3>
                      <p className="text-sm text-paragraph-text line-clamp-2 mb-2">
                        {story.excerpt}
                      </p>

                      {story.link && (
                        <a
                          href={story.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
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
                          <span className="underline truncate max-w-[200px]">
                            {story.link}
                          </span>
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleEdit(story)}
                        className="px-5 py-2 bg-gradient-to-r from-gold-accent/10 to-gold-accent/20 text-gold-accent border border-gold-accent/30 rounded-lg hover:bg-gold-accent hover:text-white transition-all duration-300 font-semibold text-sm flex items-center gap-1.5"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleDelete(story.id)}
                        className="px-5 py-2 bg-newari-red/10 text-newari-red border border-newari-red/30 rounded-lg hover:bg-newari-red hover:text-white transition-all duration-300 font-semibold text-sm flex items-center gap-1.5"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStories;
