import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/images/logo/lyama (1) (1).png'

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true)
  const [hasShownBefore, setHasShownBefore] = useState(false)

  useEffect(() => {
    // Check if loading screen has been shown in this session
    const shown = sessionStorage.getItem('loadingShown')
    
    if (shown) {
      // Already shown, don't show again
      setLoading(false)
      setHasShownBefore(true)
    } else {
      // First time, show loading screen
      const timer = setTimeout(() => {
        setLoading(false)
        sessionStorage.setItem('loadingShown', 'true')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-deep-black flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <img 
                src={logo} 
                alt="Lyalmha America" 
                className="w-32 h-32 mx-auto object-contain"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex space-x-2 justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0
                }}
                className="w-3 h-3 bg-nepal-red rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.2
                }}
                className="w-3 h-3 bg-usa-blue rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: 0.4
                }}
                className="w-3 h-3 bg-nepal-red rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
