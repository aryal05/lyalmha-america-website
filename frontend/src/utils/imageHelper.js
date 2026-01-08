// Helper function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary or other CDN), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path starting with /uploads/, it's likely a legacy path
  // These files may not exist on Railway (ephemeral storage)
  // Try to load from Railway backend, but will show placeholder if not found
  const API_URL = import.meta.env.VITE_API_URL || 'https://lyalmha-america-website-production.up.railway.app';
  
  // Return the Railway URL (will 404 if file doesn't exist)
  return `${API_URL}${imagePath}`;
};
