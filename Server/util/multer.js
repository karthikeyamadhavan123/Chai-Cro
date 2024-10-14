const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      let folder = 'uploads/'; // Default folder

      // Check if the upload is for shop images
      if (file.fieldname === 'shop_image') {
        folder = 'uploads/shop_images/';
      } 
     else if(file.fieldname === 'product_image'){
      folder = 'uploads/product_images/';
     }

      ensureDirectoryExistence(folder); // Ensure the folder exists
      cb(null, folder); // Set the appropriate folder
    } catch (error) {
      console.error(`Error setting destination: ${error.message}`);
      cb(new Error('Failed to set upload destination'), null);
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
    } catch (error) {
      console.error(`Error setting filename: ${error}`);
      cb(new Error('Failed to set filename'), null);
    }
  }
});

// File filter for validation
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Invalid file type, only JPEG, PNG, and GIF are allowed!'), false);
//   }
// };

// Initialize multer with storage configuration and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  // fileFilter: fileFilter,
});

// Export the upload instance
module.exports = upload;