import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    status: "draft",
  });
  const [imageFile, setImageFile] = useState(null);

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
        "Error saving blog: " + (error.response?.data?.error || "Unknown error")
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
      status: "draft",
    });
    setImageFile(null);
    setEditingBlog(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-white">Loading...</div>
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gold-accent to-white bg-clip-text text-transparent mb-2">
              Blog Posts
            </h1>
            <p className="text-gold-accent/60">
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
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "New Blog"}
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
                    className="card-premium"
                  >
                    <input
                      type="text"
                      placeholder="Enter blog title here..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="w-full px-6 py-4 bg-transparent text-white text-2xl font-bold border-0 focus:outline-none placeholder:text-muted-text"
                    />
                  </motion.div>

                  {/* Rich Text Editor */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-premium"
                  >
                    <div className="wordpress-editor">
                      <ReactQuill
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
                    className="card-premium"
                  >
                    <label className="block text-gold-accent font-semibold mb-3">
                      📝 Excerpt
                    </label>
                    <textarea
                      placeholder="Write a short excerpt (optional)"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      rows="3"
                      className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors"
                    />
                  </motion.div>
                </div>

                {/* Sidebar (Right - 30%) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Publish Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-premium"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gold-accent/20">
                      <span className="text-2xl">📤</span>
                      <h3 className="font-bold text-white">Publish</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Status Selector */}
                      <div>
                        <label className="block text-gold-accent/80 text-sm mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors text-sm"
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
                            className="w-full px-4 py-3 bg-dark-navy/50 text-gold-accent rounded-lg border border-gold-accent/30 hover:border-gold-accent transition-colors font-semibold"
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
                    className="card-premium"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gold-accent/20">
                      <span className="text-2xl">🖼️</span>
                      <h3 className="font-bold text-white">Featured Image</h3>
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
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-navy/50 rounded-lg border-2 border-dashed border-gold-accent/30 hover:border-gold-accent cursor-pointer transition-all hover:bg-dark-navy text-sm"
                      >
                        <span className="text-xl">📁</span>
                        <span className="text-gold-accent">
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
                    className="card-premium"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gold-accent/20">
                      <span className="text-2xl">🏷️</span>
                      <h3 className="font-bold text-white">Category</h3>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g., Culture, Events"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors text-sm"
                    />
                  </motion.div>

                  {/* Author Box */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-premium"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gold-accent/20">
                      <span className="text-2xl">✍️</span>
                      <h3 className="font-bold text-white">Author</h3>
                    </div>

                    <input
                      type="text"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors text-sm"
                    />
                  </motion.div>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Blog List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

          <div className="relative z-10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-accent/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-accent uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-accent uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-accent uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-accent uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-accent uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gold-accent uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-accent/10">
                {blogs.map((blog, index) => (
                  <motion.tr
                    key={blog.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gold-accent/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-white">
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-text">{blog.author}</td>
                    <td className="px-6 py-4 text-muted-text">
                      {blog.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.status === "published"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-text">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(blog)}
                          className="p-2 text-gold-accent hover:bg-gold-accent/10 rounded-lg transition-colors"
                          title="Edit"
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
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 text-newari-red hover:bg-newari-red/10 rounded-lg transition-colors"
                          title="Delete"
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
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-20">📝</div>
                <p className="text-gold-accent/60 text-lg">No blogs yet</p>
                <p className="text-muted-text text-sm mt-2">
                  Click "New Blog" to add one
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs
