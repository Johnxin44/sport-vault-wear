const asyncHandler  = require('express-async-handler')
const crypto        = require('crypto')
const User          = require('../models/User')
const generateToken = require('../utils/generateToken')
const sendEmail     = require('../utils/sendEmail')

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

const user = await User.create({ name, email, password, isVerified: true }) 
   console.log('User created:', user.email) 
  // Generate verification token and save to user
  const rawToken = user.generateVerificationToken()
  console.log('Token generated:', rawToken)
  await user.save()

  // Build the verification link
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`

  // Send verification email via Resend
  console.log('Sending email to:', user.email)
  await sendEmail({
    to: user.email,
    subject: '✅ Verify your Sport Vault Wear account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #111;">Welcome to Sport Vault Wear, ${user.name}! 👋</h2>
        <p style="color: #444;">Thanks for signing up. Click the button below to verify your email address and activate your account.</p>
        <a href="${verifyUrl}" 
           style="display:inline-block; margin-top:16px; padding:12px 28px; background:#2563eb; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">
          Verify My Email
        </a>
        <p style="color:#888; font-size:12px; margin-top:24px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  })
  console.log('Email sent!')

  res.status(201).json({
    message: 'Account created! Please check your email to verify your account before logging in.',
  })
})

// @desc    Verify email address
// @route   GET /api/auth/verify-email?token=xxx
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query

  if (!token) {
    res.status(400)
    throw new Error('Verification token is missing')
  }

  // Hash the raw token to match what's stored in DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() },
  }).select('+verificationToken +verificationTokenExpire')

  if (!user) {
    res.status(400)
    throw new Error('Verification link is invalid or has expired')
  }

  // Activate the account
  user.isVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpire = undefined
  await user.save()

  res.json({ message: 'Email verified successfully! You can now log in.' })
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

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  // Block unverified users from logging in
 

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
  if (req.body.password) user.password = req.body.password

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

module.exports = { registerUser, verifyEmail, loginUser, getProfile, updateProfile }