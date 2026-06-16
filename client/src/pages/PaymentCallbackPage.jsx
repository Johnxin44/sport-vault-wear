import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { verifyPayment, clearOrderState } from '../store/slices/orderSlice'
import { clearCart } from '../store/slices/cartSlice'
import Spinner from '../components/common/Spinner'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

export default function PaymentCallbackPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loading, verifyStatus, current: order } = useSelector((s) => s.order)

  const status        = searchParams.get('status')
  const transactionId = searchParams.get('transaction_id')
  const txRef         = searchParams.get('tx_ref')

  useEffect(() => {
    // Flutterwave appends status=cancelled if the user backs out without paying
    if (status === 'cancelled') return

    if (transactionId && txRef) {
      dispatch(verifyPayment({ transaction_id: transactionId, tx_ref: txRef }))
    }
  }, [dispatch, status, transactionId, txRef])

  useEffect(() => {
    if (verifyStatus === 'success') {
      dispatch(clearCart())
    }
  }, [verifyStatus, dispatch])

  useEffect(() => {
    return () => { dispatch(clearOrderState()) }
  }, [dispatch])

  // User cancelled at Flutterwave before paying
  if (status === 'cancelled') {
    return (
      <div className="page-wrapper py-24 text-center animate-fade-in">
        <HiXCircle size={64} className="text-gray-500 mx-auto mb-6" />
        <h1 className="font-display text-4xl tracking-widest text-white mb-3">PAYMENT CANCELLED</h1>
        <p className="text-gray-500 mb-8">Your payment was not completed. Your cart has been saved.</p>
        <Link to="/cart" className="btn-primary">Back to Cart</Link>
      </div>
    )
  }

  if (loading || verifyStatus === null) {
    return (
      <div className="page-wrapper py-24 text-center animate-fade-in">
        <Spinner size="lg" />
        <p className="text-gray-500 mt-6">Verifying your payment, please wait...</p>
      </div>
    )
  }

  if (verifyStatus === 'success') {
    return (
      <div className="page-wrapper py-24 text-center animate-fade-in">
        <HiCheckCircle size={64} className="text-brand-amber mx-auto mb-6" />
        <h1 className="font-display text-5xl tracking-widest text-white mb-3">ORDER CONFIRMED!</h1>
        <p className="text-gray-400 mb-2">
          Order ID: <span className="text-brand-amber font-mono">{order?._id}</span>
        </p>
        <p className="text-gray-500 text-sm mb-8">
          A confirmation email has been sent to <strong className="text-white">{order?.customer?.email}</strong>
        </p>
        <button onClick={() => navigate('/orders')} className="btn-primary">View My Orders</button>
      </div>
    )
  }

  // Failed verification
  return (
    <div className="page-wrapper py-24 text-center animate-fade-in">
      <HiXCircle size={64} className="text-red-400 mx-auto mb-6" />
      <h1 className="font-display text-4xl tracking-widest text-white mb-3">PAYMENT NOT COMPLETED</h1>
      <p className="text-gray-500 mb-8">
        We couldn't confirm your payment. If you were charged, please contact support with your reference.
      </p>
      <Link to="/cart" className="btn-primary">Back to Cart</Link>
    </div>
  )
}
