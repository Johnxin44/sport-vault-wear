import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { HiShoppingBag, HiUser, HiMenu, HiX, HiSearch } from 'react-icons/hi'
import { logout } from '../../store/slices/authSlice'
import { selectCartCount } from '../../store/slices/cartSlice'

export default function Navbar() {
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const { pathname } = useLocation()
  const { user }    = useSelector((s) => s.auth)
  const cartCount   = useSelector(selectCartCount)
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const links = [
    { to: '/',         label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about',    label: 'About' },
    { to: '/contact',  label: 'Contact' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setShowSearch(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-white/5">
      <div className="page-wrapper">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-amber rounded-full"></span>
            <span className="font-display text-2xl tracking-[0.2em] text-white">SPORT VAULT WEAR</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-200
                  ${pathname === to ? 'text-brand-amber' : 'text-gray-400 hover:text-white'}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray-400 hover:border-brand-amber hover:text-brand-amber transition-colors"
            >
              <HiSearch size={16} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center border border-white/10 text-gray-400 hover:border-brand-amber hover:text-brand-amber transition-colors"
            >
              <HiShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-amber text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative group">
                <button className="w-9 h-9 flex items-center justify-center border border-white/10 text-gray-400 hover:border-brand-amber hover:text-brand-amber transition-colors">
                  <HiUser size={16} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#111] border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2.5 text-xs tracking-widest uppercase text-brand-amber hover:bg-white/5 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2.5 text-xs tracking-widest uppercase text-gray-300 hover:bg-white/5 transition-colors">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2.5 text-xs tracking-widest uppercase text-gray-300 hover:bg-white/5 transition-colors">
                    Orders
                  </Link>
                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gray-400 hover:text-brand-amber transition-colors">
                <HiUser size={14} /> Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center text-gray-400">
              {open ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="pb-3 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field flex-1 text-sm"
              />
              <button type="submit" className="btn-primary text-sm px-6 py-2.5">Search</button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111] border-t border-white/5 animate-fade-in">
          <div className="page-wrapper py-4 flex flex-col gap-4">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="text-xs font-semibold tracking-widest uppercase text-gray-300 hover:text-brand-amber transition-colors">
                {label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setOpen(false)}
                className="text-xs font-semibold tracking-widest uppercase text-brand-amber">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
