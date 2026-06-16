const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String, default: '' },
  price:    { type: Number, required: true },
  size:     { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
      email:     { type: String, required: true },
    },
    items: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city:    { type: String, required: true },
      zip:     { type: String, required: true },
      country: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    total:    { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['flutterwave', ''],
      default: '',
    },
    txRef: {
      type: String,
      default: null,
      index: true,
    },
    flwTransactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
