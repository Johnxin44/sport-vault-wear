import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminOrders, fetchAwaitingVerification, verifyCryptoOrder, updateOrderStatus } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { HiExternalLink, HiCheckCircle, HiXCircle } from 'react-icons/hi'

const statuses = ['pending','awaiting_verification','confirmed','shipped','delivered','rejected']
const statusColors = {
  pending:               'bg-white/5 text-gray-400',
  awaiting_verification: 'bg-yellow-500/15 text-yellow-400',
  confirmed:             'bg-brand-amber/15 text-brand-amber',
  shipped:               'bg-green-500/15 text-green-400',
  delivered:             'bg-blue-500/15 text-blue-400',
  rejected:              'bg-red-500/15 text-red-400',
}

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orders, awaitingVerification, loading } = useSelector((s) => s.admin)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAdminOrders())
    dispatch(fetchAwaitingVerification())
  }, [dispatch])

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  const handleVerify = (id, approve) => {
    const msg = approve
      ? 'Confirm this payment? This will mark the order as paid and notify the customer.'
      : 'Reject this payment? The order will be marked as rejected.'
    if (window.confirm(msg)) dispatch(verifyCryptoOrder({ id, approve }))
  }

  return (
    <AdminLayout title="ORDERS">
      {/* Awaiting crypto verification — needs manual blockchain check */}
      {awaitingVerification.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-xl tracking-widest text-yellow-400 mb-4">
            AWAITING PAYMENT VERIFICATION ({awaitingVerification.length})
          </h2>
          <div className="space-y-3">
            {awaitingVerification.map(order => (
              <div key={order._id} className="bg-[#111] border border-yellow-500/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono text-sm text-brand-amber">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="text-sm text-white">{order.customer?.firstName} {order.customer?.lastName} · {order.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount Due</p>
                    <p className="font-display text-xl text-brand-amber">${order.total.toFixed(2)} USDT</p>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-white/10 p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Transaction Hash Submitted</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-white break-all flex-1">{order.cryptoTxHash}</code>
                    <a
                      href={`https://tronscan.org/#/transaction/${order.cryptoTxHash}`}
                      target="_blank" rel="noreferrer"
                      className="text-brand-amber hover:opacity-70 flex items-center gap-1 text-xs flex-shrink-0"
                    >
                      Verify on Tronscan <HiExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleVerify(order._id, true)} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    <HiCheckCircle size={16} /> Confirm Payment
                  </button>
                  <button onClick={() => handleVerify(order._id, false)} className="flex items-center gap-2 text-sm px-5 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                    <HiXCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-display text-xl tracking-widest text-white mb-4">ALL ORDERS</h2>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs font-semibold tracking-widest uppercase px-4 py-2 border transition-colors ${
              filter === s ? 'border-brand-amber text-brand-amber bg-brand-amber/10' : 'border-white/10 text-gray-500 hover:text-white'
            }`}>
            {s ? s.replace('_', ' ') : 'All'}
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
                      {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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
