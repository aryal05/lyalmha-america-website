import app from '../server.js';

// Disable Vercel's built-in body parser so multer can handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
