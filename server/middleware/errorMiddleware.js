// Handles requests to routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Centralised error handler — formats all thrown errors consistently
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message    = err.message

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message    = 'Resource not found'
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message    = Object.values(err.errors).map((val) => val.message).join(', ')
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message     = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

module.exports = { notFound, errorHandler }
