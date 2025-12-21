import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS } from '../../config/api'
import { getImageUrl } from '../../utils/imageHelper'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    event_type: 'upcoming',
    image: null
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL)
      setEvents(response.data.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('event_date', formData.event_date)
      data.append('location', formData.location)
      data.append('event_type', formData.event_type)
      if (formData.image) {
        data.append('image', formData.image)
      }

      if (editingEvent) {
        await apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(editingEvent.id), data)
      } else {
        await apiClient.post(API_ENDPOINTS.EVENTS.CREATE, data)
      }
      fetchEvents()
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date?.split('T')[0] || '',
      location: event.location,
      event_type: event.event_type,
      image: null
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id))
        fetchEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      event_type: 'upcoming',
      image: null
    })
    setEditingEvent(null)
    setShowForm(false)
  }

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gold-accent to-white bg-clip-text text-transparent mb-2">
              Events Management
            </h1>
            <p className="text-gold-accent/60">
              Manage upcoming and past events
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
                setEditingEvent(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "New Event"}
          </motion.button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium mb-8 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-newari-red to-gold-accent rounded-full"></div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gold-accent bg-clip-text text-transparent">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gold-accent/80 font-medium mb-2">
                    Title <span className="text-newari-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <label className="block text-gold-accent/80 font-medium mb-2">
                    Description <span className="text-newari-red">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gold-accent/80 font-medium mb-2">
                      Event Date <span className="text-newari-red">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.event_date}
                      onChange={(e) =>
                        setFormData({ ...formData, event_date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gold-accent/80 font-medium mb-2">
                      Type <span className="text-newari-red">*</span>
                    </label>
                    <select
                      value={formData.event_type}
                      onChange={(e) =>
                        setFormData({ ...formData, event_type: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gold-accent/80 font-medium mb-2">
                    Location <span className="text-newari-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors"
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label className="block text-gold-accent/80 font-medium mb-2">
                    Event Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-gold-accent/30 focus:border-gold-accent focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gradient-to-r file:from-newari-red file:to-gold-accent file:text-white file:cursor-pointer hover:file:shadow-lg"
                  />

                  {/* Show current image preview when editing */}
                  {editingEvent?.image && !formData.image && (
                    <div className="mt-4">
                      <p className="text-gold-accent/60 text-sm mb-2">
                        Current image:
                      </p>
                      <img
                        src={getImageUrl(editingEvent.image)}
                        alt="Current event"
                        className="w-48 h-32 object-cover rounded-lg border border-gold-accent/30"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <p className="text-muted-text text-xs mt-1">
                        Upload a new image to replace this one
                      </p>
                    </div>
                  )}

                  {/* Show new image preview */}
                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-gold-accent/60 text-sm mb-2">
                        New image preview:
                      </p>
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="New event preview"
                        className="w-48 h-32 object-cover rounded-lg border border-gold-accent/30"
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
                    {editingEvent ? "Update Event" : "Create Event"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 bg-dark-navy/50 text-gold-accent rounded-lg border border-gold-accent/30 hover:bg-dark-navy transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium overflow-hidden relative group"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 mandala-pattern"></div>

              {event.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      getImageUrl(event.image) ||
                      "https://via.placeholder.com/150"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/90 to-transparent"></div>
                </div>
              )}
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-accent transition-colors">
                    {event.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      event.event_type === "upcoming"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {event.event_type}
                  </span>
                </div>
                <p className="text-sm text-muted-text mb-3 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gold-accent/80 flex items-center gap-2">
                    <span>📅</span>
                    {new Date(event.event_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gold-accent/80 flex items-center gap-2">
                    <span>📍</span>
                    {event.location}
                  </p>
                </div>
                <div className="pagoda-divider opacity-20 my-4"></div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(event)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-gold-accent/20 to-newari-red/20 text-gold-accent border border-gold-accent/30 rounded-lg hover:bg-gold-accent/30 transition-all duration-300 font-semibold"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 px-4 py-2 bg-newari-red/20 text-newari-red border border-newari-red/30 rounded-lg hover:bg-newari-red/30 transition-all duration-300 font-semibold"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-premium text-center py-16"
          >
            <div className="text-6xl mb-4 opacity-20">📅</div>
            <p className="text-gold-accent/60 text-lg">No events yet</p>
            <p className="text-muted-text text-sm mt-2">
              Click "New Event" to add one
            </p>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEvents
