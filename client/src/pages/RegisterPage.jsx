import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearError } from '../store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [localError, setLocalError] = useState('')

  useEffect(() => { if (user) navigate('/') }, [user, navigate])
  useEffect(() => () => dispatch(clearError()), [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center page-wrapper py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 bg-brand-amber rounded-full"></span>
            <span className="font-display text-2xl tracking-[0.2em] text-white">SPORT VAULT WEAR</span>
          </div>
          <h1 className="font-display text-4xl tracking-widest text-white mt-6">CREATE ACCOUNT</h1>
          <p className="text-sm text-gray-500 mt-2">Join us and start shopping.</p>
        </div>

        {(error || localError) && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-6">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="label">Full Name</p>
            <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" autoComplete="name" />
          </div>
          <div>
            <p className="label">Email Address</p>
            <input type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" autoComplete="email" />
          </div>
          <div>
            <p className="label">Password</p>
            <input type="password" required value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} className="input-field" autoComplete="new-password" />
          </div>
          <div>
            <p className="label">Confirm Password</p>
            <input type="password" required value={form.confirmPassword} onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))} className="input-field" autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-amber hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
