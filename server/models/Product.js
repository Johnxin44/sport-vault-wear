const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['jersey', 'sneakers', 'tracksuit', 'accessory'],
      default: 'jersey',
    },
    team: {
      type: String,
      required: [true, 'Team / brand name is required'],
    },
    league: {
      type: String,
      required: true,
      enum: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Champions League', 'International', 'NBA', 'NFL', 'Other'],
      default: 'Other',
    },
    sport: {
      type: String,
      enum: ['football', 'basketball', 'american-football', 'lifestyle'],
      default: 'football',
    },
    brand: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    badge: {
      type: String,
      enum: ['new', 'hot', ''],
      default: '',
    },
    season: {
      type: String,
      default: '2024/25',
    },
    countInStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
)

// Text index for search
productSchema.index({ name: 'text', team: 'text' })

module.exports = mongoose.model('Product', productSchema)
