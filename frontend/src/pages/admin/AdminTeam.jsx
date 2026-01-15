import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const AdminTeam = () => {
  const [team, setTeam] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    category: "Advisor",
    bio: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      console.log("Fetching team members...");
      const response = await apiClient.get(API_ENDPOINTS.TEAM.GET_ALL);
      console.log("Team fetch response:", response.data);
      console.log("Team data:", response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        console.log("First team member:", response.data.data[0]);
        console.log("First member image:", response.data.data[0].image);
      }
      setTeam(response.data.data);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("role", formData.role);
      data.append("category", formData.category);
      data.append("bio", formData.bio);

      // Add cropped image if user selected a new image
      if (imageFile && completedCrop && imgRef.current) {
        console.log("Creating cropped image...");
        console.log("Completed crop:", completedCrop);
        const croppedImageBlob = await getCroppedImg(
          imgRef.current,
          completedCrop
        );
        console.log("Cropped image blob:", croppedImageBlob);
        data.append("image", croppedImageBlob, "team-member.jpg");
        console.log("Image appended to FormData");
      } else {
        console.log("No image to upload:", {
          imageFile,
          completedCrop,
          imgRef: imgRef.current,
        });
      }

      console.log("Submitting form data...");

      let response;
      if (editingMember) {
        response = await apiClient.put(
          API_ENDPOINTS.TEAM.UPDATE(editingMember.id),
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await apiClient.post(API_ENDPOINTS.TEAM.CREATE, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Server response:", response.data);
      fetchTeam();
      resetForm();
    } catch (error) {
      console.error("Error saving team member:", error);
      console.error("Error details:", error.response?.data);
      alert(
        "Error saving team member: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        // Reset crop when new image loads
        setCrop({
          unit: "%",
          width: 90,
          height: 90,
          x: 5,
          y: 5,
          aspect: 1,
        });
        setCompletedCrop(null);
      });
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      bio: member.bio || "",
    });
    setImageSrc(member.image || null);
    setImageFile(null);
    setCompletedCrop(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.TEAM.DELETE(id));
        fetchTeam();
      } catch (error) {
        console.error("Error deleting team member:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      category: "Advisor",
      bio: "",
    });
    setImageFile(null);
    setImageSrc(null);
    setCrop({
      unit: "%",
      width: 90,
      height: 90,
      x: 5,
      y: 5,
      aspect: 1,
    });
    setCompletedCrop(null);
    setEditingMember(null);
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
              Team Management
            </h1>
            <p className="text-paragraph-text">
              Manage your organization team members
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
                setEditingMember(null);
                setShowForm(true);
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold flex items-center gap-2"
          >
            <span className="text-xl">{showForm ? "✕" : "+"}</span>
            {showForm ? "Cancel" : "New Member"}
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
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Name <span className="text-newari-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                      placeholder="Member name"
                    />
                  </div>

                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Role <span className="text-newari-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                      placeholder="Position/role"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Category <span className="text-newari-red">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                  >
                    <option value="Advisor">Advisor</option>
                    <option value="Executive">Executive</option>
                    <option value="Life Member">Life Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="team-image-upload"
                  />
                  <label
                    htmlFor="team-image-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-royal-blue cursor-pointer transition-all hover:bg-blue-50/30 text-sm"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-royal-blue font-semibold">
                      {imageFile || imageSrc ? "Change Image" : "Upload Image"}
                    </span>
                  </label>

                  {imageSrc && (
                    <div className="mt-4">
                      <p className="text-sm text-paragraph-text mb-2">
                        Crop your image (drag to adjust):
                      </p>
                      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={1}
                        >
                          <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop preview"
                            style={{ maxHeight: "400px", width: "auto" }}
                            onLoad={(e) => {
                              const { width, height } = e.currentTarget;
                              const cropWidth = Math.min(
                                width * 0.9,
                                height * 0.9
                              );
                              const cropX = (width - cropWidth) / 2;
                              const cropY = (height - cropWidth) / 2;

                              const newCrop = {
                                unit: "px",
                                width: cropWidth,
                                height: cropWidth,
                                x: cropX,
                                y: cropY,
                                aspect: 1,
                              };
                              setCrop(newCrop);
                              setCompletedCrop(newCrop);
                            }}
                          />
                        </ReactCrop>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows="4"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-gray-300 focus:border-royal-blue focus:outline-none transition-colors"
                    placeholder="Team member bio"
                  />
                </div>

                <div className="pagoda-divider opacity-20 my-4"></div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-newari-red to-gold-accent text-white rounded-lg hover:shadow-lg hover:shadow-newari-red/30 transition-all duration-300 font-semibold"
                  >
                    {editingMember ? "Update Member" : "Create Member"}
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

        {/* Team Table */}
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
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-royal-blue uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {member.name}
                      </div>
                      {member.bio && (
                        <div className="text-sm text-paragraph-text truncate max-w-xs">
                          {member.bio}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-paragraph-text">
                        {member.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          member.category === "Executive"
                            ? "bg-newari-red/20 text-newari-red border border-newari-red/30"
                            : member.category === "Advisor"
                            ? "bg-gold-accent/20 text-gold-accent border border-gold-accent/30"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {member.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(member)}
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
                          onClick={() => handleDelete(member.id)}
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
            {team.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-20">👥</div>
                <p className="text-royal-blue font-semibold text-lg">
                  No team members yet
                </p>
                <p className="text-paragraph-text text-sm mt-2">
                  Click "New Member" to add one
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
