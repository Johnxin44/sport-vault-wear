import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../store/slices/authSlice'
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { name: form.name, email: form.email }
    if (form.password) payload.password = form.password
    dispatch(updateProfile(payload))
    setForm(f => ({ ...f, password: '' }))
  }

  return (
    <div className="page-wrapper py-12 max-w-2xl animate-fade-in">
      <h1 className="font-display text-5xl tracking-widest text-white mb-2">MY PROFILE</h1>
      <p className="text-sm text-gray-500 mb-10">Manage your account details</p>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 p-6 space-y-4">
        <div>
          <p className="label flex items-center gap-1.5"><HiUser size={12}/> Full Name</p>
          <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
        </div>
        <div>
          <p className="label flex items-center gap-1.5"><HiMail size={12}/> Email Address</p>
          <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" required />
        </div>
        <div>
          <p className="label flex items-center gap-1.5"><HiLockClosed size={12}/> New Password (optional)</p>
          <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} className="input-field" placeholder="Leave blank to keep current password" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-8 bg-[#111] border border-white/5 p-6">
        <h3 className="font-display text-xl tracking-widest text-white mb-2">ACCOUNT TYPE</h3>
        <span className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1.5 ${user?.role === 'admin' ? 'bg-brand-amber text-black' : 'bg-white/5 text-gray-400'}`}>
          {user?.role || 'customer'}
        </span>
      </div>
    </div>
  )
}
