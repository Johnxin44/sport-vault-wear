import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginUser, clearError } from '../store/slices/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname || '/')
  }, [user, navigate, location])

  useEffect(() => () => dispatch(clearError()), [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center page-wrapper py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 bg-brand-amber rounded-full"></span>
            <span className="font-display text-2xl tracking-[0.2em] text-white">SPORT VAULT WEAR</span>
          </div>
          <h1 className="font-display text-4xl tracking-widest text-white mt-6">SIGN IN</h1>
          <p className="text-sm text-gray-500 mt-2">Welcome back. Enter your details below.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="label">Email Address</p>
            <input type="email" required value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              className="input-field" autoComplete="email" />
          </div>
          <div>
            <p className="label">Password</p>
            <input type="password" required value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field" autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-amber hover:underline">Create one</Link>
        </p>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">Demo Admin: admin@sportvaultwear.com / admin123</p>
        </div>
      </div>
    </div>
  )
}
