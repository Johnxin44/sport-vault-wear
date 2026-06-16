import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateQuantity, removeFromCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice'
import EmptyState from '../components/common/EmptyState'
import { HiShoppingBag, HiTrash, HiArrowRight } from 'react-icons/hi'

export default function CartPage() {
  const dispatch = useDispatch()
  const items    = useSelector(selectCartItems)
  const total    = useSelector(selectCartTotal)
  const shipping = total >= 150 ? 0 : 9.99

  if (items.length === 0) return (
    <div className="page-wrapper py-24">
      <EmptyState icon={<HiShoppingBag />} title="YOUR CART IS EMPTY"
        message="Looks like you haven't added anything yet."
        action={<Link to="/products" className="btn-primary">Shop Now</Link>} />
    </div>
  )

  return (
    <div className="page-wrapper py-12 animate-fade-in">
      <h1 className="font-display text-5xl tracking-widest text-white mb-10">YOUR CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.key} className="flex gap-4 bg-[#111] border border-white/5 p-4">
              <Link to={`/products/${item.productId}`} className="w-24 h-28 flex-shrink-0 bg-[#1a1a1a] overflow-hidden">
                <img src={item.image ? `/uploads/${item.image}` : 'https://placehold.co/100x120/111/F5A623?text=I'}
                  alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <Link to={`/products/${item.productId}`}>
                  <h3 className="font-display text-lg tracking-wide text-white hover:text-brand-amber transition-colors">{item.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1 mb-3">Size: {item.size}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-white/10">
                    <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-lg">−</button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-lg">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-xl text-brand-amber">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => dispatch(removeFromCart(item.key))}
                      className="text-gray-600 hover:text-red-400 transition-colors">
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-[#111] border border-white/5 p-6 sticky top-24">
          <h2 className="font-display text-2xl tracking-widest text-white mb-6">ORDER SUMMARY</h2>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {total < 150 && <p className="text-xs text-gray-600">Add ${(150 - total).toFixed(2)} more for free shipping</p>}
            <div className="border-t border-white/5 pt-3 flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="font-display text-2xl text-brand-amber">${(total + shipping).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
            Checkout <HiArrowRight size={16} />
          </Link>
          <Link to="/products" className="block text-center text-xs text-gray-500 hover:text-brand-amber transition-colors mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
