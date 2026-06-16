const asyncHandler = require('express-async-handler')
const Product      = require('../models/Product')
const Order        = require('../models/Order')
const User         = require('../models/User')
const sendEmail    = require('../utils/sendEmail')
const { orderShippedTemplate } = require('../utils/emailTemplates')

// ═══════════════════════════════════════════════
//  DASHBOARD STATS
// ═══════════════════════════════════════════════

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalOrders, productCount, userCount, orders] = await Promise.all([
    Order.countDocuments({ isPaid: true }),
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.find({ isPaid: true }),
  ])

  const totalRevenue  = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'confirmed').length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Sales by month — last 6 months
  const salesByMonth = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date  = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = date.toLocaleString('default', { month: 'short', year: '2-digit' })
    const monthOrders = orders.filter((o) => {
      const d = new Date(o.createdAt)
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
    })
    salesByMonth.push({
      month: label,
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
    })
  }

  // Top selling leagues — count items sold per league
  const products = await Product.find()
  const leagueMap = {}

  for (const order of orders) {
    for (const item of order.items) {
      const product = products.find((p) => p._id.toString() === item.product.toString())
      const league  = product?.league || 'Unknown'
      leagueMap[league] = (leagueMap[league] || 0) + item.quantity
    }
  }

  const topLeagues = Object.entries(leagueMap)
    .map(([league, count]) => ({ league, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  res.json({
    totalOrders,
    totalRevenue,
    productCount,
    userCount,
    pendingOrders,
    avgOrderValue,
    salesByMonth,
    topLeagues,
  })
})

// ═══════════════════════════════════════════════
//  PRODUCT MANAGEMENT
// ═══════════════════════════════════════════════

// @desc    Get all products (admin view — no pagination limit)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json(products)
})

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, team, league, sport, category, brand, price, originalPrice,
    description, sizes, badge, countInStock, featured,
  } = req.body

  const images = req.file ? [req.file.path] : []

  const product = await Product.create({
    name,
    category,
    team,
    league,
    sport,
    brand,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    description,
    images,
    sizes: sizes ? sizes.split(',').map((s) => s.trim()) : undefined,
    badge: badge || '',
    countInStock: Number(countInStock) || 0,
    featured: featured === 'true' || featured === true,
  })

  res.status(201).json(product)
})

// @desc    Update an existing product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const {
    name, team, league, sport, category, brand, price, originalPrice,
    description, sizes, badge, countInStock, featured,
  } = req.body

  product.name          = name ?? product.name
  product.category      = category ?? product.category
  product.team          = team ?? product.team
  product.league        = league ?? product.league
  product.sport         = sport ?? product.sport
  product.brand         = brand ?? product.brand
  product.price         = price !== undefined ? Number(price) : product.price
  product.originalPrice = originalPrice ? Number(originalPrice) : null
  product.description   = description ?? product.description
  product.sizes         = sizes ? sizes.split(',').map((s) => s.trim()) : product.sizes
  product.badge         = badge ?? product.badge
  product.countInStock  = countInStock !== undefined ? Number(countInStock) : product.countInStock
  product.featured      = featured === 'true' || featured === true

  // Replace image only if a new one was uploaded
  if (req.file) {
    product.images = [req.file.path]
  }

  const updated = await product.save()
  res.json(updated)
})

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await product.deleteOne()
  res.json({ message: 'Product removed' })
})

// ═══════════════════════════════════════════════
//  ORDER MANAGEMENT
// ═══════════════════════════════════════════════

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isPaid: true }).sort({ createdAt: -1 })
  res.json(orders)
})

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }

  const previousStatus = order.status
  order.status = req.body.status || order.status
  const updated = await order.save()

  // If the order just transitioned to "shipped", notify the customer
  if (previousStatus !== 'shipped' && updated.status === 'shipped') {
    sendEmail({
      to: updated.customer.email,
      subject: `Your order ${updated._id} has shipped! 📦`,
      html: orderShippedTemplate(updated),
    })
  }

  res.json(updated)
})

// ═══════════════════════════════════════════════
//  USER MANAGEMENT
// ═══════════════════════════════════════════════

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.json(users)
})

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.role === 'admin') {
    res.status(400)
    throw new Error('Cannot delete an admin account')
  }

  await user.deleteOne()
  res.json({ message: 'User removed' })
})

module.exports = {
  getStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getUsers,
  deleteUser,
}
