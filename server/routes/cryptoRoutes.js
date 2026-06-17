const express = require('express')
const router  = express.Router()
const { initiateCryptoPayment, submitCryptoTransaction } = require('../controllers/cryptoController')
const { protect } = require('../middleware/authMiddleware')

router.post('/initiate', protect, initiateCryptoPayment)
router.post('/submit', protect, submitCryptoTransaction)

module.exports = router
