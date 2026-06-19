const { Resend } = require('resend')

// Resend is used instead of Gmail SMTP because Render's free tier blocks
// outbound SMTP ports (587/465). Resend uses HTTPS (port 443) which is
// always open, making it reliable on any cloud hosting platform.
const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `Sport Vault Wear <onboarding@resend.dev>`,
      to,
      subject,
      html: html || `<p>${text}</p>`,
      text,
    })

    if (error) {
      console.error('Email send failed:', error.message)
    } else {
      console.log('Email sent successfully:', data?.id)
    }
  } catch (err) {
    console.error('Email send failed:', err.message)
  }
}

module.exports = sendEmail
