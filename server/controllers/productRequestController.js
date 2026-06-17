const asyncHandler    = require('express-async-handler')
const ProductRequest  = require('../models/ProductRequest')
const sendEmail       = require('../utils/sendEmail')

// @desc    Submit a request for an item not currently listed on the site
// @route   POST /api/product-requests
// @access  Private (must be logged in)
const createProductRequest = asyncHandler(async (req, res) => {
  const { name, email, itemDescription, sizeNeeded } = req.body

  if (!name || !email || !itemDescription) {
    res.status(400)
    throw new Error('Please fill in your name, email, and describe the item')
  }

  const request = await ProductRequest.create({
    user: req.user?._id || null,
    name,
    email,
    itemDescription,
    sizeNeeded: sizeNeeded || '',
  })

  // Notify admin (non-blocking)
  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🔎 New product request from ${name}`,
    text: `Someone is looking for an item not currently on the site.\n\n` +
      `Name: ${name}\nEmail: ${email}\n` +
      (sizeNeeded ? `Size needed: ${sizeNeeded}\n` : '') +
      `\nDescription:\n${itemDescription}\n\n` +
      `Log in to the admin dashboard to view and respond to this request.`,
  })

  res.status(201).json(request)
})

// @desc    Get all product requests
// @route   GET /api/admin/product-requests
// @access  Private/Admin
const getProductRequests = asyncHandler(async (req, res) => {
  const requests = await ProductRequest.find().sort({ createdAt: -1 })
  res.json(requests)
})

// @desc    Update a product request's status/notes
// @route   PUT /api/admin/product-requests/:id
// @access  Private/Admin
const updateProductRequest = asyncHandler(async (req, res) => {
  const request = await ProductRequest.findById(req.params.id)

  if (!request) {
    res.status(404)
    throw new Error('Request not found')
  }

  request.status     = req.body.status ?? request.status
  request.adminNotes = req.body.adminNotes ?? request.adminNotes

  const updated = await request.save()
  res.json(updated)
})

module.exports = { createProductRequest, getProductRequests, updateProductRequest }
