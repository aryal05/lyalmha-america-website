import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import banner1 from '../assets/images/banners/4th Biskaa Jatraa Celebrations flyer (2).jpg'
import heroBg from '../assets/images/posts/467736461_487936857446592_6777699176984050234_n (1).jpg'
import post1 from '../assets/images/posts/430057563_377416895039960_1581867728642530497_n.jpg'
import post2 from '../assets/images/posts/433421627_946258180277784_6165530352102042076_n.jpg'

const Culture = () => {
  const festivals = [
    {
      title: 'Biskaa Jatra',
      description: 'A weeklong Spring celebration during Khai-Salhu (Spring Equinox) welcoming Spring Bloom, Good Health, Peace, and Prosperity.',
      image: banner1,
      highlights: ['Dyou-Kha Procession', 'Dhime & Khin Music', 'Community Gathering']
    },
    {
      title: 'Indra Jatra',
      description: 'One of the most significant festivals honoring Indra, the king of heaven, celebrated with masked dances and chariot processions.',
      image: post1,
      highlights: ['Kumari Procession', 'Traditional Dances', 'Eight-day Festival']
    },
    {
      title: 'Yomari Punhi',
      description: 'Celebration of the winter solstice with the preparation of Yomari, a sweet delicacy made of rice flour.',
      image: post2,
      highlights: ['Yomari Making', 'Family Gatherings', 'Cultural Stories']
    }
  ]

  const traditions = [
    {
      icon: '🎭',
      title: 'Traditional Arts',
      description: 'Wood carving, metal work, and thangka painting representing centuries of artistic excellence'
    },
    {
      icon: '🎵',
      title: 'Music & Dance',
      description: 'Dhime, Khin, and Bhusyaa create the rhythmic heartbeat of Newari celebrations'
    },
    {
      icon: '🏛️',
      title: 'Architecture',
      description: 'Pagoda-style temples and intricate wooden structures defining Newari craftsmanship'
    },
    {
      icon: '📖',
      title: 'Nepal Bhasa',
      description: 'Our mother tongue, a vital part of our identity and cultural heritage'
    },
    {
      icon: '🍲',
      title: 'Cuisine',
      description: 'Rich culinary traditions from Yomari and Bara to Chatamari and traditional feasts'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Guthi system bringing people together for cultural and social activities'
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
            alt="Culture Background"
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
              Newari <span className="text-nepal-red">Culture</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the rich heritage, traditions, and festivals that define the Newari civilization
            </p>
          </motion.div>

          {/* Major Festivals */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Major <span className="text-nepal-red">Festivals</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {festivals.map((festival, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-accent-gray rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-nepal-red/20 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={festival.image}
                      alt={festival.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">{festival.title}</h3>
                    <p className="text-gray-300 mb-4">{festival.description}</p>
                    <div className="space-y-2">
                      {festival.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-400">
                          <svg className="w-4 h-4 mr-2 text-usa-blue" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cultural Traditions */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Cultural <span className="text-nepal-red">Traditions</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {traditions.map((tradition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-accent-gray rounded-xl p-6 hover:bg-gradient-to-br hover:from-accent-gray hover:to-nepal-red/10 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4">{tradition.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nepal-red transition-colors duration-300">
                    {tradition.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{tradition.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* About Newari Civilization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-nepal-red/10 to-usa-blue/10 rounded-2xl p-8 md:p-12 border border-nepal-red/20"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              The Newari Civilization
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Newari people are the indigenous inhabitants of the Kathmandu Valley in Nepal, with a rich cultural heritage 
                spanning over two millennia. Our civilization has contributed significantly to art, architecture, trade, and culture 
                in the Himalayan region.
              </p>
              <p>
                The Dyou-Kha (chariot) symbolizes our civilization prior to the invention of wheels in human history, carried on 
                human shoulders as a testament to our ancestors' ingenuity and community spirit.
              </p>
              <p>
                In America, we continue to preserve and celebrate these traditions, ensuring that future generations remain connected 
                to their roots while embracing their new homeland.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Culture