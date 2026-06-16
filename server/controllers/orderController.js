const asyncHandler = require('express-async-handler')
const Order        = require('../models/Order')

// @desc    Get logged-in user's orders (only paid/confirmed orders)
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id, isPaid: true }).sort({ createdAt: -1 })
  res.json(orders)
})

// @desc    Get a single order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  // Only the order's owner or an admin can view it
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403)
    throw new Error('Not authorized to view this order')
  }

  res.json(order)
})

module.exports = { getMyOrders, getOrderById }
