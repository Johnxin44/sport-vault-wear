import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAdminStats, fetchAdminOrders } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { HiCurrencyDollar, HiClipboardList, HiUsers, HiShoppingBag } from 'react-icons/hi'

const statusColors = {
  pending:   'bg-white/5 text-gray-400',
  confirmed: 'bg-brand-amber/15 text-brand-amber',
  shipped:   'bg-green-500/15 text-green-400',
  delivered: 'bg-blue-500/15 text-blue-400',
}

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, orders, loading } = useSelector((s) => s.admin)

  useEffect(() => {
    dispatch(fetchAdminStats())
    dispatch(fetchAdminOrders())
  }, [dispatch])

  return (
    <AdminLayout title="OVERVIEW">
      {loading && !stats ? <Spinner size="lg" /> : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-10">
            {[
              { Icon: HiCurrencyDollar, label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, sub: 'All time' },
              { Icon: HiClipboardList,  label: 'Total Orders',  value: stats?.totalOrders || 0, sub: 'All time' },
              { Icon: HiShoppingBag,    label: 'Products',      value: stats?.productCount || 0, sub: 'In catalogue' },
              { Icon: HiUsers,          label: 'Customers',     value: stats?.userCount || 0, sub: 'Registered' },
            ].map(({ Icon, label, value, sub }) => (
              <div key={label} className="bg-[#111] p-6">
                <Icon size={22} className="text-brand-amber mb-3" />
                <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">{label}</p>
                <p className="font-display text-3xl text-white">{value}</p>
                <p className="text-xs text-gray-600 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-widest text-white">RECENT ORDERS</h2>
            <Link to="/admin/orders" className="text-xs font-semibold tracking-widest uppercase text-brand-amber hover:opacity-70">View All →</Link>
          </div>

          <div className="bg-[#111] border border-white/5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] text-left text-[10px] tracking-widest uppercase text-gray-500">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map(order => (
                  <tr key={order._id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-brand-amber">{order._id.slice(-8)}</td>
                    <td className="px-4 py-3 text-white">{order.customer?.firstName} {order.customer?.lastName}</td>
                    <td className="px-4 py-3 text-gray-400">{order.items.length} items</td>
                    <td className="px-4 py-3 font-semibold text-white">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 ${statusColors[order.status] || statusColors.pending}`}>{order.status}</span></td>
                    <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
