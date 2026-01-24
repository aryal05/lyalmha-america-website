import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../../config/api';
import { getImageUrl } from '../../utils/imageHelper';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', full_description: '', status: 'active',
    start_date: '', end_date: '', location: '', featured: 0, order_index: 0, active: 1,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.GET_ALL);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingProject) {
        await apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(editingProject.id), data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Project updated!');
      } else {
        await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Project created!');
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title, description: project.description,
      full_description: project.full_description || '', status: project.status,
      start_date: project.start_date || '', end_date: project.end_date || '',
      location: project.location || '', featured: project.featured,
      order_index: project.order_index, active: project.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
      alert('Project deleted!');
      fetchProjects();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', full_description: '', status: 'active',
      start_date: '', end_date: '', location: '', featured: 0, order_index: 0, active: 1,
    });
    setImageFile(null);
    setEditingProject(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <motion.button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-royal-blue hover:text-gold-accent mb-6 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </motion.button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-gold-accent bg-clip-text text-transparent">Manage Projects</h1>
              <p className="text-gray-600 mt-1">Create and manage projects</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-royal-blue to-gold-accent text-white font-semibold rounded-lg"
            >
              {showForm ? 'Cancel' : '+ Add Project'}
            </button>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-gold-accent to-newari-red rounded-full mt-4"></div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-white rounded-xl border-2 p-6"
            >
              <h2 className="text-xl font-bold text-royal-blue mb-4">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="Title" value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                  <input type="text" placeholder="Location" value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                </div>
                <textarea required rows="3" placeholder="Short Description" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                <textarea rows="6" placeholder="Full Description (HTML)" value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" placeholder="Start Date" value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                  <input type="text" placeholder="End Date" value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none">
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <input type="number" placeholder="Order" value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none" />
                  <select value={formData.featured} onChange={(e) => setFormData({ ...formData, featured: parseInt(e.target.value) })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none">
                    <option value={0}>Not Featured</option>
                    <option value={1}>Featured</option>
                  </select>
                  <select value={formData.active} onChange={(e) => setFormData({ ...formData, active: parseInt(e.target.value) })}
                    className="px-4 py-2 border-2 rounded-lg focus:border-royal-blue focus:outline-none">
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-2 border-2 rounded-lg" />
                {editingProject?.image && <img src={getImageUrl(editingProject.image)} alt="Current" className="h-20 rounded" />}
                <div className="flex gap-4">
                  <button type="submit" className="px-6 py-3 bg-gradient-to-r from-royal-blue to-gold-accent text-white font-semibold rounded-lg">
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 border-2 rounded-lg">Cancel</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No projects yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border-2 rounded-xl overflow-hidden hover:border-gold-accent transition-all">
                <div onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 grid grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      {project.image && <img src={getImageUrl(project.image)} alt={project.title} className="w-16 h-16 rounded-lg object-cover" />}
                      <div>
                        <p className="text-xs text-gray-500">Title</p>
                        <p className="font-bold text-royal-blue">{project.title}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {project.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Featured</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.featured ? 'bg-gold-accent text-charcoal-black' : 'bg-gray-100'}`}>
                        {project.featured ? '⭐ Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Order</p>
                      <p className="font-semibold">{project.order_index}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                      className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <svg className="w-6 h-6 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === project.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="border-t-2 bg-gray-50 p-6">
                      <p className="text-gray-800">{project.description}</p>
                      {project.location && <p className="mt-2"><strong>Location:</strong> {project.location}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
