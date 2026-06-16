import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminUsers, deleteUser } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { HiTrash } from 'react-icons/hi'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((s) => s.admin)

  useEffect(() => { dispatch(fetchAdminUsers()) }, [dispatch])

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete user "${name}"? This cannot be undone.`)) dispatch(deleteUser(id))
  }

  return (
    <AdminLayout title="USERS">
      {loading ? <Spinner size="lg" /> : (
        <div className="bg-[#111] border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a1a] text-left text-[10px] tracking-widest uppercase text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 ${u.role === 'admin' ? 'bg-brand-amber/15 text-brand-amber' : 'bg-white/5 text-gray-400'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDelete(u._id, u.name)} className="text-gray-400 hover:text-red-400"><HiTrash size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
