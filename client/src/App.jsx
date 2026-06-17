import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadUserFromStorage } from './store/slices/authSlice'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages — Customer
import HomePage       from './pages/HomePage'
import ProductsPage   from './pages/ProductsPage'
import ProductDetail  from './pages/ProductDetailPage'
import CartPage       from './pages/CartPage'
import CheckoutPage   from './pages/CheckoutPage'
import PaymentCallbackPage from './pages/PaymentCallbackPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import ProfilePage    from './pages/ProfilePage'
import OrdersPage     from './pages/OrdersPage'
import AboutPage      from './pages/AboutPage'
import ContactPage    from './pages/ContactPage'
import RequestProductPage from './pages/RequestProductPage'
import NotFoundPage   from './pages/NotFoundPage'

// Pages — Admin
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminOrders     from './pages/admin/AdminOrders'
import AdminRequests   from './pages/admin/AdminRequests'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminAnalytics  from './pages/admin/AdminAnalytics'

// Guards
import PrivateRoute from './components/common/PrivateRoute'
import AdminRoute   from './components/common/AdminRoute'

export default function App() {
  const dispatch   = useDispatch()
  const { pathname } = useLocation()

  // Scroll to top on every route change
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  // Restore auth session from localStorage on app load
  useEffect(() => { dispatch(loadUserFromStorage()) }, [dispatch])

  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-[#080808]">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/products"  element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart"      element={<CartPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/about"     element={<AboutPage />} />
          <Route path="/contact"   element={<ContactPage />} />

          {/* Protected customer routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/callback" element={<PaymentCallbackPage />} />
            <Route path="/profile"  element={<ProfilePage />} />
            <Route path="/orders"   element={<OrdersPage />} />
            <Route path="/request-product" element={<RequestProductPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"            element={<AdminDashboard />} />
            <Route path="/admin/products"   element={<AdminProducts />} />
            <Route path="/admin/orders"     element={<AdminOrders />} />
            <Route path="/admin/requests"   element={<AdminRequests />} />
            <Route path="/admin/users"      element={<AdminUsers />} />
            <Route path="/admin/analytics"  element={<AdminAnalytics />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  )
}
