const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_images',  // Folder where images are stored
    format: async (req, file) => {
      const ext = file.mimetype.split('/')[1];  // Extract extension from MIME type
      if (['jpeg', 'jpg', 'png'].includes(ext)) {
        return ext;  // Return valid format
      } 
      return 'png';  // Default to 'png' if format not recognized
    },
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,  // Generate unique filename
  },
});

// Multer middleware setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB file size limit
});

module.exports = upload;
