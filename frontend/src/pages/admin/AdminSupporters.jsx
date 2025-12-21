import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS } from '../../config/api'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminSupporters = () => {
  const [supporters, setSupporters] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingSupporter, setEditingSupporter] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'financial',
    contact_person: '',
    description: ''
  })

  useEffect(() => {
    fetchSupporters()
  }, [])

  const fetchSupporters = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUPPORTERS.GET_ALL)
      setSupporters(response.data.data)
    } catch (error) {
      console.error('Error fetching supporters:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSupporter) {
        await apiClient.put(API_ENDPOINTS.SUPPORTERS.UPDATE(editingSupporter.id), formData)
      } else {
        await apiClient.post(API_ENDPOINTS.SUPPORTERS.CREATE, formData)
      }
      fetchSupporters()
      resetForm()
    } catch (error) {
      console.error('Error saving supporter:', error)
      alert('Error saving supporter: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleEdit = (supporter) => {
    setEditingSupporter(supporter)
    setFormData({
      name: supporter.name,
      type: supporter.type,
      contact_person: supporter.contact_person || '',
      description: supporter.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supporter?')) {
      try {
        await apiClient.delete(API_ENDPOINTS.SUPPORTERS.DELETE(id))
        fetchSupporters()
      } catch (error) {
        console.error('Error deleting supporter:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'financial',
      contact_person: '',
      description: ''
    })
    setEditingSupporter(null)
    setShowForm(false)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Supporters Management
          </h1>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingSupporter(null);
                setShowForm(true);
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Supporter"}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingSupporter ? "Edit Supporter" : "Add New Supporter"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name/Organization
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="financial">Financial Supporter</option>
                  <option value="corporate">Corporate Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person (Optional)
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingSupporter ? "Update" : "Create"}
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supporters.map((supporter) => (
                <tr key={supporter.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {supporter.name}
                    </div>
                    {supporter.description && (
                      <div className="text-sm text-gray-500">
                        {supporter.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        supporter.type === "financial"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {supporter.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {supporter.contact_person || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(supporter)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supporter.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {supporters.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No supporters yet. Click "+ New Supporter" to add one.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSupporters
