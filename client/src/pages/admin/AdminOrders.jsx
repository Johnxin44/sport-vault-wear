import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminOrders, updateOrderStatus } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'

const statuses = ['pending','confirmed','shipped','delivered']
const statusColors = {
  pending:   'bg-white/5 text-gray-400',
  confirmed: 'bg-brand-amber/15 text-brand-amber',
  shipped:   'bg-green-500/15 text-green-400',
  delivered: 'bg-blue-500/15 text-blue-400',
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((s) => s.admin)
  const [filter, setFilter] = useState('')

  useEffect(() => { dispatch(fetchAdminOrders()) }, [dispatch])

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <AdminLayout title="ORDERS">
      <div className="flex gap-2 mb-4">
        {['', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 border transition-colors ${
              filter === s ? 'border-brand-amber text-brand-amber bg-brand-amber/10' : 'border-white/10 text-gray-500 hover:text-white'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <Spinner size="lg" /> : (
        <div className="bg-[#111] border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a1a] text-left text-[10px] tracking-widest uppercase text-gray-500">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-brand-amber">{order._id.slice(-8)}</td>
                  <td className="px-4 py-3 text-white">{order.customer?.firstName} {order.customer?.lastName}</td>
                  <td className="px-4 py-3 text-gray-400">{order.customer?.email}</td>
                  <td className="px-4 py-3 text-gray-400">{order.items.length} items</td>
                  <td className="px-4 py-3 font-semibold text-white">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => dispatch(updateOrderStatus({ id: order._id, status: e.target.value }))}
                      className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1.5 border-0 cursor-pointer ${statusColors[order.status] || statusColors.pending}`}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
