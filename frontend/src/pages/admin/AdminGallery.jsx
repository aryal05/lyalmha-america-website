import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS, API_URL } from '../../config/api'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'event',
    active: 1,
    order_index: 0,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GALLERY.GET_ALL)
      setGalleryItems(response.data.data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!imageFile && !editingImage) {
      alert('Please select an image')
      return
    }

    const data = new FormData()
    Object.keys(formData).forEach((key) => data.append(key, formData[key]))
    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
      if (editingImage) {
        await apiClient.put(API_ENDPOINTS.GALLERY.UPDATE(editingImage.id), data)
      } else {
        await apiClient.post(API_ENDPOINTS.GALLERY.CREATE, data)
      }
      fetchGallery()
      resetForm()
    } catch (error) {
      console.error('Error saving gallery image:', error)
      alert('Error saving image: ' + (error.response?.data?.error || 'Unknown error'))
    }
  }

  const handleEdit = (image) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      category: image.category,
      active: image.active,
      order_index: image.order_index,
    })
    setImagePreview(image.image)
    setImageFile(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await apiClient.delete(API_ENDPOINTS.GALLERY.DELETE(id))
        fetchGallery()
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'event',
      active: 1,
      order_index: 0,
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingImage(null)
    setShowForm(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredGallery = filterCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filterCategory)

  const categories = ['all', 'event', 'festival', 'workshop', 'community', 'celebration']

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
              Gallery Management
            </h1>
            <p className="text-paragraph-text">
              Upload and manage photo gallery images
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {showForm ? "🖼️ View Gallery" : "➕ Upload Image"}
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
              {editingImage ? "✏️ Edit Image" : "➕ Upload New Image"}
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
                    <option value="event">Event</option>
                    <option value="festival">Festival</option>
                    <option value="workshop">Workshop</option>
                    <option value="community">Community</option>
                    <option value="celebration">Celebration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Image * {editingImage && "(Upload new to replace)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                  required={!editingImage}
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
                    className="mt-4 w-full h-64 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-accent mb-2">
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
                    className="w-full px-4 py-2 bg-charcoal-black/50 border border-gold-accent/30 rounded-lg text-white focus:outline-none focus:border-gold-accent"
                  />
                </div>
                <div>
                  <label className="block text-gold-accent mb-2">Status</label>
                  <select
                    value={formData.active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-charcoal-black/50 border border-gold-accent/30 rounded-lg text-white focus:outline-none focus:border-gold-accent"
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
                  {editingImage ? "Update Image" : "Upload Image"}
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

        {/* Gallery View */}
        {!showForm && (
          <>
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    filterCategory === cat
                      ? "bg-gradient-to-r from-gold-accent to-newari-red text-white"
                      : "bg-white border-2 border-gray-300 text-paragraph-text hover:border-royal-blue"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </motion.button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGallery.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden group hover:border-royal-blue transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        image.image.startsWith("http")
                          ? image.image
                          : `${API_URL}${image.image}`
                      }
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          image.active
                            ? "bg-green-500/80 text-white"
                            : "bg-red-500/80 text-white"
                        }`}
                      >
                        {image.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-gold-accent/20 text-gold-accent rounded">
                        {image.category}
                      </span>
                      <span className="text-xs text-gold-accent/60">
                        #{image.order_index}
                      </span>
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-paragraph-text text-sm mb-4 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(image)}
                        className="flex-1 px-4 py-2 bg-gold-accent/20 text-gold-accent rounded-lg text-sm font-semibold hover:bg-gold-accent/30 transition-all"
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(image.id)}
                        className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all"
                      >
                        🗑️ Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {!showForm && filteredGallery.length === 0 && (
          <div className="text-center py-12 text-royal-blue font-semibold">
            <p className="text-xl">
              {filterCategory === "all"
                ? "No images found. Upload your first one!"
                : `No images found in "${filterCategory}" category.`}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminGallery
