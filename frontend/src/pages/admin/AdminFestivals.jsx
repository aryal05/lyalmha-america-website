import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const AdminFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFestival, setEditingFestival] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    highlights: [''],
    order_index: 0,
    active: 1
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CULTURE.GET_FESTIVALS);
      setFestivals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching festivals:', error);
      alert('Failed to fetch festivals');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "This field is required";
    if (!formData.description.trim())
      errors.description = "This field is required";
    if (!formData.image && !editingFestival)
      errors.image = "This field is required";
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
      data.append('highlights', JSON.stringify(formData.highlights.filter(h => h.trim())));
      data.append('order_index', formData.order_index);
      data.append('active', formData.active);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingFestival) {
        await apiClient.put(API_ENDPOINTS.CULTURE.UPDATE_FESTIVAL(editingFestival.id), data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Festival updated successfully!');
      } else {
        await apiClient.post(API_ENDPOINTS.CULTURE.CREATE_FESTIVAL, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Festival created successfully!');
      }
      resetForm();
      fetchFestivals();
    } catch (error) {
      console.error('Error saving festival:', error);
      alert('Failed to save festival');
    }
  };

  const handleEdit = (festival) => {
    setEditingFestival(festival);
    const highlights = festival.highlights ? JSON.parse(festival.highlights) : [''];
    setFormData({
      title: festival.title,
      description: festival.description,
      image: null,
      highlights: highlights.length > 0 ? highlights : [''],
      order_index: festival.order_index,
      active: festival.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this festival?')) return;
    try {
      await apiClient.delete(API_ENDPOINTS.CULTURE.DELETE_FESTIVAL(id));
      alert('Festival deleted successfully!');
      fetchFestivals();
    } catch (error) {
      console.error('Error deleting festival:', error);
      alert('Failed to delete festival');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image: null, highlights: [''], order_index: 0, active: 1 });
    setEditingFestival(null);
    setFieldErrors({});
    setShowForm(false);
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights.length > 0 ? newHighlights : [''] });
  };

  const updateHighlight = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
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
              Major Festivals
            </h1>
            <p className="text-paragraph-text">
              Add, edit, or remove major festivals
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
                setEditingFestival(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "Add Festival"}
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
                  {editingFestival ? "Edit Festival" : "Add New Festival"}
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
                    placeholder="Festival title"
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
                    rows="6"
                    placeholder="Festival description"
                  />
                  {fieldErrors.description && (
                    <p className="text-newari-red text-sm mt-1">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Festival Image <span className="text-newari-red">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    data-field="image"
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.files[0] });
                      setFieldErrors((prev) => ({ ...prev, image: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 ${fieldErrors.image ? "border-newari-red" : "border-gray-300"} focus:border-royal-blue focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg`}
                  />
                  {fieldErrors.image && (
                    <p className="text-newari-red text-sm mt-1">
                      {fieldErrors.image}
                    </p>
                  )}
                  {editingFestival?.image && (
                    <div className="mt-4">
                      <p className="text-paragraph-text text-sm mb-2">
                        Current image:
                      </p>
                      <img
                        src={editingFestival.image}
                        alt="Current"
                        className="h-32 w-48 object-cover rounded-lg border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Highlights
                  </label>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                        placeholder="Enter highlight"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="px-4 py-3 bg-newari-red/10 text-newari-red rounded-lg border border-newari-red/30 hover:bg-newari-red hover:text-white transition-all font-semibold"
                      >
                        Remove
                      </motion.button>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-3 bg-royal-blue/10 text-royal-blue rounded-lg border border-royal-blue/30 hover:bg-royal-blue hover:text-white transition-all font-semibold"
                  >
                    + Add Highlight
                  </motion.button>
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
                    {editingFestival ? "Update Festival" : "Create Festival"}
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
            {festivals.map((festival) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden group hover:border-royal-blue transition-all"
              >
                {festival.image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={festival.image}
                      alt={festival.title}
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
                    <span
                      className={`text-xs px-2 py-1 rounded ${festival.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {festival.active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gold-accent/20 text-gold-accent rounded">
                      Order: {festival.order_index}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2">
                    {festival.title}
                  </h3>
                  <p className="text-paragraph-text text-sm mb-4 line-clamp-2">
                    {festival.description}
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(festival)}
                      className="flex-1 px-4 py-2 bg-gold-accent/20 text-gold-accent rounded-lg text-sm font-semibold hover:bg-gold-accent/30 transition-all"
                    >
                      ✏️ Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(festival.id)}
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

        {!showForm && festivals.length === 0 && !loading && (
          <div className="text-center py-12 text-royal-blue font-semibold">
            <p className="text-xl">
              No festivals found. Create your first one!
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFestivals;
