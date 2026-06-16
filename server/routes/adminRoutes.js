const express = require('express')
const router  = express.Router()
const {
  getStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getUsers,
  deleteUser,
} = require('../controllers/adminController')
const { protect, admin } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

// Every route below requires a valid JWT AND an admin role
router.use(protect, admin)

// Stats
router.get('/stats', getStats)

// Products
router.get('/products', getAdminProducts)
router.post('/products', upload.single('image'), createProduct)
router.put('/products/:id', upload.single('image'), updateProduct)
router.delete('/products/:id', deleteProduct)

// Orders
router.get('/orders', getAdminOrders)
router.put('/orders/:id', updateOrderStatus)

// Users
router.get('/users', getUsers)
router.delete('/users/:id', deleteUser)

module.exports = router
