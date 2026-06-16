const jwt          = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User         = require('../models/User')

// Verifies the JWT from the Authorization header and attaches the user to req.user
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach the user (without password) to the request object
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        res.status(401)
        throw new Error('User not found')
      }

      return next()
    } catch (error) {
      res.status(401)
      throw new Error('Not authorized, token invalid')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token provided')
  }
})

// Restricts a route to admin users only — must run after `protect`
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  res.status(403)
  throw new Error('Access denied — admin privileges required')
}

module.exports = { protect, admin }
