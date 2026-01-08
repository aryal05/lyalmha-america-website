import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { apiClient, API_ENDPOINTS } from '../config/api'
import { getImageUrl } from '../utils/imageHelper'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GALLERY.GET_ALL)
      setImages(response.data.data || [])
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(images.map(img => img.category))]
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter)

  return (
    <div className="min-h-screen bg-charcoal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-newari-red/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 mandala-pattern opacity-5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-gold-accent to-gold-accent/80 rounded-full shadow-gold"
            >
              <svg
                className="w-10 h-10 text-charcoal-black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary-text">Photo </span>
              <span className="text-gold-accent">Gallery</span>
            </h1>
            <p className="text-xl text-paragraph-text max-w-3xl mx-auto leading-relaxed">
              Capturing moments of celebration, tradition, and community spirit through our cultural events and activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === category
                  ? 'bg-gold-accent text-charcoal-black shadow-gold'
                  : 'bg-dark-navy text-paragraph-text hover:text-gold-accent border border-border-line hover:border-gold-accent'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image.image)}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/90 via-charcoal-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-gray-300 text-sm">{image.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-paragraph-text text-lg">No images found in this category.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold-accent transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={getImageUrl(selectedImage.image)}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-xl mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Gallery
