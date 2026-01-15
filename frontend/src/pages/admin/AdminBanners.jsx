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
    title: "",
    description: "",
    position: "home",
    active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BANNERS.GET_ALL);
      setBanners(response.data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission - editingBanner:", editingBanner);
    console.log("Form submission - imageFile:", imageFile);

    // Validate that image is provided for new banners
    if (!editingBanner && !imageFile) {
      alert("Please select an image for the banner");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("position", formData.position);
      data.append("active", formData.active ? "1" : "0");

      // Only append image if a new file was selected
      if (imageFile) {
        data.append("image", imageFile);
      }

      console.log("FormData entries:");
      for (let pair of data.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
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
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setImageFile(null); // Clear any previous file selection
    setFormData({
      title: banner.title,
      description: banner.description || "",
      position: banner.position,
      active: banner.active === 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.BANNERS.DELETE(id));
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      console.log("=".repeat(60));
      console.log("🔄 TOGGLE OPERATION STARTED");
      console.log("Banner ID:", id);
      console.log(
        "Current status:",
        currentStatus,
        "(type:",
        typeof currentStatus,
        ")"
      );

      // Get the full banner data first
      const banner = banners.find((b) => b.id === id);
      if (!banner) {
        console.error("❌ Banner not found in list!");
        alert("Banner not found");
        return;
      }

      console.log("📦 Full banner object:", JSON.stringify(banner, null, 2));

      const newActiveValue = currentStatus === 1 ? 0 : 1;
      console.log(
        "📤 New active value:",
        newActiveValue,
        "(type:",
        typeof newActiveValue,
        ")"
      );

      const data = new FormData();
      data.append("title", banner.title);
      data.append("description", banner.description || "");
      data.append("position", banner.position);
      data.append("active", String(newActiveValue));

      console.log("📋 FormData contents:");
      console.log("  - title:", banner.title);
      console.log("  - description:", banner.description || "");
      console.log("  - position:", banner.position);
      console.log("  - active:", String(newActiveValue));

      console.log(
        "🌐 Sending PUT request to:",
        API_ENDPOINTS.BANNERS.UPDATE(id)
      );
      const response = await apiClient.put(
        API_ENDPOINTS.BANNERS.UPDATE(id),
        data
      );
      console.log("✅ Server response:", response.data);

      // Refresh banner list
      console.log("🔄 Refreshing banner list...");
      await fetchBanners();
      console.log("✅ TOGGLE OPERATION COMPLETED");
      console.log("=".repeat(60));
    } catch (error) {
      console.error("=".repeat(60));
      console.error("❌ TOGGLE OPERATION FAILED");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("=".repeat(60));
      alert(
        "Error updating banner status: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      position: "home",
      active: true,
    });
    setImageFile(null);
    setEditingBanner(null);
    setShowForm(false);
  };

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
              Banners Management
            </h1>
            <p className="text-paragraph-text">
              Manage website banners and hero images
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
                setEditingBanner(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "New Banner"}
          </motion.button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-royal-blue transition-colors mb-8 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-newari-red to-gold-accent rounded-full"></div>
                <h2 className="text-xl font-bold text-royal-blue">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Title <span className="text-newari-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    placeholder="Banner title"
                  />
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
                    rows="3"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    placeholder="Banner description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Position <span className="text-newari-red">*</span>
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    >
                      <option value="home">Home</option>
                      <option value="about">About Us</option>
                      <option value="blogs">Blogs</option>
                      <option value="news">News & Press</option>
                      <option value="gallery">Gallery</option>
                      <option value="culture">Culture</option>
                      <option value="kids-activities">Kids Activities</option>
                      <option value="contact">Contact</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Banner Image{" "}
                    {!editingBanner && (
                      <span className="text-newari-red">*</span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                      }
                    }}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                  />

                  {/* Show current banner image when editing */}
                  {editingBanner && editingBanner.image && !imageFile && (
                    <div className="mt-4">
                      <p className="text-paragraph-text text-sm mb-2">
                        Current banner:
                      </p>
                      <img
                        src={getImageUrl(editingBanner.image)}
                        alt="Current banner"
                        className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <p className="text-paragraph-text text-xs mt-1">
                        Upload a new image to replace this one
                      </p>
                    </div>
                  )}

                  {/* Show new image preview */}
                  {imageFile && (
                    <div className="mt-4">
                      <p className="text-paragraph-text text-sm mb-2">
                        New banner preview:
                      </p>
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="New banner preview"
                        className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-4 h-4 text-royal-blue bg-white border-2 border-gray-300 rounded focus:ring-royal-blue"
                  />
                  <label
                    htmlFor="active"
                    className="text-royal-blue font-semibold"
                  >
                    Active (Display on website)
                  </label>
                </div>

                <div className="pagoda-divider opacity-20 my-4"></div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold"
                  >
                    {editingBanner ? "Update Banner" : "Create Banner"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 bg-white text-royal-blue rounded-lg border-2 border-gray-300 hover:border-royal-blue transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Banners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6"
        >
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden flex flex-col md:flex-row relative group hover:border-royal-blue transition-colors"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

              {banner.image && (
                <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                  <img
                    src={getImageUrl(banner.image)}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal-black/50"></div>
                </div>
              )}
              <div className="flex-1 p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-royal-blue transition-colors mb-2">
                      {banner.title}
                    </h3>
                    {banner.description && (
                      <p className="text-sm text-paragraph-text">
                        {banner.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 flex-wrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        banner.active === 1
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {banner.active === 1 ? "● Active" : "○ Inactive"}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gold-accent/20 text-gold-accent border border-gold-accent/30 capitalize">
                      {banner.position === "kids-activities"
                        ? "Kids Activities"
                        : banner.position.replace("-", " ")}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      #{banner.order_index}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-paragraph-text flex items-center gap-1">
                    <span>🎯</span>
                    Display Order: #{banner.order_index}
                  </span>
                  <span className="text-sm text-paragraph-text">
                    {banner.order_index === 1
                      ? "(Shown first)"
                      : `(Shown ${
                          banner.order_index === 2
                            ? "second"
                            : banner.order_index === 3
                            ? "third"
                            : `${banner.order_index}th`
                        })`}
                  </span>
                </div>
                <div className="pagoda-divider opacity-20 mb-4"></div>
                <div className="flex gap-2 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleActive(banner.id, banner.active)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      banner.active === 1
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    }`}
                  >
                    {banner.active === 1 ? "Deactivate" : "Activate"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(banner)}
                    className="px-4 py-2 bg-gradient-to-r from-gold-accent/20 to-newari-red/20 text-gold-accent border border-gold-accent/30 rounded-lg hover:bg-gold-accent/30 transition-all duration-300 text-sm font-semibold"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(banner.id)}
                    className="px-4 py-2 bg-newari-red/20 text-newari-red border border-newari-red/30 rounded-lg hover:bg-newari-red/30 transition-all duration-300 text-sm font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {banners.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-2 border-gray-300 rounded-lg text-center py-16"
          >
            <div className="text-6xl mb-4 opacity-20">🖼️</div>
            <p className="text-royal-blue font-semibold text-lg">
              No banners yet
            </p>
            <p className="text-paragraph-text text-sm mt-2">
              Click "New Banner" to add one
            </p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminBanners
