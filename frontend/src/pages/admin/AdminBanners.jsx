import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS } from '../../config/api'
import { getImageUrl } from '../../utils/imageHelper'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminBanners = () => {
  const [banners, setBanners] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'hero',
    order_index: 0,
    link: '',
    active: true,
    image: null
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BANNERS.GET_ALL)
      setBanners(response.data.data)
    } catch (error) {
      console.error('Error fetching banners:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log("Form submission - editingBanner:", editingBanner);
    console.log("Form submission - formData.image:", formData.image);
    console.log("Form submission - imageFile:", imageFile);

    // Validate that image is provided for new banners
    if (!editingBanner && !formData.image) {
      alert("Please select an image for the banner");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("position", formData.position);
      data.append("order_index", formData.order_index);
      data.append("link", formData.link);
      data.append("active", formData.active ? "1" : "0");
      if (formData.image) {
        data.append("image", formData.image);
      }

      console.log("FormData entries:");
      for (let pair of data.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (editingBanner) {
        await apiClient.put(
          API_ENDPOINTS.BANNERS.UPDATE(editingBanner.id),
          data
        );
      } else {
        await apiClient.post(API_ENDPOINTS.BANNERS.CREATE, data);
      }
      fetchBanners();
      resetForm();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert(
        "Error saving banner: " + (error.response?.data?.error || error.message)
      );
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setImageFile(null)
    setFormData({
      title: banner.title,
      description: banner.description || '',
      position: banner.position,
      order_index: banner.order_index,
      link: banner.link || '',
      active: banner.active === 1,
      image: null
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await apiClient.delete(API_ENDPOINTS.BANNERS.DELETE(id))
        fetchBanners()
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      await apiClient.put(API_ENDPOINTS.BANNERS.UPDATE(id), {
        active: currentStatus === 1 ? 0 : 1
      })
      fetchBanners()
    } catch (error) {
      console.error('Error toggling banner status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      position: 'hero',
      order_index: 0,
      link: '',
      active: true,
      image: null
    })
    setImageFile(null)
    setEditingBanner(null)
    setShowForm(false)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Banners Management
          </h1>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingBanner(null);
                setShowForm(true);
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Banner"}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="hero">Home</option>
                    <option value="about">About</option>
                    <option value="blogs">Blogs</option>
                    <option value="culture">Culture</option>
                    <option value="contact">Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({ ...formData, order_index: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="/about or https://example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setFormData({ ...formData, image: file });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />

                {/* Show current banner image when editing */}
                {editingBanner && editingBanner.image && !imageFile && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm mb-2">
                      Current banner:
                    </p>
                    <img
                      src={getImageUrl(editingBanner.image)}
                      alt="Current banner"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Upload a new image to replace this one
                    </p>
                  </div>
                )}

                {/* Show new image preview */}
                {imageFile && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm mb-2">
                      New banner preview:
                    </p>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="New banner preview"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active (Display on website)
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingBanner ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden flex"
            >
              {banner.image && (
                <img
                  src={getImageUrl(banner.image)}
                  alt={banner.title}
                  className="w-64 h-40 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{banner.title}</h3>
                    {banner.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {banner.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span
                      className={`px-3 py-1 text-xs rounded ${
                        banner.active === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {banner.active === 1 ? "Active" : "Inactive"}
                    </span>
                    <span className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      {banner.position}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-sm text-gray-500">
                    Order: {banner.order_index}
                  </span>
                  {banner.link && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      🔗 Link
                    </a>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleActive(banner.id, banner.active)}
                    className={`px-4 py-2 rounded text-sm ${
                      banner.active === 1
                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {banner.active === 1 ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No banners yet. Click "+ New Banner" to add one.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminBanners
