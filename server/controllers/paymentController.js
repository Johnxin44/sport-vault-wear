const asyncHandler = require('express-async-handler')
const axios        = require('axios')
const Order        = require('../models/Order')
const Product      = require('../models/Product')
const sendEmail    = require('../utils/sendEmail')
const {
  orderConfirmationTemplate,
  adminNewOrderTemplate,
} = require('../utils/emailTemplates')

const FLW_BASE_URL = 'https://api.flutterwave.com/v3'

// @desc    Create a pending order and get a Flutterwave payment link
// @route   POST /api/payments/initiate
// @access  Private
const initiatePayment = asyncHandler(async (req, res) => {
  const { items, shippingAddress, customer, subtotal, shipping, total } = req.body

  if (!items || items.length === 0) {
    res.status(400)
    throw new Error('No order items provided')
  }

  // Verify products exist and have enough stock — but don't decrement yet.
  // Stock is decremented only after payment is verified as successful.
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

  // Create the order in a "pending" / unpaid state
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
    paymentMethod: 'flutterwave',
  })

  // Use the order's own ID as the unique transaction reference
  const txRef = `EJ-${order._id}`
  order.txRef = txRef
  await order.save()

  if (!process.env.FLW_SECRET_KEY || process.env.FLW_SECRET_KEY.includes('placeholder')) {
    res.status(500)
    throw new Error('Payment provider is not configured. Please contact support.')
  }

  try {
    const response = await axios.post(
      `${FLW_BASE_URL}/payments`,
      {
        tx_ref: txRef,
        amount: total,
        currency: 'USD',
        redirect_url: `${process.env.CLIENT_URL}/payment/callback`,
        customer: {
          email: customer.email,
          name: `${customer.firstName} ${customer.lastName}`,
        },
        customizations: {
          title: 'Sport Vault Wear',
          description: `Order ${order._id}`,
          logo: `${process.env.CLIENT_URL}/favicon.svg`,
        },
        meta: {
          orderId: order._id.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const paymentLink = response.data?.data?.link

    if (!paymentLink) {
      throw new Error('Flutterwave did not return a payment link')
    }

    res.status(201).json({
      orderId: order._id,
      paymentLink,
    })
  } catch (error) {
    // Clean up the pending order if Flutterwave init failed
    await order.deleteOne()

    const flwMessage = error.response?.data?.message
    res.status(502)
    throw new Error(flwMessage || 'Unable to initiate payment. Please try again.')
  }
})

// @desc    Verify a Flutterwave transaction and finalize the order
// @route   GET /api/payments/verify?transaction_id=xxx&tx_ref=xxx
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { transaction_id, tx_ref } = req.query

  if (!transaction_id && !tx_ref) {
    res.status(400)
    throw new Error('Missing transaction reference')
  }

  if (!tx_ref) {
    res.status(400)
    throw new Error('Missing tx_ref')
  }

  const foundOrder = await Order.findOne({ txRef: tx_ref })

  if (!foundOrder) {
    res.status(404)
    throw new Error('Order not found for this transaction')
  }

  // Only the order's owner (or an admin) can verify/view it
  if (foundOrder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Not authorized to verify this order')
  }

  // If already verified previously, just return it (idempotent)
  if (foundOrder.isPaid) {
    return res.json({ status: 'success', order: foundOrder })
  }

  if (!transaction_id) {
    res.status(400)
    throw new Error('Missing transaction_id from payment provider')
  }

  // Confirm directly with Flutterwave — never trust client-side redirect params alone
  const verifyRes = await axios.get(
    `${FLW_BASE_URL}/transactions/${transaction_id}/verify`,
    { headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` } }
  )

  const txData = verifyRes.data?.data

  const isSuccessful =
    txData &&
    txData.status === 'successful' &&
    txData.tx_ref === foundOrder.txRef &&
    Number(txData.amount) >= Number(foundOrder.total) &&
    txData.currency === 'USD'

  if (!isSuccessful) {
    foundOrder.status = 'pending'
    await foundOrder.save()
    return res.json({ status: 'failed', order: foundOrder })
  }

  // Payment confirmed — decrement stock now
  for (const item of foundOrder.items) {
    const product = await Product.findById(item.product)
    if (product) {
      product.countInStock = Math.max(0, product.countInStock - item.quantity)
      await product.save()
    }
  }

  foundOrder.isPaid           = true
  foundOrder.paidAt           = new Date()
  foundOrder.status           = 'confirmed'
  foundOrder.flwTransactionId = String(txData.id)
  await foundOrder.save()

  // Send confirmation emails (non-blocking)
  sendEmail({
    to: foundOrder.customer.email,
    subject: `Order Confirmed — ${foundOrder._id} | Sport Vault Wear`,
    html: orderConfirmationTemplate(foundOrder),
  })

  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🛍️ New Order ${foundOrder._id} — $${foundOrder.total.toFixed(2)}`,
    text: adminNewOrderTemplate(foundOrder),
  })

  res.json({ status: 'success', order: foundOrder })
})

module.exports = { initiatePayment, verifyPayment }
