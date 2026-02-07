import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminMembership = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MEMBERSHIP.GET_ALL);
      setRegistrations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiClient.put(API_ENDPOINTS.MEMBERSHIP.UPDATE_STATUS(id), {
        status,
      });
      fetchRegistrations();
      setSelectedRegistration(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDeleteClick = (reg, e) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(reg);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;
    try {
      await apiClient.delete(
        API_ENDPOINTS.MEMBERSHIP.DELETE(showDeleteConfirm.id),
      );
      fetchRegistrations();
      setSelectedRegistration(null);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Failed to delete registration");
    }
  };

  const handleEditClick = (reg, e) => {
    if (e) e.stopPropagation();
    setEditFormData({
      id: reg.id,
      first_name: reg.first_name || "",
      last_name: reg.last_name || "",
      email: reg.email || "",
      contact_no: reg.contact_no || "",
      full_address: reg.full_address || "",
      city: reg.city || "",
      zipcode: reg.zipcode || "",
      family_id: reg.family_id || "",
      referred_by: reg.referred_by || "",
      referral_name: reg.referral_name || "",
      referral_contact: reg.referral_contact || "",
      membership_type: reg.membership_type || "individual",
      status: reg.status || "pending",
    });
    setShowEditModal(true);
    setSelectedRegistration(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(
        API_ENDPOINTS.MEMBERSHIP.UPDATE(editFormData.id),
        editFormData,
      );
      fetchRegistrations();
      setShowEditModal(false);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating registration:", error);
      alert("Failed to update registration");
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesFilter = filter === "all" || reg.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      reg.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.membership_token?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-blue-100 text-blue-800 border-blue-300",
      paid: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    paid: registrations.filter((r) => r.status === "paid").length,
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-royal-blue mb-2">
            Membership Registrations
          </h1>
          <p className="text-paragraph-text">
            View and manage life membership registrations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500">Total Registrations</p>
            <p className="text-2xl font-bold text-royal-blue">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200 shadow-sm">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 shadow-sm">
            <p className="text-sm text-blue-700">Approved</p>
            <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 shadow-sm">
            <p className="text-sm text-green-700">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "paid", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? "bg-royal-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Registrations Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Token
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-royal-blue">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No registrations found
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedRegistration(reg)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {reg.membership_token}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {reg.first_name} {reg.last_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {reg.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {reg.contact_no}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(reg.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRegistration(reg);
                              }}
                              className="text-royal-blue hover:text-gold-accent transition-colors font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => handleEditClick(reg, e)}
                              className="text-green-600 hover:text-green-800 transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(reg, e)}
                              className="text-red-600 hover:text-red-800 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedRegistration && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRegistration(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-royal-blue">
                      Registration Details
                    </h2>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                      {selectedRegistration.membership_token}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRegistration(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Status:</span>
                  {getStatusBadge(selectedRegistration.status)}
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">First Name</label>
                    <p className="font-medium">
                      {selectedRegistration.first_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Name</label>
                    <p className="font-medium">
                      {selectedRegistration.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">
                      {selectedRegistration.contact_no}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">Address</label>
                    <p className="font-medium">
                      {selectedRegistration.full_address}
                      {selectedRegistration.city &&
                        `, ${selectedRegistration.city}`}
                      {selectedRegistration.zipcode &&
                        ` ${selectedRegistration.zipcode}`}
                    </p>
                  </div>
                  {selectedRegistration.family_id && (
                    <div>
                      <label className="text-sm text-gray-500">Family ID</label>
                      <p className="font-medium">
                        {selectedRegistration.family_id}
                      </p>
                    </div>
                  )}
                </div>

                {/* Referral Info */}
                {selectedRegistration.referred_by && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-royal-blue mb-3">
                      Referral Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">
                          Referred By
                        </label>
                        <p className="font-medium">
                          {selectedRegistration.referred_by}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Referral Name
                        </label>
                        <p className="font-medium">
                          {selectedRegistration.referral_name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">
                          Referral Contact
                        </label>
                        <p className="font-medium">
                          {selectedRegistration.referral_contact || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Date */}
                <div className="border-t pt-4">
                  <label className="text-sm text-gray-500">Registered On</label>
                  <p className="font-medium">
                    {new Date(selectedRegistration.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 flex flex-wrap gap-3">
                  <span className="text-sm text-gray-600 w-full mb-2">
                    Update Status:
                  </span>
                  <button
                    onClick={() =>
                      updateStatus(selectedRegistration.id, "pending")
                    }
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedRegistration.id, "approved")
                    }
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedRegistration.id, "paid")
                    }
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedRegistration.id, "rejected")
                    }
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="border-t pt-4 flex gap-3">
                  <button
                    onClick={() => handleEditClick(selectedRegistration)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                  >
                    ✏️ Edit Registration
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedRegistration)}
                    className="px-4 py-3 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold border-2 border-red-200"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
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
                  </div>
                  <h3 className="text-xl font-bold text-royal-blue mb-2">
                    Delete Registration?
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Are you sure you want to delete the registration for:
                  </p>
                  <p className="font-semibold text-gray-800 mb-1">
                    {showDeleteConfirm.first_name} {showDeleteConfirm.last_name}
                  </p>
                  <p className="text-sm text-gray-500 font-mono mb-6">
                    Token: {showDeleteConfirm.membership_token}
                  </p>
                  <p className="text-sm text-red-600 mb-6">
                    This action cannot be undone!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-royal-blue">
                      Edit Registration
                    </h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={editFormData.first_name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            first_name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={editFormData.last_name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            last_name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            email: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        Phone *
                      </label>
                      <input
                        type="text"
                        value={editFormData.contact_no}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            contact_no: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-royal-blue mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editFormData.full_address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          full_address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={editFormData.city}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        Zipcode
                      </label>
                      <input
                        type="text"
                        value={editFormData.zipcode}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            zipcode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        Family ID
                      </label>
                      <input
                        type="text"
                        value={editFormData.family_id}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            family_id: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-royal-blue mb-1">
                        Membership Type
                      </label>
                      <select
                        value={editFormData.membership_type}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            membership_type: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                      >
                        <option value="individual">Individual ($200)</option>
                        <option value="family">Family ($300)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-royal-blue mb-1">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="paid">Paid</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-royal-blue mb-3">
                      Referral Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Referred By
                        </label>
                        <select
                          value={editFormData.referred_by}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              referred_by: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                        >
                          <option value="">Select</option>
                          <option value="LAG Life member">
                            LAG Life member
                          </option>
                          <option value="Community Members">
                            Community Members
                          </option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Referral Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.referral_name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              referral_name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Referral Contact
                        </label>
                        <input
                          type="text"
                          value={editFormData.referral_contact}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              referral_contact: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-gold-accent to-newari-red text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminMembership;
