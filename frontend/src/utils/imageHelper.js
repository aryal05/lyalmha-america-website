// Helper function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary or other CDN), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path starting with /uploads/, use the backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://lyalmha-america-website-g888.vercel.app';
  
  // Return the backend URL for local uploads
  return `${API_URL}${imagePath}`;
};

// Helper to check if an image URL is from Cloudinary (third-party)
export const isCloudinaryUrl = (url) => {
  return url && typeof url === 'string' && url.includes('res.cloudinary.com');
};

// Props to add to <img> tags for Cloudinary URLs to avoid tracking prevention warnings
export const getCrossOriginProps = (imageUrl) => {
  if (isCloudinaryUrl(imageUrl)) {
    return { crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' };
  }
  return {};
};
