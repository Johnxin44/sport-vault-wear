// HTML email templates — kept separate from sending logic for readability

const orderConfirmationTemplate = (order) => {
  const itemsRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #222;color:#fff;">${item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #222;color:#999;">Size ${item.size}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #222;color:#999;">x${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #222;color:#F5A623;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join('')

  return `
  <div style="background:#080808;color:#F2F0EB;font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;">
    <h1 style="font-size:30px;letter-spacing:4px;color:#F5A623;margin-bottom:4px;">SPORT VAULT WEAR</h1>
    <p style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px;">Order Confirmation</p>

    <h2 style="font-size:20px;letter-spacing:2px;margin-bottom:8px;">YOUR ORDER IS CONFIRMED</h2>
    <p style="color:#999;margin-bottom:24px;">
      Hi ${order.customer.firstName}, thank you for your order! We're getting it ready to ship.
    </p>

    <div style="background:#111;border:1px solid #222;padding:16px;margin-bottom:24px;">
      <p style="font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Order ID</p>
      <p style="font-size:16px;color:#F5A623;font-weight:bold;letter-spacing:1px;">${order._id}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#1a1a1a;">
          <th style="padding:10px 12px;text-align:left;color:#888;">Product</th>
          <th style="padding:10px 12px;text-align:left;color:#888;">Size</th>
          <th style="padding:10px 12px;text-align:left;color:#888;">Qty</th>
          <th style="padding:10px 12px;text-align:left;color:#888;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <div style="text-align:right;padding:16px 0;border-top:1px solid #222;margin-top:8px;">
      <p style="color:#888;margin-bottom:4px;">Shipping: ${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}</p>
      <p style="font-size:20px;color:#F5A623;font-weight:bold;">Total: $${order.total.toFixed(2)}</p>
    </div>

    <div style="background:#111;border:1px solid #222;padding:16px;margin-top:16px;">
      <p style="font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Shipping To</p>
      <p>${order.customer.firstName} ${order.customer.lastName}</p>
      <p style="color:#888;">${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
      <p style="color:#888;">${order.shippingAddress.zip}, ${order.shippingAddress.country}</p>
    </div>

    <p style="color:#444;font-size:12px;margin-top:32px;text-align:center;">
      Questions? Contact us at ${process.env.ADMIN_EMAIL}
    </p>
  </div>`
}

const orderShippedTemplate = (order) => `
  <div style="background:#080808;color:#F2F0EB;font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;">
    <h1 style="font-size:30px;letter-spacing:4px;color:#F5A623;margin-bottom:4px;">SPORT VAULT WEAR</h1>
    <h2 style="font-size:20px;letter-spacing:2px;margin-top:32px;">YOUR ORDER HAS SHIPPED! 📦</h2>
    <p style="color:#999;margin-top:12px;">
      Hi ${order.customer.firstName}, great news — your order
      <strong style="color:#F5A623;">${order._id}</strong> is on its way to you.
    </p>
    <p style="color:#999;margin-top:24px;">Thank you for shopping with Sport Vault Wear.</p>
  </div>`

const adminNewOrderTemplate = (order) => {
  const itemsList = order.items
    .map((i) => `• ${i.name} (Size ${i.size}) x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
    .join('\n')

  return `New order received!

Order ID: ${order._id}
Total: $${order.total.toFixed(2)}

Customer:
${order.customer.firstName} ${order.customer.lastName}
${order.customer.email}
${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}

Items:
${itemsList}

Log in to the admin dashboard to manage this order.`
}

module.exports = { orderConfirmationTemplate, orderShippedTemplate, adminNewOrderTemplate }
