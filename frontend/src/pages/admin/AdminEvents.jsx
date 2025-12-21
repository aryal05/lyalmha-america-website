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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Events Management
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ New Event"}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) =>
                      setFormData({ ...formData, event_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Show current image preview when editing */}
                {editingEvent?.image && !formData.image && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm mb-2">Current image:</p>
                    <img
                      src={getImageUrl(editingEvent.image)}
                      alt="Current event"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Upload a new image to replace this one
                    </p>
                  </div>
                )}
                
                {/* Show new image preview */}
                {formData.image && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm mb-2">New image preview:</p>
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="New event preview"
                      className="w-48 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingEvent ? "Update" : "Create"}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {event.image && (
                <img
                  src={getImageUrl(event.image) || \"https://via.placeholder.com/150\"}\n                  alt={event.title}
                  className=\"w-full h-48 object-cover\"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}\n                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      event.event_type === "upcoming"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.event_type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {event.description}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  📅 {new Date(event.event_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  📍 {event.location}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No events yet. Click "+ New Event" to add one.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEvents
