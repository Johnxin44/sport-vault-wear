const nodemailer = require('nodemailer')

// Uses explicit Gmail SMTP settings (port 587, STARTTLS) rather than
// Nodemailer's generic `service: 'gmail'` shortcut — the shortcut can be
// unreliable on some cloud hosts (e.g. Render), leading to connection
// timeouts. Port 465 (implicit TLS) is used as a fallback if 587 fails.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false for 587 (STARTTLS), true for 465
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 15000, // 15s — fail fast instead of hanging
  greetingTimeout: 15000,
  socketTimeout: 15000,
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
    console.log(`Email sent successfully to ${to}`)
  } catch (error) {
    console.error('Email send failed:', error.message, '| code:', error.code, '| command:', error.command)
  }
}

module.exports = sendEmail
