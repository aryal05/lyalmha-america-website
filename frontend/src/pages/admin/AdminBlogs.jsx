import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS } from '../../config/api'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    status: 'draft'
  })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOGS.GET_ADMIN_ALL)
      setBlogs(response.data.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach(key => data.append(key, formData[key]))
    if (imageFile) {
      data.append('banner', imageFile)
    }

    try {
      if (editingBlog) {
        await apiClient.put(API_ENDPOINTS.BLOGS.UPDATE(editingBlog.id), data)
      } else {
        await apiClient.post(API_ENDPOINTS.BLOGS.CREATE, data)
      }
      fetchBlogs()
      resetForm()
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Error saving blog: ' + (error.response?.data?.error || 'Unknown error'))
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      status: blog.status
    })
    setImageFile(null) // Clear file input but keep blog.banner for preview
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await apiClient.delete(API_ENDPOINTS.BLOGS.DELETE(id))
        fetchBlogs()
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', category: '', author: '', status: 'draft' })
    setImageFile(null)
    setEditingBlog(null)
    setShowForm(false)
  }

  if (loading) {
    return <AdminLayout><div className="text-white">Loading...</div></AdminLayout>
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Blog Posts</h1>
            <p className="text-gray-400">Manage all blog posts</p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingBlog(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-nepal-red text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {showForm ? "Cancel" : "+ New Blog"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-gray rounded-xl p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  required
                  className="px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className="px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none"
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <textarea
                placeholder="Excerpt (short description)"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                required
                rows="2"
                className="w-full px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none"
              />
              <textarea
                placeholder="Content (full article)"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows="6"
                className="w-full px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none"
              />
              <div>
                <label className="block text-white mb-2">Banner Image</label>
                {editingBlog && editingBlog.banner && !imageFile && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">
                      Current banner:
                    </p>
                    <img
                      src={`http://localhost:5000${editingBlog.banner}`}
                      alt="Current banner"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-700"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Upload a new image to replace this one
                    </p>
                  </div>
                )}
                {imageFile && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">
                      New banner preview:
                    </p>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="New banner preview"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-700"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-3 bg-deep-black text-white rounded-lg border border-gray-700 focus:border-nepal-red focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-nepal-red file:text-white file:cursor-pointer"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-nepal-red text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Blog List */}
        <div className="bg-accent-gray rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-deep-black">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t border-gray-800 hover:bg-deep-black/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{blog.title}</td>
                    <td className="px-6 py-4 text-gray-400">{blog.author}</td>
                    <td className="px-6 py-4 text-gray-400">{blog.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          blog.status === "published"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="px-4 py-2 bg-usa-blue text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No blogs yet. Create your first blog post!
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminBlogs
