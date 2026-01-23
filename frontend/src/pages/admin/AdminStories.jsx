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
    title: '',
    excerpt: '',
    content: '',
    banner: null,
    category: '',
    location: '',
    created_at: '',
    author: ''
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STORIES.GET_ALL);
      setStories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('excerpt', formData.excerpt);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('author', formData.author);
      if (formData.banner) {
        data.append('banner', formData.banner);
      }
      if (editingStory) {
        await apiClient.put(API_ENDPOINTS.STORIES.UPDATE(editingStory.id), data);
      } else {
        await apiClient.post(API_ENDPOINTS.STORIES.CREATE, data);
      }
      fetchStories();
      resetForm();
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story: ' + (error.response?.data?.error || error.message));
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
      author: story.author
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await apiClient.delete(API_ENDPOINTS.STORIES.DELETE(id));
        fetchStories();
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      banner: null,
      category: '',
      location: '',
      created_at: '',
      author: ''
    });
    setEditingStory(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="relative max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-royal-blue mb-2">Homepage Stories</h1>
            <p className="text-paragraph-text">Add, edit, or remove stories for the homepage section below.</p>
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
                  <label className="block text-royal-blue font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Story title"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Category"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Location"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Author"
                  />
                </div>
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">Excerpt *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                  placeholder="Short excerpt"
                />
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">Content *</label>
                <textarea
                  required
                  rows="5"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors"
                  placeholder="Full content"
                />
              </div>
              <div>
                <label className="block text-royal-blue font-semibold mb-2">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, banner: e.target.files[0] })}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-gold-accent focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                />
                {editingStory?.banner && !formData.banner && (
                  <div className="mt-4">
                    <p className="text-paragraph-text text-sm mb-2">Current banner:</p>
                    <img
                      src={getImageUrl(editingStory.banner)}
                      alt="Current banner"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}
                {formData.banner && (
                  <div className="mt-4">
                    <p className="text-paragraph-text text-sm mb-2">New banner preview:</p>
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
                  {editingStory ? 'Update Story' : 'Create Story'}
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

        {/* Stories Card Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10"
        >
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden bg-white shadow-lg h-full flex flex-col md:flex-row"
            >
              {/* Left: Image */}
              <div className="md:w-1/2 w-full h-56 md:h-auto flex flex-col">
                {story.banner ? (
                  <img
                    src={getImageUrl(story.banner)}
                    alt={story.title}
                    className="w-full h-full object-cover min-h-56 flex-1"
                    style={{ height: '100%' }}
                  />
                ) : (
                  <div className="w-full h-full min-h-56 flex-1 bg-gray-100" />
                )}
              </div>

              {/* Right: Content */}
              <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-between h-full">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-charcoal-black font-semibold rounded-full shadow-sm mb-4">
                  {story.category || 'Featured'}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-charcoal-black mb-4">
                  {story.title}
                </h3>
                <div className="w-14 h-1 bg-gold-accent rounded-full mb-6" />
                <p className="text-paragraph-text mb-6 max-w-xl">
                  {story.excerpt}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gold-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <div className="text-xs text-muted-text">Started</div>
                      <div className="font-medium text-charcoal-black">
                        {new Date(story.created_at).getFullYear() || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-newari-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 0011.314-11.314l-4.657 4.657z"
                      />
                    </svg>
                    <div>
                      <div className="text-xs text-muted-text">Location</div>
                      <div className="font-medium text-charcoal-black">
                        {story.location || 'Online'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(story)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gold-accent/20 to-newari-red/20 text-gold-accent border border-gold-accent/30 rounded-lg hover:bg-gold-accent/30 transition-all duration-300 font-semibold"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(story.id)}
                    className="flex-1 px-4 py-2 bg-newari-red/20 text-newari-red border border-newari-red/30 rounded-lg hover:bg-newari-red/30 transition-all duration-300 font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminStories;
