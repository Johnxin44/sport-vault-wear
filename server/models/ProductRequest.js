const mongoose = require('mongoose')

const productRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // allows guests to submit too, if ever opened up
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    itemDescription: {
      type: String,
      required: [true, 'Please describe the item you are looking for'],
    },
    sizeNeeded: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'fulfilled', 'closed'],
      default: 'new',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ProductRequest', productRequestSchema)
