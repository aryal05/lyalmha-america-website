import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { getImageUrl } from "../utils/imageHelper";
import fallbackBanner from "../assets/images/banners/f8334069-50ca-4b69-b9a9-480ba09cb41f.jpg";

const Contact = () => {
  const [heroBanner, setHeroBanner] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await apiClient.get(
          API_ENDPOINTS.BANNERS.GET_BY_LOCATION("contact")
        );
        console.log("Contact banner response:", response.data.data);
        const banners = response.data.data || [];
        if (banners.length > 0) {
          setHeroBanner(banners[0]);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    };
    fetchBanner();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-charcoal-black">
      <Navbar />

      {/* Premium Hero Section with Cultural Elements */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Mandala */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              heroBanner?.image &&
              (heroBanner.image.startsWith("http://") ||
                heroBanner.image.startsWith("https://"))
                ? getImageUrl(heroBanner.image)
                : fallbackBanner
            }
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/90 via-charcoal-black/85 to-charcoal-black"></div>
          <div className="absolute inset-0 mandala-pattern opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {/* Title with Traditional Corner Decorations */}
            <div className="relative inline-block mb-6">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-gold-accent/40 rounded-tl-lg"></div>
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-gold-accent/40 rounded-tr-lg"></div>

              <h1 className="text-5xl md:text-7xl font-bold text-white px-8">
                Get in{" "}
                <span className="bg-gradient-to-r from-gold-accent to-newari-red bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>

              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-gold-accent/40 rounded-bl-lg"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gold-accent/40 rounded-br-lg"></div>
            </div>

            {/* Pagoda Divider */}
            <div className="flex justify-center mb-6">
              <div className="pagoda-divider w-64"></div>
            </div>

            <p className="text-xl text-paragraph-text max-w-3xl mx-auto">
              Have questions or want to get involved? We'd love to hear from
              you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Premium Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="card-premium temple-corner relative">
                {/* Subtle Mandala Pattern Background */}
                <div className="absolute inset-0 mandala-pattern opacity-5 rounded-xl pointer-events-none"></div>

                <div className="relative z-10">
                  <h2 className="heading-lg mb-8">
                    Send us a <span className="text-gold-accent">Message</span>
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-white mb-2 font-semibold text-sm"
                        >
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-border-line focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 focus:outline-none transition-all duration-300 placeholder:text-muted-text"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-white mb-2 font-semibold text-sm"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-border-line focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 focus:outline-none transition-all duration-300 placeholder:text-muted-text"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-white mb-2 font-semibold text-sm"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-border-line focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 focus:outline-none transition-all duration-300 placeholder:text-muted-text"
                        placeholder="What is this about?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-white mb-2 font-semibold text-sm"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 bg-dark-navy/50 text-white rounded-lg border border-border-line focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 focus:outline-none transition-all duration-300 resize-none placeholder:text-muted-text"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn-gold w-full justify-center text-lg py-4"
                    >
                      Send Message
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Premium Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Premium Contact Details */}
              <div className="card-premium group hover:border-gold-accent/50 transition-all duration-300 temple-corner">
                <h3 className="heading-md mb-6">
                  Contact <span className="text-gold-accent">Information</span>
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:info@lyalmha-america.org"
                    className="flex items-start gap-3 p-4 rounded-lg bg-dark-navy/30 border border-border-line hover:border-gold-accent/50 hover:bg-dark-navy/50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-gold-accent/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-gold-accent"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Email</p>
                      <p className="text-paragraph-text text-sm group-hover:text-gold-accent transition-colors">
                        info@lyalmha-america.org
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+15551234567"
                    className="flex items-start gap-3 p-4 rounded-lg bg-dark-navy/30 border border-border-line hover:border-gold-accent/50 hover:bg-dark-navy/50 transition-all duration-300 group"
                  >
                    <div className="p-2 bg-gold-accent/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-gold-accent"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Phone</p>
                      <p className="text-paragraph-text text-sm group-hover:text-gold-accent transition-colors">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-navy/30 border border-border-line">
                    <div className="p-2 bg-gold-accent/10 rounded-lg">
                      <svg
                        className="w-5 h-5 text-gold-accent"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Location</p>
                      <p className="text-paragraph-text text-sm">
                        DMV Region
                        <br />
                        (DC, Maryland, Virginia)
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Social Media */}
              <div className="card-premium group hover:border-newari-red/50 transition-all duration-300 temple-corner relative">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold-accent/10 to-transparent rounded-tr-xl"></div>

                <h3 className="heading-md mb-6 relative z-10">
                  Follow <span className="text-newari-red">Us</span>
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="flex-1 h-14 bg-gradient-to-br from-dark-navy to-dark-navy/50 border border-border-line rounded-lg flex items-center justify-center hover:border-gold-accent hover:bg-gold-accent/10 transition-all duration-300 group"
                  >
                    <svg
                      className="w-6 h-6 text-paragraph-text group-hover:text-gold-accent transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="flex-1 h-14 bg-gradient-to-br from-dark-navy to-dark-navy/50 border border-border-line rounded-lg flex items-center justify-center hover:border-gold-accent hover:bg-gold-accent/10 transition-all duration-300 group"
                  >
                    <svg
                      className="w-6 h-6 text-paragraph-text group-hover:text-gold-accent transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Premium Call to Action */}
              <div className="card-premium bg-gradient-to-br from-gold-accent/20 to-newari-red/20 border-gold-accent/30 text-center group hover:border-gold-accent transition-all duration-300">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold-accent to-gold-accent/80 rounded-full flex items-center justify-center shadow-gold">
                    <svg
                      className="w-8 h-8 text-charcoal-black"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Join Our Community
                </h3>
                <p className="text-paragraph-text text-sm mb-6">
                  Become a part of our mission to preserve and celebrate Newari
                  culture
                </p>
                <Link
                  to="/about"
                  className="btn-secondary w-full justify-center"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Contact;
