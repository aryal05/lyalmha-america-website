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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Major Festivals</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Festival'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg mb-6"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingFestival ? 'Edit Festival' : 'Add New Festival'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Festival Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {editingFestival?.image && (
                  <div className="mt-2">
                    <img src={editingFestival.image} alt="Current" className="h-32 w-48 object-cover rounded" />
                    <p className="text-xs text-gray-500 mt-1">Current image (upload new to replace)</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Highlights</label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg"
                      placeholder="Enter highlight"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Highlight
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {editingFestival ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {festivals.map((festival) => (
                  <tr key={festival.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {festival.image ? (
                        <img src={festival.image} alt={festival.title} className="h-16 w-24 object-cover rounded" />
                      ) : (
                        <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{festival.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{festival.description}</td>
                    <td className="px-6 py-4">{festival.order_index}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${festival.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {festival.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(festival)} className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(festival.id)} className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFestivals;
