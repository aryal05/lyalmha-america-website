import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { apiClient, API_ENDPOINTS, API_URL } from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminBlogs.css";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    status: "published",
  });
  const [imageFile, setImageFile] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOGS.GET_ADMIN_ALL);
      setBlogs(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) {
      data.append("banner", imageFile);
    }

    try {
      if (editingBlog) {
        await apiClient.put(API_ENDPOINTS.BLOGS.UPDATE(editingBlog.id), data);
      } else {
        await apiClient.post(API_ENDPOINTS.BLOGS.CREATE, data);
      }
      fetchBlogs();
      resetForm();
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(
        "Error saving blog: " +
          (error.response?.data?.error || "Unknown error"),
      );
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      status: blog.status,
    });
    setImageFile(null); // Clear file input but keep blog.banner for preview
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.BLOGS.DELETE(id));
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      status: "published",
    });
    setImageFile(null);
    setEditingBlog(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-royal-blue font-semibold text-xl animate-pulse">
          Loading blogs...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="mandala-pattern absolute top-10 right-10 w-64 h-64 animate-spin-slow"></div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8 relative z-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-royal-blue mb-2">
              Blog Posts
            </h1>
            <p className="text-paragraph-text">
              Create and manage all blog articles
            </p>
            <div className="pagoda-divider opacity-30 mt-3 w-32"></div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingBlog(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {showForm ? "📋 View All Blogs" : "➕ Add Blog"}
          </motion.button>
        </motion.div>

        {/* WordPress-Style Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <form onSubmit={handleSubmit}>
              {/* WordPress-style 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Editor Area (Left - 70%) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Title Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-gray-300 rounded-lg hover:border-royal-blue transition-colors"
                  >
                    <input
                      type="text"
                      placeholder="Enter blog title here..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="w-full px-6 py-4 bg-transparent text-gray-900 text-2xl font-bold border-0 focus:outline-none placeholder:text-gray-500"
                    />
                  </motion.div>

                  {/* Rich Text Editor */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border-2 border-gray-300 rounded-lg hover:border-royal-blue transition-colors"
                  >
                    <div className="wordpress-editor">
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={(value) =>
                          setFormData({ ...formData, content: value })
                        }
                        placeholder="Write your blog content..."
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "image"],
                            ["clean"],
                          ],
                        }}
                        className="wordpress-quill"
                      />
                    </div>
                  </motion.div>

                  {/* Excerpt */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border-2 border-gray-300 rounded-lg hover:border-royal-blue transition-colors p-5"
                  >
                    <label className="block text-royal-blue font-semibold mb-3">
                      📝 Excerpt
                    </label>
                    <textarea
                      placeholder="Write a short excerpt (optional)"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      rows="3"
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    />
                  </motion.div>
                </div>

                {/* Sidebar (Right - 30%) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Publish Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-royal-blue transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                      <span className="text-2xl">📤</span>
                      <h3 className="font-bold text-royal-blue">Publish</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Status Selector */}
                      <div>
                        <label className="block text-royal-blue text-sm mb-2 font-semibold">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors text-sm"
                        >
                          <option value="draft">📝 Draft</option>
                          <option value="published">✅ Published</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 pt-4 border-t border-gold-accent/20">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-newari-red to-newari-red/80 text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/20 transition-all font-semibold"
                        >
                          {editingBlog ? "💾 Update" : "✨ Publish"}
                        </motion.button>
                        {editingBlog && (
                          <motion.button
                            type="button"
                            onClick={resetForm}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-3 bg-white text-royal-blue rounded-lg border-2 border-gray-300 hover:border-royal-blue transition-colors font-semibold"
                          >
                            ❌ Cancel
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Featured Image Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-royal-blue transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                      <span className="text-2xl">🖼️</span>
                      <h3 className="font-bold text-royal-blue">
                        Featured Image
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {editingBlog && editingBlog.banner && !imageFile && (
                        <div className="relative rounded-lg overflow-hidden border border-gold-accent/30">
                          <img
                            src={
                              editingBlog.banner.startsWith("http")
                                ? editingBlog.banner
                                : `${API_URL}${editingBlog.banner}`
                            }
                            alt="Current banner"
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 to-transparent"></div>
                          <p className="absolute bottom-2 left-2 text-xs text-white/80">
                            Current image
                          </p>
                        </div>
                      )}
                      {imageFile && (
                        <div className="relative rounded-lg overflow-hidden border border-gold-accent/30">
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt="New banner"
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 to-transparent"></div>
                          <p className="absolute bottom-2 left-2 text-xs text-white/80">
                            New image
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label
                        htmlFor="banner-upload"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-royal-blue cursor-pointer transition-all hover:bg-blue-50/30 text-sm"
                      >
                        <span className="text-xl">📁</span>
                        <span className="text-royal-blue font-semibold">
                          {imageFile
                            ? "Change Image"
                            : editingBlog
                              ? "Replace Image"
                              : "Upload Image"}
                        </span>
                      </label>
                    </div>
                  </motion.div>

                  {/* Category Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-royal-blue transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                      <span className="text-2xl">🏷️</span>
                      <h3 className="font-bold text-royal-blue">Category</h3>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g., Culture, Events"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors text-sm"
                    />
                  </motion.div>

                  {/* Author Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-royal-blue transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                      <span className="text-2xl">✍️</span>
                      <h3 className="font-bold text-royal-blue">Author</h3>
                    </div>

                    <input
                      type="text"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors text-sm"
                    />
                  </motion.div>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Blog List */}
        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden group hover:border-royal-blue transition-all"
              >
                {blog.banner && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        blog.banner.startsWith("http")
                          ? blog.banner
                          : `${API_URL}${blog.banner}`
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-gold-accent/20 text-gold-accent rounded">
                      {blog.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        blog.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-paragraph-text text-sm mb-2 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="text-xs text-paragraph-text mb-4">
                    {new Date(blog.created_at).toLocaleDateString()} •{" "}
                    {blog.author}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(blog)}
                      className="flex-1 px-4 py-2 bg-gold-accent/20 text-gold-accent rounded-lg text-sm font-semibold hover:bg-gold-accent/30 transition-all"
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(blog.id)}
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

        {!showForm && blogs.length === 0 && (
          <div className="text-center py-12 text-royal-blue font-semibold">
            <p className="text-xl">No blogs found. Create your first one!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
