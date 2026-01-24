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
    image: null,
    order_index: 0,
    active: 1
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      image: null,
      order_index: activity.order_index,
      active: activity.active
    });
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
    setFormData({ title: '', description: '', icon: '', image: null, order_index: 0, active: 1 });
    setEditingActivity(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kids Activities</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg mb-6"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
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
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Activity Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {editingActivity?.image && (
                  <div className="mt-2">
                    <img src={editingActivity.image} alt="Current" className="h-20 w-20 object-cover rounded" />
                    <p className="text-xs text-gray-500 mt-1">Current image (upload new to replace)</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="🎭"
                  />
                </div>
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
                  {editingActivity ? 'Update' : 'Create'}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {activity.image ? (
                        <img src={activity.image} alt={activity.title} className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-2xl">{activity.icon}</td>
                    <td className="px-6 py-4 font-medium">{activity.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{activity.description}</td>
                    <td className="px-6 py-4">{activity.order_index}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${activity.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {activity.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(activity)} className="text-blue-600 hover:text-blue-800 mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(activity.id)} className="text-red-600 hover:text-red-800">
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

export default AdminActivities;
