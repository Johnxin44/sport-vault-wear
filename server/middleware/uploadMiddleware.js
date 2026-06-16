const multer = require('multer')
const path   = require('path')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// Stores uploaded product images directly on Cloudinary instead of local disk.
// This is essential on platforms like Render's free tier, where the local
// filesystem is wiped on every restart/redeploy — Cloudinary keeps images
// permanently, accessible via a stable URL, regardless of server restarts.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sport-vault-wear',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Unique public_id so repeated uploads never overwrite each other
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
})

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const isValidExt  = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const isValidMime = allowedTypes.test(file.mimetype)

  if (isValidExt && isValidMime) return cb(null, true)
  cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

module.exports = upload
