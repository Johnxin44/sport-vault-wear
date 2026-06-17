import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { submitProductRequest, resetProductRequest } from '../store/slices/productRequestSlice'
import { HiSearch, HiCheckCircle } from 'react-icons/hi'

export default function RequestProductPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { loading, submitted } = useSelector((s) => s.productRequest)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    itemDescription: '',
    sizeNeeded: '',
  })

  useEffect(() => { dispatch(resetProductRequest()) }, [dispatch])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(submitProductRequest(form))
  }

  if (submitted) {
    return (
      <div className="page-wrapper py-24 text-center animate-fade-in max-w-lg mx-auto">
        <HiCheckCircle size={64} className="text-brand-amber mx-auto mb-6" />
        <h1 className="font-display text-4xl tracking-widest text-white mb-3">REQUEST SENT</h1>
        <p className="text-gray-400 mb-8">
          Thanks for letting us know what you're looking for. We'll check our stock and get back to you by email if we have it.
        </p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="page-wrapper py-12 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <HiSearch size={28} className="text-brand-amber" />
        <h1 className="font-display text-4xl tracking-widest text-white">REQUEST A PRODUCT</h1>
      </div>
      <p className="text-gray-500 mb-10">
        Can't find what you're looking for? Some items in our store haven't been listed online yet.
        Tell us what you need and we'll let you know if we have it in stock.
      </p>

      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="label">Your Name</p>
            <input required value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" /></div>
          <div><p className="label">Email Address</p>
            <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" /></div>
        </div>

        <div><p className="label">What are you looking for?</p>
          <textarea
            required
            rows={5}
            value={form.itemDescription}
            onChange={(e) => set('itemDescription', e.target.value)}
            className="input-field resize-none"
            placeholder="e.g. Chelsea away jersey 2023/24, or Jordan 4 sneakers in black..."
          />
        </div>

        <div><p className="label">Size Needed (optional)</p>
          <input value={form.sizeNeeded} onChange={(e) => set('sizeNeeded', e.target.value)} className="input-field" placeholder="e.g. M, or US 10" /></div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  )
}
