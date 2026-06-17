const express = require('express')
const router  = express.Router()
const { createProductRequest } = require('../controllers/productRequestController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createProductRequest)

module.exports = router
