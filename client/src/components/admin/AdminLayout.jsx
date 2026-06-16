import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { HiViewGrid, HiShoppingBag, HiClipboardList, HiUsers, HiChartBar, HiExternalLink, HiLogout } from 'react-icons/hi'

const links = [
  { to: '/admin',           label: 'Overview',  Icon: HiViewGrid },
  { to: '/admin/products',  label: 'Products',  Icon: HiShoppingBag },
  { to: '/admin/orders',    label: 'Orders',    Icon: HiClipboardList },
  { to: '/admin/users',     label: 'Users',     Icon: HiUsers },
  { to: '/admin/analytics', label: 'Analytics', Icon: HiChartBar },
]

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation()
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0a0a0a] border-r border-white/5 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
          <span className="w-2 h-2 bg-brand-amber rounded-full"></span>
          <span className="font-display text-lg tracking-[0.2em] text-white">SVW ADMIN</span>
        </div>
        <nav className="flex-1 py-4">
          {links.map(({ to, label, Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
                pathname === to ? 'bg-brand-amber/10 text-brand-amber border-r-2 border-brand-amber' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-6 py-3 text-xs font-semibold tracking-widest uppercase text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
            <HiExternalLink size={16} /> View Store
          </a>
        </nav>
        <div className="p-4 border-t border-white/5">
          <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
          <button onClick={() => dispatch(logout())} className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">
            <HiLogout size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="font-display text-3xl tracking-widest text-white mb-8">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  )
}
