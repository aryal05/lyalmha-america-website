import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    iconImage: null,
    image: null,
    order_index: 0,
    active: 1
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleIconImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, iconImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ACTIVITIES.GET_ALL);
      const kidsActivities = response.data.data.filter(a => a.category === 'kids');
      setActivities(kidsActivities.sort((a, b) => a.order_index - b.order_index));
    } catch (error) {
      console.error('Error fetching activities:', error);
      alert('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "This field is required";
    if (!formData.description.trim())
      errors.description = "This field is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFieldErrors({});
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('icon', formData.icon);
      data.append('category', 'kids');
      data.append('orderIndex', formData.order_index);
      data.append('active', formData.active);
      if (formData.image) {
        data.append('image', formData.image);
      }
      if (formData.iconImage) {
        data.append('iconImage', formData.iconImage);
      }

      if (editingActivity) {
        await apiClient.put(API_ENDPOINTS.ACTIVITIES.UPDATE(editingActivity.id), data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Activity updated successfully!');
      } else {
        await apiClient.post(API_ENDPOINTS.ACTIVITIES.CREATE, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Activity created successfully!');
      }
      resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      icon: activity.icon || '',
      iconImage: null,
      image: null,
      order_index: activity.order_index,
      active: activity.active
    });
    setImagePreview(activity.image || null);
    setIconPreview(activity.icon_image || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      await apiClient.delete(API_ENDPOINTS.ACTIVITIES.DELETE(id));
      alert('Activity deleted successfully!');
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', icon: '', iconImage: null, image: null, order_index: 0, active: 1 });
    setEditingActivity(null);
    setFieldErrors({});
    setShowForm(false);
    setImagePreview(null);
    setIconPreview(null);
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
              Kids Activities
            </h1>
            <p className="text-paragraph-text">
              Add, edit, or remove kids activities
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
                setEditingActivity(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "Add Activity"}
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
                  {editingActivity ? "Edit Activity" : "Add New Activity"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Title <span className="text-newari-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    data-field="title"
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 ${fieldErrors.title ? "border-newari-red" : "border-gray-300"} focus:border-royal-blue focus:outline-none transition-colors`}
                    placeholder="Activity title"
                  />
                  {fieldErrors.title && (
                    <p className="text-newari-red text-sm mt-1">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Description <span className="text-newari-red">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    data-field="description"
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 ${fieldErrors.description ? "border-newari-red" : "border-gray-300"} focus:border-royal-blue focus:outline-none transition-colors`}
                    rows="4"
                    placeholder="Activity description"
                  />
                  {fieldErrors.description && (
                    <p className="text-newari-red text-sm mt-1">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Icon Image (Symbol/Logo)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconImageChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                  />
                  {iconPreview && (
                    <div className="mt-4">
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="h-16 w-16 object-contain rounded-lg border-2 border-gray-300"
                      />
                      <p className="text-xs text-paragraph-text mt-1">
                        {editingActivity
                          ? "Current icon (upload new to replace)"
                          : "Icon preview"}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-paragraph-text mt-1">
                    Upload a small icon/symbol (will be displayed same size as
                    emoji)
                  </p>
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Activity Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="h-24 w-32 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <p className="text-xs text-paragraph-text mt-1">
                        {editingActivity
                          ? "Current image (upload new to replace)"
                          : "Image preview"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Order
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
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
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
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pagoda-divider opacity-20 my-4"></div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold"
                  >
                    {editingActivity ? "Update Activity" : "Create Activity"}
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-royal-blue font-semibold text-xl animate-pulse">
              Loading...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden group hover:border-royal-blue transition-all"
              >
                {activity.image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {activity.icon_image ? (
                      <img
                        src={activity.icon_image}
                        alt="icon"
                        className="h-6 w-6 object-contain"
                      />
                    ) : activity.icon ? (
                      <span className="text-lg">{activity.icon}</span>
                    ) : null}
                    <span
                      className={`text-xs px-2 py-1 rounded ${activity.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {activity.active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gold-accent/20 text-gold-accent rounded">
                      Order: {activity.order_index}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2">
                    {activity.title}
                  </h3>
                  <p className="text-paragraph-text text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(activity)}
                      className="flex-1 px-4 py-2 bg-gold-accent/20 text-gold-accent rounded-lg text-sm font-semibold hover:bg-gold-accent/30 transition-all"
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(activity.id)}
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

        {!showForm && activities.length === 0 && !loading && (
          <div className="text-center py-12 text-royal-blue font-semibold">
            <p className="text-xl">
              No activities found. Create your first one!
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminActivities;
