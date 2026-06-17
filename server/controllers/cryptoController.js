const asyncHandler = require('express-async-handler')
const QRCode       = require('qrcode')
const Order         = require('../models/Order')
const Product        = require('../models/Product')
const sendEmail      = require('../utils/sendEmail')
const { adminNewOrderTemplate } = require('../utils/emailTemplates')

// Your store's USDT (TRC20) wallet address — read from env, never hardcoded
const USDT_WALLET_ADDRESS = process.env.USDT_TRC20_ADDRESS

// @desc    Create a pending crypto order and return wallet address + QR code
// @route   POST /api/crypto/initiate
// @access  Private
const initiateCryptoPayment = asyncHandler(async (req, res) => {
  const { items, shippingAddress, customer, subtotal, shipping, total } = req.body

  if (!items || items.length === 0) {
    res.status(400)
    throw new Error('No order items provided')
  }

  if (!USDT_WALLET_ADDRESS) {
    res.status(500)
    throw new Error('Crypto payments are not configured yet. Please contact support.')
  }

  // Verify stock without decrementing yet — only decrement once payment is verified
  for (const item of items) {
    const product = await Product.findById(item.product)
    if (!product) {
      res.status(404)
      throw new Error(`Product not found: ${item.name}`)
    }
    if (product.countInStock < item.quantity) {
      res.status(400)
      throw new Error(`Not enough stock for ${product.name}`)
    }
  }

  const order = await Order.create({
    user: req.user._id,
    customer,
    items,
    shippingAddress,
    subtotal,
    shipping,
    total,
    status: 'pending',
    isPaid: false,
    paymentMethod: 'crypto',
    cryptoCurrency: 'USDT_TRC20',
  })

  // Generate a QR code (as a data URL) encoding the wallet address —
  // makes it easy for customers to scan with their wallet app instead of
  // manually copying a long address.
  const qrCodeDataUrl = await QRCode.toDataURL(USDT_WALLET_ADDRESS)

  res.status(201).json({
    orderId: order._id,
    walletAddress: USDT_WALLET_ADDRESS,
    network: 'TRC20 (Tron)',
    currency: 'USDT',
    amountDue: total,
    qrCode: qrCodeDataUrl,
  })
})

// @desc    Customer submits their transaction hash for manual verification
// @route   POST /api/crypto/submit
// @access  Private
const submitCryptoTransaction = asyncHandler(async (req, res) => {
  const { orderId, txHash } = req.body

  if (!txHash || txHash.trim().length < 10) {
    res.status(400)
    throw new Error('Please enter a valid transaction hash')
  }

  const order = await Order.findById(orderId)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error('Not authorized to update this order')
  }

  if (order.isPaid) {
    return res.json({ message: 'Order already verified', order })
  }

  order.cryptoTxHash = txHash.trim()
  order.status = 'awaiting_verification'
  await order.save()

  // Notify admin that a transaction needs manual verification (non-blocking)
  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🔍 Crypto payment needs verification — Order ${order._id}`,
    text: `A customer submitted a transaction hash for manual verification.\n\n` +
      `Order ID: ${order._id}\n` +
      `Customer: ${order.customer.firstName} ${order.customer.lastName} (${order.customer.email})\n` +
      `Amount: $${order.total.toFixed(2)} USDT (TRC20)\n` +
      `Transaction Hash: ${txHash.trim()}\n\n` +
      `Verify on Tronscan: https://tronscan.org/#/transaction/${txHash.trim()}\n\n` +
      `Log in to the admin dashboard to confirm or reject this order.`,
  })

  res.json({ message: 'Transaction submitted for verification', order })
})

module.exports = { initiateCryptoPayment, submitCryptoTransaction }
