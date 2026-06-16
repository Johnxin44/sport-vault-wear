// ─────────────────────────────────────────────
//  Database Seeder
//  Run with: npm run seed        (imports sample data)
//             npm run seed:destroy (wipes all data)
// ─────────────────────────────────────────────

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const mongoose = require('mongoose')
const colors   = require('colors')
const connectDB = require('../config/db')

const User    = require('../models/User')
const Product = require('../models/Product')
const Order   = require('../models/Order')

const users = [
  {
    name: 'Admin User',
    email: 'admin@sportvaultwear.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
  },
]

const products = [
  {
    name: 'Manchester United Home Jersey',
    category: 'jersey',
    team: 'Manchester United',
    league: 'Premier League',
    sport: 'football',
    brand: 'Adidas',
    price: 89.99,
    originalPrice: null,
    description: 'Official Manchester United home jersey for the 2024/25 season. Featuring the iconic red with classic Adidas three-stripe detailing and breathable AEROREADY fabric.',
    images: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    season: '2024/25',
    countInStock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 0,
  },
  {
    name: 'Real Madrid Home Jersey',
    category: 'jersey',
    team: 'Real Madrid',
    league: 'La Liga',
    sport: 'football',
    brand: 'Adidas',
    price: 94.99,
    originalPrice: null,
    description: 'Official Real Madrid home jersey 2024/25. Pristine white with gold trim detailing, worn by the biggest stars at the Santiago Bernabéu.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 40,
    featured: true,
    rating: 4.8,
    numReviews: 0,
  },
  {
    name: 'FC Barcelona Home Jersey',
    category: 'jersey',
    team: 'FC Barcelona',
    league: 'La Liga',
    sport: 'football',
    brand: 'Nike',
    price: 84.99,
    originalPrice: 99.99,
    description: 'Iconic blue and garnet stripes — the official FC Barcelona home jersey. Lightweight Dri-FIT fabric keeps you cool both on and off the pitch.',
    images: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: '',
    season: '2024/25',
    countInStock: 35,
    featured: true,
    rating: 4.6,
    numReviews: 0,
  },
  {
    name: 'Liverpool Home Jersey',
    category: 'jersey',
    team: 'Liverpool FC',
    league: 'Premier League',
    sport: 'football',
    brand: 'Nike',
    price: 89.99,
    originalPrice: null,
    description: 'The famous Liverpool red — official home jersey with Standard Chartered sponsor and Nike Dri-FIT technology. You\'ll Never Walk Alone.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    season: '2024/25',
    countInStock: 45,
    featured: true,
    rating: 4.7,
    numReviews: 0,
  },
  {
    name: 'Manchester City Home Jersey',
    category: 'jersey',
    team: 'Manchester City',
    league: 'Premier League',
    sport: 'football',
    brand: 'Puma',
    price: 89.99,
    originalPrice: null,
    description: 'Official Manchester City sky blue home jersey featuring Etihad Airways sponsorship and Puma\'s lightweight ULTRAWEAVE fabric for elite performance.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: '',
    season: '2024/25',
    countInStock: 30,
    featured: false,
    rating: 4.4,
    numReviews: 0,
  },
  {
    name: 'Bayern Munich Home Jersey',
    category: 'jersey',
    team: 'Bayern Munich',
    league: 'Bundesliga',
    sport: 'football',
    brand: 'Adidas',
    price: 89.99,
    originalPrice: 109.99,
    description: 'Classic Bayern Munich red home jersey. Premium Adidas construction with embroidered club crest and Bundesliga-grade quality.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 25,
    featured: true,
    rating: 4.5,
    numReviews: 0,
  },
  {
    name: 'Juventus Home Jersey',
    category: 'jersey',
    team: 'Juventus',
    league: 'Serie A',
    sport: 'football',
    brand: 'Adidas',
    price: 84.99,
    originalPrice: null,
    description: 'The iconic Juventus black and white stripes return in this official home jersey, featuring premium Adidas HEAT.RDY technology.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: '',
    season: '2024/25',
    countInStock: 28,
    featured: false,
    rating: 4.3,
    numReviews: 0,
  },
  {
    name: 'PSG Home Jersey',
    category: 'jersey',
    team: 'Paris Saint-Germain',
    league: 'Champions League',
    sport: 'football',
    brand: 'Nike',
    price: 94.99,
    originalPrice: null,
    description: 'Official Paris Saint-Germain home jersey. Bold navy with the iconic central red and blue band, worn by world-class talent at Parc des Princes.',
    images: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    season: '2024/25',
    countInStock: 38,
    featured: true,
    rating: 4.6,
    numReviews: 0,
  },
  {
    name: 'Brazil National Team Jersey',
    category: 'jersey',
    team: 'Brazil',
    league: 'International',
    sport: 'football',
    brand: 'Nike',
    price: 79.99,
    originalPrice: null,
    description: 'The iconic yellow and green of Brazil. Official national team jersey with embroidered CBF crest, perfect for any true football fan.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: '',
    season: '2024',
    countInStock: 60,
    featured: false,
    rating: 4.9,
    numReviews: 0,
  },
  {
    name: 'Arsenal Home Jersey',
    category: 'jersey',
    team: 'Arsenal FC',
    league: 'Premier League',
    sport: 'football',
    brand: 'Adidas',
    price: 89.99,
    originalPrice: 104.99,
    description: 'Official Arsenal home jersey in classic red and white. Adidas AEROREADY fabric with embroidered cannon crest.',
    images: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 42,
    featured: true,
    rating: 4.5,
    numReviews: 0,
  },
  {
    name: 'AC Milan Home Jersey',
    category: 'jersey',
    team: 'AC Milan',
    league: 'Serie A',
    sport: 'football',
    brand: 'Puma',
    price: 84.99,
    originalPrice: null,
    description: 'The legendary red and black stripes of AC Milan. Official home jersey with Puma dryCELL technology for ultimate breathability.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: '',
    season: '2024/25',
    countInStock: 20,
    featured: false,
    rating: 4.2,
    numReviews: 0,
  },
  {
    name: 'Argentina National Team Jersey',
    category: 'jersey',
    team: 'Argentina',
    league: 'International',
    sport: 'football',
    brand: 'Adidas',
    price: 84.99,
    originalPrice: null,
    description: 'World Champions home jersey — the iconic sky blue and white stripes of Argentina, with three-star World Cup winner badge.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'hot',
    season: '2024',
    countInStock: 55,
    featured: true,
    rating: 5.0,
    numReviews: 0,
  },

  // ─── Basketball (NBA) ───────────────────────────
  {
    category: 'jersey',
    name: 'Los Angeles Lakers Icon Jersey',
    team: 'LA Lakers',
    league: 'NBA',
    sport: 'basketball',
    brand: 'Nike',
    price: 99.99,
    originalPrice: null,
    description: 'Official Nike NBA Icon Edition swingman jersey for the LA Lakers — lightweight, breathable mesh built for game day.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    season: '2024/25',
    countInStock: 40,
    featured: true,
    rating: 4.7,
    numReviews: 0,
  },
  {
    category: 'jersey',
    name: 'Golden State Warriors City Jersey',
    team: 'Golden State Warriors',
    league: 'NBA',
    sport: 'basketball',
    brand: 'Nike',
    price: 104.99,
    originalPrice: 119.99,
    description: 'Nike NBA City Edition swingman jersey for the Golden State Warriors, featuring a special alternate design celebrating the city.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 30,
    featured: false,
    rating: 4.6,
    numReviews: 0,
  },

  // ─── American Football (NFL) ────────────────────
  {
    category: 'jersey',
    name: 'Kansas City Chiefs Home Jersey',
    team: 'Kansas City Chiefs',
    league: 'NFL',
    sport: 'american-football',
    brand: 'Nike',
    price: 109.99,
    originalPrice: null,
    description: 'Official Nike NFL game jersey for the Kansas City Chiefs, built with Vapor performance fabric for elite breathability.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    season: '2024/25',
    countInStock: 35,
    featured: true,
    rating: 4.8,
    numReviews: 0,
  },
  {
    category: 'jersey',
    name: 'Dallas Cowboys Home Jersey',
    team: 'Dallas Cowboys',
    league: 'NFL',
    sport: 'american-football',
    brand: 'Nike',
    price: 109.99,
    originalPrice: null,
    description: 'Official Nike NFL game jersey for the Dallas Cowboys in classic navy and silver.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: '',
    season: '2024/25',
    countInStock: 28,
    featured: false,
    rating: 4.5,
    numReviews: 0,
  },

  // ─── Sneakers / Footwear ─────────────────────────
  {
    category: 'sneakers',
    name: 'Air Zoom Pegasus Running Shoes',
    team: 'Running Collection',
    league: 'Other',
    sport: 'lifestyle',
    brand: 'Nike',
    price: 129.99,
    originalPrice: 149.99,
    description: 'Responsive cushioning and breathable mesh upper make these the go-to daily trainer for runners of all levels.',
    images: [],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 45,
    featured: true,
    rating: 4.6,
    numReviews: 0,
  },
  {
    category: 'sneakers',
    name: 'UltraBoost Street Sneakers',
    team: 'Street Collection',
    league: 'Other',
    sport: 'lifestyle',
    brand: 'Adidas',
    price: 139.99,
    originalPrice: null,
    description: 'Premium knit upper with responsive Boost cushioning — built for all-day comfort on and off the field.',
    images: [],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: 'new',
    season: '2024/25',
    countInStock: 38,
    featured: true,
    rating: 4.7,
    numReviews: 0,
  },

  // ─── Tracksuits & Hoodies ────────────────────────
  {
    category: 'tracksuit',
    name: 'Performance Full-Zip Tracksuit',
    team: 'Training Collection',
    league: 'Other',
    sport: 'lifestyle',
    brand: 'Nike',
    price: 84.99,
    originalPrice: 99.99,
    description: 'A lightweight full-zip tracksuit with tapered joggers — perfect for warmups, travel, or everyday wear.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 0,
  },
  {
    category: 'tracksuit',
    name: 'Classic Pullover Hoodie',
    team: 'Lifestyle Collection',
    league: 'Other',
    sport: 'lifestyle',
    brand: 'Adidas',
    price: 64.99,
    originalPrice: null,
    description: 'Soft fleece pullover hoodie with an embroidered logo — a comfortable everyday staple for fans.',
    images: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    season: '2024/25',
    countInStock: 60,
    featured: false,
    rating: 4.4,
    numReviews: 0,
  },

  // ─── Accessories ─────────────────────────────────
  {
    category: 'accessory',
    name: 'Embroidered Logo Cap',
    team: 'Accessories',
    league: 'Other',
    sport: 'lifestyle',
    brand: 'New Era',
    price: 29.99,
    originalPrice: null,
    description: 'Adjustable snapback cap with embroidered logo — the perfect finishing touch for any fan outfit.',
    images: [],
    sizes: ['One Size'],
    badge: '',
    season: '2024/25',
    countInStock: 80,
    featured: false,
    rating: 4.3,
    numReviews: 0,
  },
  {
    category: 'accessory',
    name: 'Sport Duffel Bag',
    team: 'Accessories',
    league: 'Other',
    sport: 'lifestyle',
    brand: 'Nike',
    price: 49.99,
    originalPrice: 59.99,
    description: 'Durable duffel bag with shoe compartment — ideal for training sessions, travel, or match day.',
    images: [],
    sizes: ['One Size'],
    badge: 'hot',
    season: '2024/25',
    countInStock: 25,
    featured: true,
    rating: 4.5,
    numReviews: 0,
  },
]


const importData = async () => {
  try {
    await connectDB()

    // Wipe existing data
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    // Insert users one-by-one so the password hashing middleware runs
    const createdUsers = []
    for (const u of users) {
      createdUsers.push(await User.create(u))
    }

    await Product.insertMany(products)

    console.log('✅ Data Imported Successfully!'.green.inverse)
    console.log(`   ${createdUsers.length} users created`.cyan)
    console.log(`   ${products.length} products created`.cyan)
    console.log('\n   Admin login: admin@sportvaultwear.com / admin123'.yellow)
    console.log('   Customer login: john@example.com / password123'.yellow)

    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await connectDB()

    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('🗑️  Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
