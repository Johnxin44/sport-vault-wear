import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { initiatePayment, clearOrderState } from '../store/slices/orderSlice'
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice'
import { HiLockClosed } from 'react-icons/hi'
import countries, { getCountryByName } from '../utils/countries'
import { getImageUrl } from '../utils/getImageUrl'

export default function CheckoutPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const items     = useSelector(selectCartItems)
  const subtotal  = useSelector(selectCartTotal)
  const { loading, paymentLink, error } = useSelector((s) => s.order)
  const { user }  = useSelector((s) => s.auth)
  const shipping  = subtotal >= 150 ? 0 : 9.99

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName:  user?.name?.split(' ').slice(1).join(' ') || '',
    email:     user?.email || '',
    address:   '', city: '', zip: '', country: '',
  })
  const [zipError, setZipError] = useState('')

  useEffect(() => { dispatch(clearOrderState()) }, [dispatch])

  // Once we have a Flutterwave payment link, redirect the browser there
  useEffect(() => {
    if (paymentLink) {
      window.location.href = paymentLink
    }
  }, [paymentLink])

  if (items.length === 0) {
    navigate('/cart'); return null
  }

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (k === 'zip' || k === 'country') setZipError('')
  }

  const validateZip = () => {
    const countryData = getCountryByName(form.country)
    if (countryData?.zipRegex && form.zip && !countryData.zipRegex.test(form.zip.trim())) {
      setZipError(`That doesn't look like a valid postal code for ${form.country}`)
      return false
    }
    setZipError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateZip()) return
    dispatch(initiatePayment({
      items: items.map(i => ({ product: i.productId, name: i.name, image: i.image, price: i.price, size: i.size, quantity: i.quantity })),
      shippingAddress: { address: form.address, city: form.city, zip: form.zip, country: form.country },
      customer: { firstName: form.firstName, lastName: form.lastName, email: form.email },
      subtotal, shipping, total: subtotal + shipping,
    }))
  }

  return (
    <div className="page-wrapper py-12 animate-fade-in">
      <h1 className="font-display text-5xl tracking-widest text-white mb-10">CHECKOUT</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {/* Shipping */}
          <div className="bg-[#111] border border-white/5 p-6">
            <h2 className="font-display text-2xl tracking-widest text-white mb-6">SHIPPING</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
                <div key={k}><p className="label">{l}</p>
                  <input value={form[k]} onChange={(e) => set(k, e.target.value)} required className="input-field" /></div>
              ))}
              <div className="col-span-2"><p className="label">Email</p>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className="input-field" /></div>
              <div className="col-span-2"><p className="label">Address</p>
                <input value={form.address} onChange={(e) => set('address', e.target.value)} required className="input-field" /></div>
              <div><p className="label">Country</p>
                <select value={form.country} onChange={(e) => set('country', e.target.value)} required className="input-field">
                  <option value="">Select a country...</option>
                  {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div><p className="label">City</p>
                <input value={form.city} onChange={(e) => set('city', e.target.value)} required className="input-field" placeholder="e.g. New York" /></div>
              <div className="col-span-2">
                <p className="label">ZIP / Postal Code</p>
                <input
                  value={form.zip}
                  onChange={(e) => set('zip', e.target.value)}
                  onBlur={validateZip}
                  required
                  className={`input-field ${zipError ? 'border-red-500' : ''}`}
                  placeholder={form.country ? `e.g. ${form.country === 'United States' ? '90210' : form.country === 'United Kingdom' ? 'SW1A 1AA' : '00000'}` : 'Select a country first'}
                />
                {zipError && <p className="text-red-400 text-xs mt-1">{zipError}</p>}
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-[#111] border border-white/5 p-6">
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">PAYMENT</h2>
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 text-sm text-gray-400">
              <HiLockClosed size={20} className="text-brand-amber flex-shrink-0 mt-0.5" />
              <p>
                You'll be securely redirected to <strong className="text-white">Flutterwave</strong> to complete
                your payment by card, bank transfer, or other supported methods. Your card details are never
                seen or stored by Sport Vault Wear.
              </p>
            </div>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-xl">
            {loading ? 'Redirecting to secure checkout...' : `Pay $${(subtotal + shipping).toFixed(2)}`}
          </button>
        </form>

        {/* Summary */}
        <div className="bg-[#111] border border-white/5 p-6 sticky top-24">
          <h2 className="font-display text-xl tracking-widest text-white mb-4">YOUR ORDER</h2>
          <div className="space-y-3 mb-6">
            {items.map(i => (
              <div key={i.key} className="flex items-center gap-3">
                <div className="w-12 h-14 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                  <img src={i.image ? getImageUrl(i.image) : 'https://placehold.co/50x60/111/F5A623?text=I'} alt={i.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{i.name}</p>
                  <p className="text-[10px] text-gray-500">Size {i.size} · x{i.quantity}</p>
                </div>
                <span className="text-sm text-brand-amber font-semibold">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/5">
              <span>Total</span><span className="font-display text-xl text-brand-amber">${(subtotal + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
