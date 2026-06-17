import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductRequests, updateProductRequest } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { HiMail } from 'react-icons/hi'

const statuses = ['new', 'in_progress', 'fulfilled', 'closed']
const statusColors = {
  new:         'bg-yellow-500/15 text-yellow-400',
  in_progress: 'bg-brand-amber/15 text-brand-amber',
  fulfilled:   'bg-green-500/15 text-green-400',
  closed:      'bg-white/5 text-gray-400',
}

export default function AdminRequests() {
  const dispatch = useDispatch()
  const { productRequests, loading } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchProductRequests()) }, [dispatch])

  return (
    <AdminLayout title="PRODUCT REQUESTS">
      {loading ? <Spinner size="lg" /> : (
        <div className="space-y-3">
          {productRequests.map(req => (
            <div key={req._id} className="bg-[#111] border border-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-white font-semibold">{req.name}</p>
                  <a href={`mailto:${req.email}`} className="text-xs text-gray-500 flex items-center gap-1 hover:text-brand-amber">
                    <HiMail size={12} /> {req.email}
                  </a>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                  <select
                    value={req.status}
                    onChange={(e) => dispatch(updateProductRequest({ id: req._id, status: e.target.value }))}
                    className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1.5 border-0 cursor-pointer ${statusColors[req.status]}`}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              {req.sizeNeeded && (
                <p className="text-xs text-gray-500 mb-2">Size needed: <span className="text-white">{req.sizeNeeded}</span></p>
              )}

              <div className="bg-[#1a1a1a] border border-white/5 p-3">
                <p className="text-sm text-gray-300">{req.itemDescription}</p>
              </div>
            </div>
          ))}
          {productRequests.length === 0 && (
            <div className="text-center text-gray-500 py-16">No product requests yet.</div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
