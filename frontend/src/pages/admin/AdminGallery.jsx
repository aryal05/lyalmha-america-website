import React, { useState, useEffect } from 'react'
import axios from "axios";
import { motion } from "framer-motion";
import { apiClient, API_ENDPOINTS, API_URL } from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminGallery = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    event_end_time: "",
    location: "",
    event_type: "event",
    more_images_link: "",
    event_link: "",
    event_link_title: "",
  });

  // Format 24h time (HH:mm) to 12h format (h:mm AM/PM ET)
  const formatEventTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm} ET`;
  };
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
      Object.keys(formData).forEach((key) =>
        eventFormData.append(key, formData[key]),
      );
      if (formData.more_images_link) {
        eventFormData.append("more_images_link", formData.more_images_link);
      }
      if (formData.event_link) {
        eventFormData.append("event_link", formData.event_link);
      }
      if (thumbnailFile) {
        eventFormData.append("image", thumbnailFile);
      }

      if (editingEvent) {
        await apiClient.put(
          API_ENDPOINTS.EVENTS.UPDATE(editingEvent.id),
          eventFormData,
        );
      } else {
        const response = await apiClient.post(
          API_ENDPOINTS.EVENTS.CREATE,
          eventFormData,
        );
        eventId = response.data.data.id;
      }

      // Step 2: Upload other images directly to Cloudinary (bypasses Vercel size limit)
      if (otherImageFiles.length > 0) {
        // Get Cloudinary signature from backend
        const sigResponse = await apiClient.get(
          API_ENDPOINTS.EVENT_IMAGES.CLOUDINARY_SIGNATURE,
        );
        const { signature, timestamp, cloud_name, api_key, folder } =
          sigResponse.data;

        // Upload each image directly to Cloudinary from the browser
        const uploadPromises = otherImageFiles.map(async (file) => {
          const cloudFormData = new FormData();
          cloudFormData.append("file", file);
          cloudFormData.append("api_key", api_key);
          cloudFormData.append("timestamp", timestamp);
          cloudFormData.append("signature", signature);
          cloudFormData.append("folder", folder);

          const cloudRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            cloudFormData,
          );
          return cloudRes.data.secure_url;
        });

        // Upload all to Cloudinary, then save URLs to backend
        Promise.all(uploadPromises)
          .then(async (urls) => {
            await apiClient.post(
              API_ENDPOINTS.EVENT_IMAGES.SAVE_URLS(eventId),
              { urls, thumbnailIndex: 0 },
            );
            console.log("Images uploaded and saved successfully");
            fetchEvents();
          })
          .catch((err) => console.error("Error uploading images:", err));
      }

      // Immediately refresh and close form
      fetchEvents();
      resetForm();
      alert(
        editingEvent
          ? "Event updated! Images uploading in background..."
          : "Event created! Images uploading in background...",
      );
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
      event_date: event.event_date?.split("T")[0] || event.event_date,
      event_time: event.event_time || "",
      event_end_time: event.event_end_time || "",
      location: event.location || "",
      event_type: event.event_type || "event",
      more_images_link: event.more_images_link || "",
      event_link: event.event_link || "",
      event_link_title: event.event_link_title || "",
    });
    if (event.image) {
      setThumbnailPreview(event.image);
    }

    // Fetch existing other images
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.EVENT_IMAGES.GET_BY_EVENT(event.id),
      );
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
      event_time: "",
      event_end_time: "",
      location: "",
      event_type: "event",
      more_images_link: "",
      event_link: "",
      event_link_title: "",
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
        setOtherImagePreviews((prev) => [...prev, reader.result]);
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
      await apiClient.delete(API_ENDPOINTS.EVENT_IMAGES.DELETE(imageId));
      setExistingOtherImages(
        existingOtherImages.filter((img) => img.id !== imageId),
      );
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
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    📅 Event Date (Eastern US) *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                    required
                  />
                  {formData.event_date && (
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      ✅{" "}
                      {new Date(
                        formData.event_date + "T00:00:00Z",
                      ).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    ⏰ Event Start Time (Eastern US)
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) =>
                      setFormData({ ...formData, event_time: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  />
                  {formData.event_time && (
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      ✅ Starts at {formatEventTime(formData.event_time)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { l: "9 AM", v: "09:00" },
                      { l: "10 AM", v: "10:00" },
                      { l: "12 PM", v: "12:00" },
                      { l: "2 PM", v: "14:00" },
                      { l: "5 PM", v: "17:00" },
                      { l: "6 PM", v: "18:00" },
                    ].map((t) => (
                      <button
                        key={t.v}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, event_time: t.v })
                        }
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                          formData.event_time === t.v
                            ? "bg-royal-blue text-white border-royal-blue"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    ⏰ Event End Time (Eastern US)
                  </label>
                  <input
                    type="time"
                    value={formData.event_end_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_end_time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  />
                  {formData.event_end_time && (
                    <p className="text-sm text-green-600 mt-1 font-medium">
                      ✅ Ends at {formatEventTime(formData.event_end_time)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { l: "12 PM", v: "12:00" },
                      { l: "2 PM", v: "14:00" },
                      { l: "5 PM", v: "17:00" },
                      { l: "6 PM", v: "18:00" },
                      { l: "8 PM", v: "20:00" },
                      { l: "9 PM", v: "21:00" },
                    ].map((t) => (
                      <button
                        key={t.v}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, event_end_time: t.v })
                        }
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                          formData.event_end_time === t.v
                            ? "bg-royal-blue text-white border-royal-blue"
                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Date/Time Preview */}
              {(formData.event_date || formData.event_time) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-royal-blue mb-1">
                    🇺🇸 Event in Eastern US Time:
                  </p>
                  <p className="text-base text-gray-800">
                    {formData.event_date
                      ? new Date(
                          formData.event_date + "T00:00:00Z",
                        ).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "(select date)"}
                    {formData.event_time
                      ? ` at ${formatEventTime(formData.event_time)}`
                      : ""}
                    {formData.event_end_time
                      ? ` - ${formatEventTime(formData.event_end_time)}`
                      : ""}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  />
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Event Type
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) =>
                      setFormData({ ...formData, event_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  >
                    <option value="event">Event</option>
                    <option value="festival">Festival</option>
                    <option value="workshop">Workshop</option>
                    <option value="community">Community</option>
                    <option value="celebration">Celebration</option>
                    <option value="past">Past</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  rows="3"
                />
              </div>

              {/* MORE IMAGES LINK */}
              <div>
                <label className="block text-royal-blue font-semibold mb-2">
                  🔗 More Images Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.more_images_link}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      more_images_link: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                  placeholder="https://drive.google.com/... or any external link"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Link to more images (e.g., Google Drive, Flickr). Shown as
                  "For More Images" button in the gallery page.
                </p>
              </div>

              {/* EVENT LINK */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    🔗 Event Link Title (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.event_link_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_link_title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                    placeholder="e.g. Register Here"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Custom label for the link button (defaults to "Event Link")
                  </p>
                </div>
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    🔗 Event Link URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.event_link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_link: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-royal-blue"
                    placeholder="https://example.com/event-page"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    URL for the event (e.g., Facebook event, registration page).
                  </p>
                </div>
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
                      src={
                        thumbnailPreview.startsWith("http")
                          ? thumbnailPreview
                          : thumbnailPreview
                      }
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
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Existing Images:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {existingOtherImages.map((img) => (
                        <div key={img.id} className="relative">
                          <img
                            src={
                              img.image_url.startsWith("http")
                                ? img.image_url
                                : `${API_URL}${img.image_url}`
                            }
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
                        src={
                          event.image.startsWith("http")
                            ? event.image
                            : `${API_URL}${event.image}`
                        }
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
                        {new Date(
                          event.event_date + "T00:00:00Z",
                        ).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {event.event_time && (
                          <span className="ml-1">
                            ⏰ {formatEventTime(event.event_time)}
                            {event.event_end_time && (
                              <> - {formatEventTime(event.event_end_time)}</>
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="text-paragraph-text text-sm mb-2">
                        📍 {event.location}
                      </p>
                    )}
                    {event.event_link && (
                      <div className="flex items-center gap-1.5 mb-2 text-xs text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <a
                          href={event.event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline truncate max-w-[150px]"
                        >
                          {event.event_link_title || "Event Link"}
                        </a>
                      </div>
                    )}
                    {event.more_images_link && (
                      <div className="flex items-center gap-1.5 mb-2 text-xs text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <a
                          href={event.more_images_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline truncate max-w-[150px]"
                        >
                          More Images
                        </a>
                      </div>
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
                <p className="text-xl">
                  No events found. Create your first event!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
