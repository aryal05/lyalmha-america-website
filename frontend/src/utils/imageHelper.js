// Helper function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path, construct the full URL
  // But these won't work on Railway without the files
  const API_URL = import.meta.env.VITE_API_URL || 'https://lyalmha-america-website-production.up.railway.app';
  return `${API_URL}${imagePath}`;
};
