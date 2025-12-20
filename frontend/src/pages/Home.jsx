import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BlogGrid from '../components/BlogGrid'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

const Home = () => {
  return (
    <div className="min-h-screen bg-deep-black">
      <Navbar />
      <Hero />
      <BlogGrid />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Home
