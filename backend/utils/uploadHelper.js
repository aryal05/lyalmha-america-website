import cloudinary from '../config/cloudinary.js'
import multer from 'multer'

// Configure multer for memory storage (for Cloudinary)
export const storage = multer.memoryStorage()

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype) {
      return cb(null, true)
    }
    cb(new Error('Only image files are allowed!'))
  },
})

// Helper function to upload file buffer to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `lyalmha/${folder}` },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    uploadStream.end(fileBuffer)
  })
}
