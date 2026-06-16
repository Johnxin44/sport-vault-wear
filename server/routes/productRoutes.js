const express = require('express')
const router  = express.Router()
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProductReview,
} = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/:id', getProductById)
router.post('/:id/reviews', protect, createProductReview)

module.exports = router
