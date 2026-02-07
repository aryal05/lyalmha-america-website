import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../../config/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminMembership = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const deleteRegistration = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }
    try {
      await apiClient.delete(API_ENDPOINTS.MEMBERSHIP.DELETE(id));
      fetchRegistrations();
      setSelectedRegistration(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Failed to delete registration");
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
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
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
            {["all", "pending", "approved", "paid", "rejected"].map((status) => (
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
            ))}
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
                        <td className="px-4 py-3">{getStatusBadge(reg.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRegistration(reg);
                            }}
                            className="text-royal-blue hover:text-gold-accent transition-colors"
                          >
                            View
                          </button>
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
                  <button
                    onClick={() => deleteRegistration(selectedRegistration.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMembership;
