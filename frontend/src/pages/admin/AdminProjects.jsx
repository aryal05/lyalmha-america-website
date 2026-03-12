import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, API_ENDPOINTS } from '../../config/api';
import { getImageUrl } from '../../utils/imageHelper';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    full_description: "",
    status: "active",
    start_date: "",
    end_date: "",
    location: "",
    featured: 0,
    order_index: 0,
    active: 1,
  });
  const [imageFile, setImageFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.GET_ALL);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "This field is required";
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
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append("image", imageFile);

    try {
      if (editingProject) {
        await apiClient.put(
          API_ENDPOINTS.PROJECTS.UPDATE(editingProject.id),
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        alert("Project updated!");
      } else {
        await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Project created!");
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      alert("Failed to save project");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      full_description: project.full_description || "",
      status: project.status,
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      location: project.location || "",
      featured: project.featured,
      order_index: project.order_index,
      active: project.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
      alert("Project deleted!");
      fetchProjects();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      full_description: "",
      status: "active",
      start_date: "",
      end_date: "",
      location: "",
      featured: 0,
      order_index: 0,
      active: 1,
    });
    setImageFile(null);
    setEditingProject(null);
    setFieldErrors({});
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
              Projects Management
            </h1>
            <p className="text-paragraph-text">Create and manage projects</p>
            <div className="pagoda-divider opacity-30 mt-3 w-32"></div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditingProject(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "New Project"}
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
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
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
                      placeholder="Project title"
                    />
                    {fieldErrors.title && (
                      <p className="text-newari-red text-sm mt-1">
                        {fieldErrors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                      placeholder="Project location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Short Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    data-field="description"
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      setFieldErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 ${fieldErrors.description ? "border-newari-red" : "border-gray-300"} focus:border-royal-blue focus:outline-none transition-colors`}
                    placeholder="Short description of the project"
                  />
                  {fieldErrors.description && (
                    <p className="text-newari-red text-sm mt-1">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Full Description (HTML)
                  </label>
                  <textarea
                    rows="6"
                    value={formData.full_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        full_description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    placeholder="Full description (supports HTML)"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
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
                      placeholder="Display order"
                    />
                  </div>
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Featured
                    </label>
                    <select
                      value={formData.featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featured: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    >
                      <option value={0}>Not Featured</option>
                      <option value={1}>Featured</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Active
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

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                  />
                  {editingProject?.image && (
                    <div className="mt-4">
                      <p className="text-paragraph-text text-sm mb-2">
                        Current image:
                      </p>
                      <img
                        src={getImageUrl(editingProject.image)}
                        alt="Current"
                        className="h-20 rounded-lg"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                <div className="pagoda-divider opacity-20 my-4"></div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold"
                  >
                    {editingProject ? "Update Project" : "Create Project"}
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

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-2 border-gray-300 rounded-lg text-center py-16"
          >
            <div className="text-6xl mb-4 opacity-20">📁</div>
            <h3 className="text-xl font-bold text-royal-blue mb-2">
              No Projects Yet
            </h3>
            <p className="text-paragraph-text">
              Click "New Project" to create your first project
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden hover:border-royal-blue transition-all duration-300"
              >
                <div
                  onClick={() =>
                    setExpandedId(expandedId === project.id ? null : project.id)
                  }
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      {project.image && (
                        <img
                          src={getImageUrl(project.image)}
                          alt={project.title}
                          className="w-16 h-16 rounded-lg object-cover"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <p className="text-xs text-paragraph-text">Title</p>
                        <p className="font-bold text-royal-blue">
                          {project.title}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-paragraph-text">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${project.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {project.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-paragraph-text">Featured</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${project.featured ? "bg-gold-accent text-charcoal-black" : "bg-gray-100"}`}
                      >
                        {project.featured ? "⭐ Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-paragraph-text">Order</p>
                      <p className="font-semibold">{project.order_index}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project);
                      }}
                      className="p-2.5 bg-gold-accent/20 text-gold-accent rounded-lg hover:bg-gold-accent/30 transition-colors"
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
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="p-2.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
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
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </motion.button>
                    <svg
                      className={`w-6 h-6 text-gold-accent transition-transform duration-300 ${expandedId === project.id ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === project.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-gray-200 bg-gray-50 p-6"
                    >
                      <p className="text-gray-800">{project.description}</p>
                      {project.location && (
                        <p className="mt-2 text-paragraph-text">
                          <strong className="text-royal-blue">Location:</strong>{" "}
                          {project.location}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
