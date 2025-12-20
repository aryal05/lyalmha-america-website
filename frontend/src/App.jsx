import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'
import Culture from './pages/Culture'
import Contact from './pages/Contact'
import LoadingScreen from './components/LoadingScreen'
import ScrollToTopOnMount from './components/ScrollToTopOnMount'

function App() {
  return (
    <>
      <LoadingScreen />
      <Router>
        <ScrollToTopOnMount />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
