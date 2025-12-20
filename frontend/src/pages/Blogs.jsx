import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import banner1 from '../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg'
import heroBg from '../assets/images/posts/471944315_555366943987150_1453996420800501859_n.jpg'
import post1 from '../assets/images/posts/430057563_377416895039960_1581867728642530497_n.jpg'
import post2 from '../assets/images/posts/433421627_946258180277784_6165530352102042076_n.jpg'
import post3 from '../assets/images/posts/438077842_407204048727911_1401114441457624925_n.jpg'
import post4 from '../assets/images/posts/441866713_422562883858694_1264372065029721811_n.jpg'
import post5 from '../assets/images/posts/445713232_430645966383719_2625800335039061236_n.jpg'

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Biskaa Jatra 2024: A Celebration of Heritage and Unity',
      excerpt: 'On April 13, 2024, our community came together for the 2nd Biskaa Jatra celebration in the DMV region, showcasing the magnificent Dyou-Kha replica.',
      category: 'Events',
      date: 'April 15, 2024',
      author: 'Lyalmha America Team',
      image: banner1
    },
    {
      id: 2,
      title: 'Building the Dyou-Kha: A Labor of Love and Tradition',
      excerpt: 'Behind the scenes of crafting an 8-foot tall, 150 lb replica of the sacred chariot - the first of its kind built outside Nepal-Mandala.',
      category: 'Culture',
      date: 'March 20, 2024',
      author: 'Project Team',
      image: post1
    },
    {
      id: 3,
      title: 'Cultural Workshops: Connecting Children with Their Roots',
      excerpt: 'Our interactive workshops teach the next generation about Newari traditions, language, and arts through engaging activities.',
      category: 'Education',
      date: 'February 10, 2024',
      author: 'Education Committee',
      image: post2
    },
    {
      id: 4,
      title: 'The Significance of Biskaa Jatra in Newari Culture',
      excerpt: 'Exploring the deep cultural and spiritual meaning behind this weeklong Spring celebration that brings together people and deities.',
      category: 'Culture',
      date: 'January 25, 2024',
      author: 'Cultural Heritage Team',
      image: post3
    },
    {
      id: 5,
      title: 'Community Spotlight: Our Generous Supporters',
      excerpt: 'Recognizing the individuals and businesses who make our cultural preservation efforts possible.',
      category: 'Community',
      date: 'December 15, 2023',
      author: 'Lyalmha America',
      image: post4
    },
    {
      id: 6,
      title: 'Traditional Music and Dance: The Heart of Our Celebrations',
      excerpt: 'From Dhime to Khin, discover the musical traditions that animate our festivals and bring our community together.',
      category: 'Music & Arts',
      date: 'November 30, 2023',
      author: 'Arts Committee',
      image: post5
    }
  ]

  return (
    <div className="min-h-screen bg-deep-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Blog Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-deep-black/85"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-nepal-red">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stories, insights, and updates from our community's journey in preserving and celebrating Newari culture
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-accent-gray rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-nepal-red/20 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent"></div>
                  <span className="absolute top-4 left-4 px-3 py-1 bg-nepal-red text-white text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-gray-400 text-sm mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">By {post.author}</span>
                    <button className="text-usa-blue font-semibold hover:text-nepal-red transition-colors duration-300">
                      Read More →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Blogs