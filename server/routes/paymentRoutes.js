const express = require('express')
const router  = express.Router()
const { initiatePayment, verifyPayment } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/initiate', protect, initiatePayment)
router.get('/verify', protect, verifyPayment)

module.exports = router
