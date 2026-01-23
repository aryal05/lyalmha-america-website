import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { apiClient, API_ENDPOINTS, API_URL } from '../../config/api'
import AdminLayout from '../../components/admin/AdminLayout'

const AdminGallery = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    event_type: "event",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [otherImageFiles, setOtherImageFiles] = useState([]);
  const [otherImagePreviews, setOtherImagePreviews] = useState([]);
  const [existingOtherImages, setExistingOtherImages] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EVENTS.GET_ALL);
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingEvent && !thumbnailFile) {
      alert("Please select a thumbnail image");
      return;
    }

    try {
      let eventId = editingEvent?.id;

      // Step 1: Update event details (fast)
      const eventFormData = new FormData();
      Object.keys(formData).forEach((key) => eventFormData.append(key, formData[key]));
      if (thumbnailFile) {
        eventFormData.append("image", thumbnailFile);
      }

      if (editingEvent) {
        await apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(editingEvent.id), eventFormData);
      } else {
        const response = await apiClient.post(API_ENDPOINTS.EVENTS.CREATE, eventFormData);
        eventId = response.data.data.id;
      }

      // Step 2: Upload other images in background (don't wait)
      if (otherImageFiles.length > 0) {
        const imagesFormData = new FormData();
        otherImageFiles.forEach((file) => imagesFormData.append("images", file));
        imagesFormData.append("thumbnailIndex", 0);

        // Upload in background, don't await
        apiClient.post(`${API_URL}/api/admin/event-images/${eventId}`, imagesFormData)
          .then(() => console.log("Images uploaded successfully"))
          .catch(err => console.error("Error uploading images:", err));
      }

      // Immediately refresh and close form
      fetchEvents();
      resetForm();
      alert(editingEvent ? "Event updated! Images uploading in background..." : "Event created! Images uploading in background...");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error: " + (error.response?.data?.error || "Unknown error"));
    }
  };

  const handleEdit = async (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      location: event.location || "",
      event_type: event.event_type || "event",
    });
    if (event.image) {
      setThumbnailPreview(event.image);
    }
    
    // Fetch existing other images
    try {
      const response = await apiClient.get(`${API_URL}/api/admin/event-images/${event.id}`);
      setExistingOtherImages(response.data.data || []);
    } catch (error) {
      console.error("Error fetching event images:", error);
      setExistingOtherImages([]);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event and all its images?")) return;

    try {
      await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id));
      fetchEvents();
      alert("Event deleted!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      event_type: "event",
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setOtherImageFiles([]);
    setOtherImagePreviews([]);
    setExistingOtherImages([]);
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setOtherImageFiles([...otherImageFiles, ...files]);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOtherImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeOtherImage = (index) => {
    setOtherImageFiles(otherImageFiles.filter((_, i) => i !== index));
    setOtherImagePreviews(otherImagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    if (!confirm("Delete this image?")) return;
    
    try {
      await apiClient.delete(`${API_URL}/api/admin/event-images/${imageId}`);
      setExistingOtherImages(existingOtherImages.filter(img => img.id !== imageId));
      alert("Image deleted!");
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-royal-blue font-semibold text-xl animate-pulse">
            Loading...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-royal-blue mb-2">
              Gallery Management
            </h1>
            <p className="text-paragraph-text">
              Manage events with thumbnail and gallery images
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold shadow-lg"
          >
            {showForm ? "📋 View Events" : "➕ Create Event"}
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-gray-300 rounded-lg p-5"
          >
            <h2 className="text-2xl font-bold text-royal-blue mb-6">
              {editingEvent ? "✏️ Edit Event" : "➕ Create New Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  >
                    <option value="event">Event</option>
                    <option value="festival">Festival</option>
                    <option value="workshop">Workshop</option>
                    <option value="community">Community</option>
                    <option value="celebration">Celebration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  rows="3"
                />
              </div>

              {/* THUMBNAIL IMAGE SECTION */}
              <div className="border-2 border-gold-accent/30 rounded-lg p-4 bg-gold-accent/5">
                <label className="block text-royal-blue font-bold mb-3 text-lg">
                  📸 Thumbnail Image * (Main Display Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  required={!editingEvent}
                />
                {thumbnailPreview && (
                  <div className="mt-4">
                    <img
                      src={thumbnailPreview.startsWith("http") ? thumbnailPreview : thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg border-4 border-gold-accent"
                    />
                  </div>
                )}
              </div>

              {/* OTHER IMAGES SECTION */}
              <div className="border-2 border-royal-blue/30 rounded-lg p-4 bg-royal-blue/5">
                <label className="block text-royal-blue font-bold mb-3 text-lg">
                  🖼️ Other Images (Gallery Images)
                </label>
                
                {/* Show existing images when editing */}
                {editingEvent && existingOtherImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Existing Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {existingOtherImages.map((img) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.image_url.startsWith("http") ? img.image_url : `${API_URL}${img.image_url}`}
                            alt="Existing"
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOtherImagesChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  multiple
                />
                <p className="text-sm text-gray-600 mt-2">
                  You can select multiple images at once or add them one by one
                </p>
                
                {otherImagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {otherImagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={preview}
                          alt={`Other ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeOtherImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg font-semibold"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-white text-royal-blue border-2 border-gray-300 rounded-lg font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {!showForm && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden hover:border-royal-blue transition-all"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {event.image ? (
                      <img
                        src={event.image.startsWith("http") ? event.image : `${API_URL}${event.image}`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-gold-accent/20 text-gold-accent rounded">
                        {event.event_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.event_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-paragraph-text text-sm mb-2">📍 {event.location}</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(event)}
                        className="flex-1 px-4 py-2 bg-gold-accent/20 text-gold-accent rounded-lg text-sm font-semibold"
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold"
                      >
                        🗑️ Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12 text-royal-blue font-semibold">
                <p className="text-xl">No events found. Create your first event!</p>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
