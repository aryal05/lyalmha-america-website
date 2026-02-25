import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS, API_URL } from '../../config/api'
import AdminLayout from '../../components/admin/AdminLayout'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './AdminBlogs.css'

const AdminNews = () => {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "announcement",
    author: "Admin",
    published_date: new Date().toISOString().split("T")[0],
    active: 1,
    order_index: 0,
    link: "",
    link_title: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NEWS.GET_ALL);
      setNewsItems(response.data.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingNews) {
        await apiClient.put(API_ENDPOINTS.NEWS.UPDATE(editingNews.id), data);
      } else {
        await apiClient.post(API_ENDPOINTS.NEWS.CREATE, data);
      }
      fetchNews();
      resetForm();
    } catch (error) {
      console.error("Error saving news:", error);
      alert(
        "Error saving news: " +
          (error.response?.data?.error || "Unknown error"),
      );
    }
  };

  const handleEdit = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      category: news.category,
      author: news.author,
      published_date: news.published_date,
      active: news.active,
      order_index: news.order_index,
      link: news.link || "",
      link_title: news.link_title || "",
    });
    setImagePreview(news.image);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.NEWS.DELETE(id));
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "announcement",
      author: "Admin",
      published_date: new Date().toISOString().split("T")[0],
      active: 1,
      order_index: 0,
      link: "",
      link_title: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingNews(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-royal-blue font-semibold text-xl animate-pulse">
            Loading...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-royal-blue mb-2">
              News Management
            </h1>
            <p className="text-paragraph-text">
              Manage press releases, announcements, and media coverage
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {showForm ? "📋 View All News" : "➕ Add News"}
          </motion.button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-royal-blue transition-colors"
          >
            <h2 className="text-2xl font-bold text-royal-blue mb-6">
              {editingNews ? "✏️ Edit News" : "➕ Add New News"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="press-release">Press Release</option>
                    <option value="media-coverage">Media Coverage</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={formData.published_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        published_date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Content *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={modules}
                  className="quill-editor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Link Title (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.link_title}
                    onChange={(e) =>
                      setFormData({ ...formData, link_title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                    placeholder="e.g. Read Full Article"
                  />
                  <p className="text-xs text-paragraph-text mt-1">
                    Custom label for the link (defaults to showing the URL)
                  </p>
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Link URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                    placeholder="https://example.com"
                  />
                  <p className="text-xs text-paragraph-text mt-1">
                    External link for this news item
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                />
                {imagePreview && (
                  <img
                    src={
                      imagePreview.startsWith("blob:") ||
                      imagePreview.startsWith("http")
                        ? imagePreview
                        : `${API_URL}${imagePreview}`
                    }
                    alt="Preview"
                    className="mt-4 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order_index: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={formData.active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold"
                >
                  {editingNews ? "Update News" : "Create News"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-white text-royal-blue border-2 border-gray-300 rounded-lg font-semibold hover:border-royal-blue"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* News List */}
        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden group hover:border-royal-blue transition-all"
              >
                {news.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        news.image.startsWith("http")
                          ? news.image
                          : `${API_URL}${news.image}`
                      }
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-gold-accent/20 text-gold-accent rounded">
                      {news.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        news.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {news.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-paragraph-text text-sm mb-2 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="text-xs text-paragraph-text mb-2">
                    {news.published_date} • {news.author}
                  </div>
                  {news.link && (
                    <div className="flex items-center gap-1.5 mb-2 text-xs text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"
                        />
                      </svg>
                      <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline truncate max-w-[180px]"
                      >
                        {news.link_title || news.link}
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(news)}
                      className="flex-1 px-4 py-2 bg-gold-accent/20 text-gold-accent rounded-lg text-sm font-semibold hover:bg-gold-accent/30 transition-all"
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(news.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all"
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!showForm && newsItems.length === 0 && (
          <div className="text-center py-12 text-royal-blue font-semibold">
            <p className="text-xl">
              No news items found. Create your first one!
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminNews
