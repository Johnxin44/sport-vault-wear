const multer = require('multer')
const path   = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Stores uploaded images in /uploads with a unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`
    cb(null, uniqueName)
  },
})

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|jfif/

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
