import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { initiateCryptoPayment, submitCryptoTransaction, clearOrderState } from '../store/slices/orderSlice'
import { clearCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice'
import { HiLockClosed, HiClipboardCopy, HiCheckCircle } from 'react-icons/hi'
import countries, { getCountryByName } from '../utils/countries'
import { getImageUrl } from '../utils/getImageUrl'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const items     = useSelector(selectCartItems)
  const subtotal  = useSelector(selectCartTotal)
  const { loading, cryptoPayment, cryptoSubmitted, error } = useSelector((s) => s.order)
  const { user }  = useSelector((s) => s.auth)
  const shipping  = subtotal >= 150 ? 0 : 9.99

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName:  user?.name?.split(' ').slice(1).join(' ') || '',
    email:     user?.email || '',
    address:   '', city: '', zip: '', country: '',
  })
  const [zipError, setZipError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { dispatch(clearOrderState()) }, [dispatch])

  useEffect(() => {
    if (cryptoSubmitted) {
      dispatch(clearCart())
    }
  }, [cryptoSubmitted, dispatch])

  if (items.length === 0 && !cryptoPayment && !cryptoSubmitted) {
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
    dispatch(initiateCryptoPayment({
      items: items.map(i => ({ product: i.productId, name: i.name, image: i.image, price: i.price, size: i.size, quantity: i.quantity })),
      shippingAddress: { address: form.address, city: form.city, zip: form.zip, country: form.country },
      customer: { firstName: form.firstName, lastName: form.lastName, email: form.email },
      subtotal, shipping, total: subtotal + shipping,
    }))
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoPayment.walletAddress)
    setCopied(true)
    toast.success('Wallet address copied')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitTxHash = (e) => {
    e.preventDefault()
    if (!txHash.trim()) {
      toast.error('Please enter your transaction hash')
      return
    }
    dispatch(submitCryptoTransaction({ orderId: cryptoPayment.orderId, txHash }))
  }

  // ─── Step 3: Transaction submitted, awaiting manual verification ───
  if (cryptoSubmitted) {
    return (
      <div className="page-wrapper py-24 text-center animate-fade-in max-w-lg mx-auto">
        <HiCheckCircle size={64} className="text-brand-amber mx-auto mb-6" />
        <h1 className="font-display text-4xl tracking-widest text-white mb-3">TRANSACTION SUBMITTED</h1>
        <p className="text-gray-400 mb-2">
          We've received your transaction details and will verify your payment shortly.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You'll receive a confirmation email once your order is verified — this usually takes a few hours.
        </p>
        <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
      </div>
    )
  }

  // ─── Step 2: Show wallet address + QR code, wait for tx hash ───
  if (cryptoPayment) {
    return (
      <div className="page-wrapper py-12 animate-fade-in max-w-lg mx-auto">
        <h1 className="font-display text-4xl tracking-widest text-white mb-2 text-center">PAY WITH USDT</h1>
        <p className="text-gray-500 text-sm text-center mb-10">Network: {cryptoPayment.network}</p>

        <div className="bg-[#111] border border-white/5 p-6 mb-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Amount Due</p>
          <p className="font-display text-4xl text-brand-amber mb-6">${cryptoPayment.amountDue.toFixed(2)} USDT</p>

          <img src={cryptoPayment.qrCode} alt="Wallet QR code" className="w-48 h-48 mx-auto mb-6 bg-white p-2" />

          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Send to this address</p>
          <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 p-3">
            <code className="text-xs text-white break-all flex-1 text-left">{cryptoPayment.walletAddress}</code>
            <button onClick={handleCopyAddress} className="text-brand-amber hover:opacity-70 flex-shrink-0">
              {copied ? <HiCheckCircle size={20} /> : <HiClipboardCopy size={20} />}
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 text-sm text-gray-400 mb-6 flex items-start gap-3">
          <HiLockClosed size={18} className="text-brand-amber flex-shrink-0 mt-0.5" />
          <p>
            Send <strong className="text-white">exactly ${cryptoPayment.amountDue.toFixed(2)} USDT</strong> using
            the <strong className="text-white">TRC20 (Tron)</strong> network only. Sending via a different
            network may result in lost funds.
          </p>
        </div>

        <form onSubmit={handleSubmitTxHash} className="bg-[#111] border border-white/5 p-6">
          <p className="label">Transaction Hash / ID</p>
          <p className="text-xs text-gray-500 mb-3">After sending, paste your transaction hash here so we can verify your payment.</p>
          <input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="e.g. 9f3a7b2c1d4e5f6a7b8c9d0e1f2a3b4c..."
            className="input-field mb-4"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? 'Submitting...' : "I've Sent the Payment"}
          </button>
        </form>
      </div>
    )
  }

  // ─── Step 1: Shipping form ───
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
            <h2 className="font-display text-2xl tracking-widest text-white mb-4">PAYMENT METHOD</h2>
            <div className="flex items-start gap-3 bg-white/5 border border-brand-amber/30 p-4 text-sm text-gray-400">
              <HiLockClosed size={20} className="text-brand-amber flex-shrink-0 mt-0.5" />
              <p>
                Pay with <strong className="text-white">USDT (TRC20)</strong>. After this step, you'll receive
                a wallet address and QR code to send your payment to.
              </p>
            </div>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-xl">
            {loading ? 'Preparing payment...' : `Continue to Pay $${(subtotal + shipping).toFixed(2)}`}
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
