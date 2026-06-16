# Sport Vault Wear — Full Stack E-Commerce Platform

A complete production-ready football jersey e-commerce website built with React 19, Vite, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication.

---

## 📁 Project Structure

```
elite-jerseys/
├── client/                    # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Spinner, EmptyState, Pagination, route guards
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── product/        # ProductCard, ProductGrid
│   │   │   └── admin/           # AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/           # Admin dashboard pages
│   │   │   └── *.jsx             # Customer-facing pages
│   │   ├── store/
│   │   │   ├── slices/           # Redux Toolkit slices
│   │   │   └── store.js
│   │   ├── utils/api.js          # Axios instance with JWT interceptor
│   │   ├── styles/index.css      # Tailwind + custom styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/             # Route handler logic
│   ├── middleware/               # Auth, error handling, file upload
│   ├── models/                   # Mongoose schemas (User, Product, Order)
│   ├── routes/                   # API route definitions
│   ├── utils/                    # JWT, email sending, email templates
│   ├── seed/seeder.js            # Sample data importer
│   ├── uploads/                  # Uploaded product images
│   ├── .env.example
│   ├── server.js                 # Entry point
│   └── package.json
│
└── package.json               # Root scripts to run both apps together
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local install OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### 1. Install dependencies

```bash
npm run install:all
```

This installs dependencies for the root, `client/`, and `server/` folders.

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:

```env
NODE_ENV=development
PORT=5000

# Local MongoDB:
MONGO_URI=mongodb://localhost:27017/elite-jerseys
# OR MongoDB Atlas connection string:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/elite-jerseys

JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRE=30d

# Gmail App Password (Google Account → Security → App Passwords)
EMAIL_FROM=youraddress@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=youraddress@gmail.com

CLIENT_URL=http://localhost:5173
```

> 💡 Email sending is optional for development — if not configured, orders will
> still be created, but confirmation emails will silently fail (logged to console).

### 3. Seed the database with sample data

```bash
npm run seed
```

This creates:
- **Admin account:** `admin@sportvaultwear.com` / `admin123`
- **Customer account:** `john@example.com` / `password123`
- **12 sample jerseys** across Premier League, La Liga, Serie A, Bundesliga, Champions League, and International teams

To wipe all data: `npm run seed:destroy` (run from `server/`)

### 4. Run the app

From the project root:

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend API:** http://localhost:5000
- **Frontend:** http://localhost:5173

Open http://localhost:5173 in your browser.

---

## 🔑 Default Accounts

| Role     | Email                     | Password    |
|----------|---------------------------|-------------|
| Admin    | admin@sportvaultwear.com    | admin123    |
| Customer | john@example.com          | password123 |

Visit `/admin` after logging in as the admin account.

---

## 🧩 Features

### Customer
- Homepage with hero section and featured jerseys
- Product catalog with search, filters (league, badge), and sorting
- Product detail page with image gallery, size selection, reviews
- Cart with quantity controls and persistent localStorage
- Checkout with shipping & payment form
- User registration / login (JWT)
- Profile management
- Order history

### Admin (role-protected)
- Dashboard with revenue, order, and product stats
- Product management (create/edit/delete with image upload)
- Order management (update status: pending → confirmed → shipped → delivered)
- User management (view/delete customers)
- Sales analytics (monthly revenue chart, top leagues)

### Security
- JWT authentication with protected routes
- Passwords hashed with bcrypt
- Role-based access control (`protect` + `admin` middleware)
- Rate limiting on auth routes
- Helmet security headers
- Centralized error handling

---

## 🛠️ Available Scripts (root)

| Command              | Description                                  |
|----------------------|-----------------------------------------------|
| `npm run install:all` | Install all dependencies (root, client, server) |
| `npm run dev`         | Run client + server concurrently             |
| `npm run server`      | Run backend only (with nodemon)               |
| `npm run client`      | Run frontend only (Vite dev server)           |
| `npm run seed`        | Seed the database with sample data            |
| `npm run build`       | Build the React frontend for production       |

---

## 📦 Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Axios, React Hot Toast, React Icons

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Multer (file uploads), Nodemailer, Helmet, Morgan, express-rate-limit

---

## 🌍 Deployment Guide

### Option A — Single Server (Recommended for simplicity)

The Express server can serve the built React app as static files.

1. **Build the frontend:**
   ```bash
   npm run build
   ```
   This outputs to `client/dist/`.

2. **Set production environment variables** on your host (Render, Railway, DigitalOcean, etc.):
   ```env
   NODE_ENV=production
   MONGO_URI=<your MongoDB Atlas URI>
   JWT_SECRET=<strong random string>
   EMAIL_FROM=<your gmail>
   EMAIL_PASSWORD=<gmail app password>
   ADMIN_EMAIL=<your gmail>
   CLIENT_URL=<your deployed URL>
   PORT=5000
   ```

3. **Start the server:**
   ```bash
   cd server
   npm start
   ```
   When `NODE_ENV=production`, `server.js` automatically serves `client/dist`
   and handles all non-API routes with React Router (catch-all `*` route).

### Option B — Separate Frontend/Backend Hosting

**Backend** (Render / Railway / Fly.io):
- Deploy the `server/` folder
- Set all environment variables from `.env.example`
- Ensure `CLIENT_URL` matches your frontend's deployed domain (for CORS)

**Frontend** (Vercel / Netlify):
- Deploy the `client/` folder
- Build command: `npm run build`
- Output directory: `dist`
- Set an environment variable or update `vite.config.js` proxy to point
  `/api` and `/uploads` requests to your deployed backend URL

### MongoDB Atlas Setup (Free Tier)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user (Database Access)
3. Whitelist your IP — or `0.0.0.0/0` for cloud hosting (Network Access)
4. Copy the connection string into `MONGO_URI` in your `.env`

### Image Storage in Production

Uploaded images are stored in `server/uploads/` on disk. On platforms with
**ephemeral filesystems** (Render free tier, Heroku, etc.), uploaded files
are lost on redeploy. For production, consider switching `uploadMiddleware.js`
to use a cloud storage provider (e.g. Cloudinary, AWS S3) instead of
`multer.diskStorage`.

---

## 📝 Notes for Customization

- **Colors / fonts:** edit `client/tailwind.config.js` (`brand.amber`, `font-display`)
- **Leagues / categories:** edit the `enum` in `server/models/Product.js` and
  the `leagues` array in `client/src/pages/ProductsPage.jsx` + `AdminProducts.jsx`
- **Shipping threshold:** currently free shipping over $150 — search for `150`
  in `cartSlice.js` and `CheckoutPage.jsx` to change
- **Email templates:** edit `server/utils/emailTemplates.js`
