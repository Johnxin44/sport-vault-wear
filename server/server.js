const path        = require('path')
require('dotenv').config()

const express      = require('express')
const cors         = require('cors')
const morgan       = require('morgan')
const helmet       = require('helmet')
const rateLimit    = require('express-rate-limit')
const colors       = require('colors')

const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const authRoutes    = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes   = require('./routes/orderRoutes')
const adminRoutes   = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const cryptoRoutes  = require('./routes/cryptoRoutes')
const productRequestRoutes = require('./routes/productRequestRoutes')
const contactRoutes = require('./routes/contactRoutes')

// Connect to MongoDB
connectDB()

const app = express()

// Render (and most hosting platforms) sit behind a reverse proxy, which sets
// the X-Forwarded-For header. Trusting the first proxy lets express-rate-limit
// and req.ip correctly identify the real client IP instead of the proxy's IP.
app.set('trust proxy', 1)

// ─── Security & Logging Middleware ────────────

app.use(helmet({ crossOriginResourcePolicy: false })) // allow images to be served cross-origin
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Rate limiting — protects auth routes from brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { success: false, message: 'Too many requests, please try again later' },
})
app.use('/api/auth', authLimiter)

// ─── Body Parsing ──────────────────────────────

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Static Files (uploaded product images) ───

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ─── API Routes ────────────────────────────────

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/crypto', cryptoRoutes)
app.use('/api/product-requests', productRequestRoutes)
app.use('/api/contact', contactRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Serve React build in production ──────────

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuildPath))

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('Sport Vault Wear API is running...')
  })
}

// ─── Error Handlers (must be last) ─────────────

app.use(notFound)
app.use(errorHandler)

// ─── Start Server ──────────────────────────────

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})
