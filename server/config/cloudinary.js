const cloudinary = require('cloudinary').v2

// Credentials are read from environment variables — never hardcoded here.
// Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET
// in your hosting platform's environment variables (e.g. Render dashboard).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary
