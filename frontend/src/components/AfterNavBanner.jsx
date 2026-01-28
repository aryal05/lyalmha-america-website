import React from 'react'
import afternavImage from '../assets/images/afternav/afternav.png'

const AfterNavBanner = () => {
  return (
    <div className="w-full h-48 md:h-64 overflow-hidden">
      <img 
        src={afternavImage} 
        alt="Banner" 
        style={{ objectPosition: '10% 0%' }}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default AfterNavBanner
