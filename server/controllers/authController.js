const asyncHandler = require('express-async-handler')
const User         = require('../models/User')
const generateToken = require('../utils/generateToken')

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide name, email, and password')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('An account with this email already exists')
  }

  const user = await User.create({ name, email, password })

  res.status(201).json({
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
    token: generateToken(user._id),
  })
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  // Explicitly select password since it's excluded by default
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
    token: generateToken(user._id),
  })
})

// @desc    Get current user's profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json({
    _id:   user._id,
    name:  user.name,
    email: user.email,
    role:  user.role,
  })
})

// @desc    Update current user's profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.name  = req.body.name  || user.name
  user.email = req.body.email || user.email

  if (req.body.password) {
    user.password = req.body.password
  }

  const updated = await user.save()

  res.json({
    user: {
      _id:   updated._id,
      name:  updated.name,
      email: updated.email,
      role:  updated.role,
    },
  })
})

module.exports = { registerUser, loginUser, getProfile, updateProfile }
