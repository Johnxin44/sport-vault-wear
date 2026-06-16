const asyncHandler = require('express-async-handler')
const Product      = require('../models/Product')

// @desc    Get all products with filtering, search, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sport, type, badge, sort, page = 1, limit = 12 } = req.query

  const query = {}

  if (search)   query.$text   = { $search: search }
  if (category) query.league  = category
  if (sport)    query.sport   = sport
  if (type)     query.category = type
  if (badge)    query.badge   = badge === 'sale' ? { $ne: '' } : badge

  // On-sale filter is handled separately since it depends on originalPrice
  if (badge === 'sale') {
    query.originalPrice = { $ne: null, $gt: 0 }
    delete query.badge
  }

  // Build sort object
  let sortOption = { createdAt: -1 } // default: newest first
  if (sort === 'price_asc')  sortOption = { price: 1 }
  if (sort === 'price_desc') sortOption = { price: -1 }
  if (sort === 'newest')     sortOption = { createdAt: -1 }
  if (sort === 'rating')     sortOption = { rating: -1 }

  const pageNum  = Math.max(1, parseInt(page))
  const limitNum = Math.max(1, parseInt(limit))
  const skip     = (pageNum - 1) * limitNum

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ])

  res.json({
    products,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
  })
})

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(8)
  res.json(products)
})

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name')

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json(product)
})

// @desc    Create a review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  // Prevent a user from reviewing the same product twice
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  )

  if (alreadyReviewed) {
    res.status(400)
    throw new Error('You have already reviewed this product')
  }

  const review = {
    user:    req.user._id,
    name:    req.user.name,
    rating:  Number(rating),
    comment,
  }

  product.reviews.push(review)
  product.numReviews = product.reviews.length
  product.rating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length

  await product.save()

  const updated = await Product.findById(req.params.id).populate('reviews.user', 'name')
  res.status(201).json(updated)
})

module.exports = { getProducts, getFeaturedProducts, getProductById, createProductReview }
