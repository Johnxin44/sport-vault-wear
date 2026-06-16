import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../store/slices/orderSlice'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { HiClipboardList } from 'react-icons/hi'
import { getImageUrl } from '../utils/getImageUrl'

const statusColors = {
  pending:   'bg-white/5 text-gray-400',
  confirmed: 'bg-brand-amber/15 text-brand-amber',
  shipped:   'bg-green-500/15 text-green-400',
  delivered: 'bg-blue-500/15 text-blue-400',
}

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((s) => s.order)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  if (loading) return <Spinner size="lg" />

  if (!orders.length) return (
    <div className="page-wrapper py-24">
      <EmptyState icon={<HiClipboardList />} title="NO ORDERS YET"
        message="When you place an order, it'll show up here."
        action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
    </div>
  )

  return (
    <div className="page-wrapper py-12 animate-fade-in">
      <h1 className="font-display text-5xl tracking-widest text-white mb-10">MY ORDERS</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-[#111] border border-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-sm text-brand-amber">{order._id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-display text-xl text-brand-amber">${order.total.toFixed(2)}</p>
              </div>
              <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 ${statusColors[order.status] || statusColors.pending}`}>
                {order.status}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-12 h-14 bg-[#1a1a1a] overflow-hidden">
                    <img src={item.image ? getImageUrl(item.image) : 'https://placehold.co/50x60/111/F5A623?text=I'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-500">Size {item.size} · x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
