// src/middlewares/upload.js – Multer middleware (memory storage) for image uploads
const multer = require('multer');

// Store files in memory so we can stream them to Cloudinary directly
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
