const asyncHandler     = require('express-async-handler')
const ContactMessage   = require('../models/ContactMessage')
const sendEmail        = require('../utils/sendEmail')

// @desc    Submit a general contact form message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  const contactMessage = await ContactMessage.create({ name, email, subject, message })

  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `📩 Contact form: ${subject}`,
    text: `New contact message from ${name} (${email})\n\n${message}`,
  })

  res.status(201).json({ message: "Message sent — we'll get back to you within 24 hours.", contactMessage })
})

module.exports = { createContactMessage }
