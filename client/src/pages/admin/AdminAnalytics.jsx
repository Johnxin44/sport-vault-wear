import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminStats } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'

export default function AdminAnalytics() {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchAdminStats()) }, [dispatch])

  if (loading || !stats) return <AdminLayout title="ANALYTICS"><Spinner size="lg" /></AdminLayout>

  const maxRevenue = Math.max(...(stats.salesByMonth?.map(m => m.revenue) || [1]), 1)
  const maxLeague  = Math.max(...(stats.topLeagues?.map(l => l.count) || [1]), 1)

  return (
    <AdminLayout title="ANALYTICS">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Monthly revenue */}
        <div className="bg-[#111] border border-white/5 p-6">
          <h3 className="font-display text-xl tracking-widest text-white mb-6">REVENUE — LAST 6 MONTHS</h3>
          <div className="space-y-3">
            {stats.salesByMonth?.map(m => (
              <div key={m.month}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{m.month}</span>
                  <span className="text-brand-amber font-semibold">${m.revenue.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-white/5">
                  <div className="h-full bg-brand-amber transition-all duration-500" style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {(!stats.salesByMonth || stats.salesByMonth.length === 0) && <p className="text-gray-500 text-sm">Not enough data yet.</p>}
          </div>
        </div>

        {/* Top leagues */}
        <div className="bg-[#111] border border-white/5 p-6">
          <h3 className="font-display text-xl tracking-widest text-white mb-6">TOP SELLING LEAGUES</h3>
          <div className="space-y-3">
            {stats.topLeagues?.map(l => (
              <div key={l.league}>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{l.league}</span>
                  <span className="text-brand-amber font-semibold">{l.count} sold</span>
                </div>
                <div className="h-2 bg-white/5">
                  <div className="h-full bg-brand-amber transition-all duration-500" style={{ width: `${(l.count / maxLeague) * 100}%` }}></div>
                </div>
              </div>
            ))}
            {(!stats.topLeagues || stats.topLeagues.length === 0) && <p className="text-gray-500 text-sm">Not enough data yet.</p>}
          </div>
        </div>

        {/* Summary cards */}
        <div className="bg-[#111] border border-white/5 p-6">
          <h3 className="font-display text-xl tracking-widest text-white mb-4">AVERAGE ORDER VALUE</h3>
          <p className="font-display text-5xl text-brand-amber">${(stats.avgOrderValue || 0).toFixed(2)}</p>
        </div>
        <div className="bg-[#111] border border-white/5 p-6">
          <h3 className="font-display text-xl tracking-widest text-white mb-4">CONVERSION SNAPSHOT</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Total Orders</span><span className="text-white font-semibold">{stats.totalOrders}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Pending Orders</span><span className="text-white font-semibold">{stats.pendingOrders}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Customers</span><span className="text-white font-semibold">{stats.userCount}</span></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
