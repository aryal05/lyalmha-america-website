import React, { useState, useEffect } from 'react'
import BlogCard from './BlogCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import banner1 from '../assets/images/posts/430057563_377416895039960_1581867728642530497_n.jpg'
import banner2 from '../assets/images/posts/433421627_946258180277784_6165530352102042076_n.jpg'
import banner3 from '../assets/images/posts/438077842_407204048727911_1401114441457624925_n.jpg'
import banner4 from '../assets/images/posts/441866713_422562883858694_1264372065029721811_n.jpg'
import banner5 from '../assets/images/posts/445713232_430645966383719_2625800335039061236_n.jpg'
import banner6 from '../assets/images/posts/448547716_444591268322522_5109717828163167239_n.jpg'
import banner7 from '../assets/images/posts/449231023_448907107890938_5740457435028912677_n.jpg'
import banner8 from '../assets/images/posts/462650425_598936739649734_2260957587124948845_n.jpg'

const BlogGrid = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Dummy blog data with local images
  const blogs = [
    {
      id: 1,
      title: 'Celebrating Indra Jatra in America: Keeping Traditions Alive',
      excerpt: 'Discover how the Newari community in America celebrates one of the most significant festivals, bringing the streets of Kathmandu to the heart of the USA.',
      banner: banner1,
      category: 'Festivals',
      author: 'Rajesh Shakya',
      date: 'December 15, 2025',
      readTime: 5
    },
    {
      id: 2,
      title: 'The Art of Newari Cuisine: Traditional Recipes Passed Down',
      excerpt: 'Explore authentic Newari dishes and learn the secrets behind classics like Yomari, Chatamari, and Bara that have been cherished for generations.',
      banner: banner2,
      category: 'Cuisine',
      author: 'Anita Tuladhar',
      date: 'December 12, 2025',
      readTime: 7
    },
    {
      id: 3,
      title: 'Newari Architecture: The Legacy of Pagoda Temples',
      excerpt: 'A deep dive into the architectural marvels of the Newari people and how these ancient building techniques inspire modern design.',
      banner: banner3,
      category: 'Architecture',
      author: 'Bikram Shrestha',
      date: 'December 10, 2025',
      readTime: 6
    },
    {
      id: 4,
      title: 'Newari Language and Literature: Preserving Our Mother Tongue',
      excerpt: 'Understanding the importance of Nepal Bhasa and efforts to teach the language to younger generations growing up abroad.',
      banner: banner4,
      category: 'Language',
      author: 'Suman Dangol',
      date: 'December 8, 2025',
      readTime: 8
    },
    {
      id: 5,
      title: 'Traditional Newari Music and Dance: A Cultural Journey',
      excerpt: 'From Dapa to Dhime music, explore the rhythmic traditions that define Newari celebrations and cultural expressions.',
      banner: banner5,
      category: 'Music & Dance',
      author: 'Pratima Maharjan',
      date: 'December 5, 2025',
      readTime: 6
    },
    {
      id: 6,
      title: 'Growing Up Newari in America: Stories from Our Community',
      excerpt: 'Personal narratives from second-generation Newari Americans balancing two cultures and finding their identity.',
      banner: banner6,
      category: 'Community',
      author: 'Aarav Joshi',
      date: 'December 1, 2025',
      readTime: 9
    },
    {
      id: 7,
      title: 'Cultural Workshops: Educating the Next Generation',
      excerpt: 'How our interactive workshops are helping children connect with their Newari roots through art, music, and language.',
      banner: banner7,
      category: 'Education',
      author: 'Maya Tuladhar',
      date: 'November 28, 2025',
      readTime: 5
    },
    {
      id: 8,
      title: 'Community Gatherings: Building Bonds Across Borders',
      excerpt: 'The importance of coming together as a community to celebrate our heritage and support one another.',
      banner: banner8,
      category: 'Community',
      author: 'Rajan Maharjan',
      date: 'November 20, 2025',
      readTime: 7
    }
  ]

  // Featured slider blogs (first 3)
  const featuredBlogs = blogs.slice(0, 3)

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [featuredBlogs.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBlogs.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBlogs.length) % featuredBlogs.length)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-deep-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Latest <span className="text-nepal-red">Stories</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dive into the rich tapestry of Newari culture through our curated collection of articles, 
            stories, and insights from our vibrant community.
          </p>
        </motion.div>

        {/* Featured Slider */}
        <div className="mb-16 relative">
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={featuredBlogs[currentSlide].banner}
                  alt={featuredBlogs[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/60 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="inline-block px-4 py-2 bg-nepal-red text-white text-sm font-semibold rounded-full mb-4">
                    {featuredBlogs[currentSlide].category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {featuredBlogs[currentSlide].title}
                  </h3>
                  <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                    {featuredBlogs[currentSlide].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400">
                      <span className="mr-4">By {featuredBlogs[currentSlide].author}</span>
                      <span>• {featuredBlogs[currentSlide].date}</span>
                    </div>
                    <Link to="/blogs" className="inline-block px-6 py-3 bg-usa-blue text-white rounded-lg hover:bg-nepal-red transition-colors duration-300">
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-nepal-red transition-all duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-nepal-red transition-all duration-300 z-10"
            >
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {featuredBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-nepal-red w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(3).map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/blogs" className="inline-block px-8 py-4 bg-transparent border-2 border-nepal-red text-nepal-red font-semibold rounded-lg hover:bg-nepal-red hover:text-white transform hover:scale-105 transition-all duration-300">
            Explore All Blogs
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogGrid
