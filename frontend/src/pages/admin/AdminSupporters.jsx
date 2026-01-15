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
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetchSupporters();
  }, []);

  const fetchSupporters = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUPPORTERS.GET_ALL);
      setSupporters(response.data.data);
    } catch (error) {
      console.error("Error fetching supporters:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (logoFile) {
      data.append("logo", logoFile);
    }

    try {
      if (editingSupporter) {
        await apiClient.put(
          API_ENDPOINTS.SUPPORTERS.UPDATE(editingSupporter.id),
          data
        );
      } else {
        await apiClient.post(API_ENDPOINTS.SUPPORTERS.CREATE, data);
      }
      fetchSupporters();
      resetForm();
    } catch (error) {
      console.error("Error saving supporter:", error);
      alert(
        "Error saving supporter: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleEdit = (supporter) => {
    setEditingSupporter(supporter);
    setFormData({
      name: supporter.name,
      type: supporter.type,
      contact_person: supporter.contact_person || "",
      description: supporter.description || "",
    });
    setLogoFile(null);
    setLogoPreview(supporter.logo || null);
    setShowForm(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supporter?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.SUPPORTERS.DELETE(id));
        fetchSupporters();
      } catch (error) {
        console.error("Error deleting supporter:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "financial",
      contact_person: "",
      description: "",
    });
    setEditingSupporter(null);
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
              Supporters Management
            </h1>
            <p className="text-paragraph-text">
              Manage financial supporters and corporate sponsors
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
                setEditingSupporter(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "New Supporter"}
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
                  {editingSupporter ? "Edit Supporter" : "Add New Supporter"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Name/Organization{" "}
                      <span className="text-newari-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                      placeholder="Enter name or organization"
                    />
                  </div>

                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Type <span className="text-newari-red">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    >
                      <option value="financial">Financial Supporter</option>
                      <option value="corporate">Corporate Partner</option>
                    </select>
                  </div>
                </div>

                {/* Logo Upload - Only for Corporate */}
                {formData.type === "corporate" && (
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Corporate Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {logoPreview && (
                        <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden bg-white flex items-center justify-center p-2">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 text-royal-blue rounded-lg border-2 border-gray-300 hover:bg-blue-100 cursor-pointer transition-colors"
                        >
                          <span className="text-lg">🖼️</span>
                          <span>Choose Logo</span>
                        </label>
                        <p className="text-paragraph-text text-sm mt-2">
                          Recommended: Square image, max 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_person: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                      placeholder="Brief description"
                    />
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
                    {editingSupporter ? "Update Supporter" : "Create Supporter"}
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

        {/* Supporters Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

          <div className="relative z-10 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-blue-50/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Supporter
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supporters.map((supporter, index) => (
                  <motion.tr
                    key={supporter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {supporter.logo && supporter.type === "corporate" && (
                          <div className="w-12 h-12 rounded-lg border-2 border-gray-300 overflow-hidden bg-white flex items-center justify-center p-1 flex-shrink-0">
                            <img
                              src={supporter.logo}
                              alt={supporter.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {supporter.name}
                          </div>
                          {supporter.description && (
                            <div className="text-sm text-paragraph-text truncate">
                              {supporter.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          supporter.type === "financial"
                            ? "bg-newari-red/20 text-newari-red border border-newari-red/30"
                            : "bg-gold-accent/20 text-gold-accent border border-gold-accent/30"
                        }`}
                      >
                        {supporter.type === "financial"
                          ? "💰 Financial"
                          : "🏢 Corporate"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-paragraph-text">
                        {supporter.contact_person || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(supporter)}
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
                          onClick={() => handleDelete(supporter.id)}
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
            {supporters.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-20">🤝</div>
                <p className="text-royal-blue font-semibold text-lg">
                  No supporters yet
                </p>
                <p className="text-paragraph-text text-sm mt-2">
                  Click "New Supporter" to add one
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default AdminSupporters
