import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient, API_ENDPOINTS } from "../config/api";
import letterpadLogo from "../assets/images/logo/Letter pad copy.png";
import paymentQR from "../assets/QR_PAYMENT/QR.png";
import SuccessPopup from "./SuccessPopup";

const MembershipRegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    full_address: "",
    city: "",
    zipcode: "",
    contact_no: "",
    email: "",
    family_id: "",
    referred_by: "",
    referral_name: "",
    referral_contact: "",
    membership_type: "individual",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.MEMBERSHIP.REGISTER,
        formData,
      );

      if (response.data.success) {
        setToken(response.data.data.membership_token);
        setSuccess(true);
        setPopupConfig({
          title: "Registration Successful!",
          message: `Thank you for registering for Life Membership! Your token is: ${response.data.data.membership_token}. A confirmation email has been sent to your email address.`,
          type: "success",
        });
        setShowPopup(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      full_address: "",
      city: "",
      zipcode: "",
      contact_no: "",
      email: "",
      family_id: "",
      referred_by: "",
      referral_name: "",
      referral_contact: "",
      membership_type: "individual",
    });
    setSuccess(false);
    setToken("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Logo */}
          <div className="bg-white p-6 rounded-t-2xl border-b border-gray-200 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
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
            <div className="text-center">
              {/* Full Logo - Not Circled */}
              <div className="mb-6">
                <img
                  src={letterpadLogo}
                  alt="Lyaymha America Guthi"
                  className="h-32 w-auto mx-auto object-contain"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-royal-blue mb-4">
                Life Membership Registration Form
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xl mx-auto">
                Lyaymha America Guthi is a non-profit community organization
                based in the DMV area, with the aim of preserving and advancing
                a deeper understanding of the Newah rich music, language, arts,
                and cultural heritage of Nepal. Our focus is on the younger
                generation, as they are the future bearers of our legacy and
                identity. We strive to educate and raise awareness among our
                children about our culture, language, and festivals. Lyaymha
                America has consistently demonstrated its concern for and
                commitment to preserving our identity through various programs.
              </p>
            </div>
          </div>

          {/* Payment QR Code Section - Always Visible */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-white p-2 rounded-lg border border-gray-200 flex-shrink-0">
                <img
                  src={paymentQR}
                  alt="Zelle Payment QR Code"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm font-bold text-royal-blue mb-2">
                  QR Code for online payment to LYAYMHA AMERICA GUTHI (LAG)
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Zelle Email ID:</strong>{" "}
                  <span className="text-royal-blue">
                    lyaymhaAmerica@gmail.com
                  </span>
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Membership Fees:</strong> Individual - $200 | Family -
                  $300
                </div>
              </div>
            </div>
          </div>

          {success ? (
            /* Success State */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-royal-blue mb-4">
                Registration Successful!
              </h3>
              <div className="bg-gold-accent/10 border-2 border-gold-accent rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Your Membership Token:
                </p>
                <p className="text-2xl font-bold text-gold-accent tracking-wider">
                  {token}
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Please save this token for your records. A confirmation email
                has been sent to your email address.
              </p>

              {/* Payment QR Code */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-semibold">
                  QR Code for online payment to LYAYMHA AMERICA GUTHI (LAG)
                </p>
                <p className="text-sm text-royal-blue font-medium mb-4">
                  Zelle Email ID: lyaymhaAmerica@gmail.com
                </p>
                <div className="bg-white p-3 rounded-lg inline-block border border-gray-200">
                  <img
                    src={paymentQR}
                    alt="Zelle Payment QR Code"
                    className="w-48 h-48 mx-auto object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  <strong>Membership Fees:</strong>
                  <br />
                  Individual - $200 | Family - $300
                </p>
              </div>

              <button
                onClick={handleClose}
                className="px-8 py-3 bg-royal-blue text-white rounded-xl font-semibold hover:bg-royal-blue/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="p-6">
              {/* Membership Type Selection */}
              <div className="bg-royal-blue/5 border-2 border-royal-blue/20 p-4 rounded-xl mb-6">
                <h3 className="text-royal-blue font-bold mb-3">
                  Select Membership Type <span className="text-red-500">*</span>
                </h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all hover:bg-royal-blue/5 flex-1 ${formData.membership_type === 'individual' ? 'border-royal-blue bg-royal-blue/5' : 'border-gray-200'}">
                    <input
                      type="radio"
                      name="membership_type"
                      value="individual"
                      checked={formData.membership_type === "individual"}
                      onChange={handleChange}
                      className="w-5 h-5 text-royal-blue"
                    />
                    <div>
                      <span className="text-gray-800 font-semibold">
                        Individual
                      </span>
                      <p className="text-gold-accent font-bold text-lg">$200</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all hover:bg-royal-blue/5 flex-1 ${formData.membership_type === 'family' ? 'border-royal-blue bg-royal-blue/5' : 'border-gray-200'}">
                    <input
                      type="radio"
                      name="membership_type"
                      value="family"
                      checked={formData.membership_type === "family"}
                      onChange={handleChange}
                      className="w-5 h-5 text-royal-blue"
                    />
                    <div>
                      <span className="text-gray-800 font-semibold">
                        Family
                      </span>
                      <p className="text-gold-accent font-bold text-lg">$300</p>
                    </div>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  One-time payment for lifetime membership
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Family ID */}
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Family ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="family_id"
                    value={formData.family_id}
                    onChange={handleChange}
                    placeholder="Enter your Family ID if you have one"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                  />
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter first name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-royal-blue font-semibold mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter last name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Full Address with City and Zipcode
                  </label>
                  <input
                    type="text"
                    name="full_address"
                    value={formData.full_address}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all mb-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                    />
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      placeholder="Zipcode"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Contact No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-royal-blue font-semibold mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                  />
                </div>

                {/* Referral Section */}
                <div className="border-t-2 border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-royal-blue mb-4">
                    Referred By
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="referred_by"
                          value="LAG Life member"
                          checked={formData.referred_by === "LAG Life member"}
                          onChange={handleChange}
                          className="w-4 h-4 text-royal-blue"
                        />
                        <span className="text-gray-700">LAG Life member</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="referred_by"
                          value="Community Members"
                          checked={formData.referred_by === "Community Members"}
                          onChange={handleChange}
                          className="w-4 h-4 text-royal-blue"
                        />
                        <span className="text-gray-700">Community Members</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="referred_by"
                          value="Others"
                          checked={formData.referred_by === "Others"}
                          onChange={handleChange}
                          className="w-4 h-4 text-royal-blue"
                        />
                        <span className="text-gray-700">Others</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-royal-blue font-semibold mb-2">
                        Referral First Name and Last Name
                      </label>
                      <input
                        type="text"
                        name="referral_name"
                        value={formData.referral_name}
                        onChange={handleChange}
                        placeholder="Enter referral's full name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-royal-blue font-semibold mb-2">
                        Email/Cell or Contact No
                      </label>
                      <input
                        type="text"
                        name="referral_contact"
                        value={formData.referral_contact}
                        onChange={handleChange}
                        placeholder="Enter referral's contact"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-bold text-royal-blue mb-3">
                    Benefits of Life Membership
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Lifetime membership with a one-time contribution
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Priority participation in LAG cultural and community
                        events
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Recognition as a Life Member with official playbadges
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Voting eligibility and participation in LAG general
                        meetings
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Eligibility to serve on executive committees and
                        leadership roles
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Discounted or free access to LAG events, workshops, and
                        programs
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Support for the preservation and promotion of Newars'
                        culture, language, and traditions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-gold-accent flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Legacy: contributions that support future generations
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-accent to-yellow-500 text-charcoal-black font-bold rounded-xl hover:from-gold-accent/90 hover:to-yellow-500/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Submit Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>

      {/* Success Popup */}
      <SuccessPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />
    </AnimatePresence>
  );
};

export default MembershipRegistrationModal;
