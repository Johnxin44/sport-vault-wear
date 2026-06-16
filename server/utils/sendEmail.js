const nodemailer = require('nodemailer')

// Creates a reusable transporter using Gmail + an App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Sends an HTML email. Logs (rather than throws) on failure so that
// an email outage never breaks the checkout / order flow.
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `"Sport Vault Wear" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text,
    })
  } catch (error) {
    console.error('Email send failed:', error.message)
  }
}

module.exports = sendEmail
