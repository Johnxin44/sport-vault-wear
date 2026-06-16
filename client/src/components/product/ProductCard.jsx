import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HiShoppingBag, HiStar } from 'react-icons/hi'
import { addToCart } from '../../store/slices/cartSlice'
import { getImageUrl } from '../../utils/getImageUrl'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ product, size: product.sizes?.[0] || 'M', quantity: 1 }))
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link to={`/products/${product._id}`} className="group card block animate-fade-in">
      <div className="relative overflow-hidden aspect-[3/4] bg-[#1a1a1a]">
        <img
          src={product.images?.[0] ? getImageUrl(product.images[0]) : 'https://placehold.co/400x500/111/F5A623?text=ITEM'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x500/111/F5A623?text=ITEM' }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge === 'new'  && <span className="badge-new">NEW</span>}
          {product.badge === 'hot'  && <span className="badge-hot">HOT</span>}
          {discount                 && <span className="badge-sale">-{discount}%</span>}
        </div>
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-10 h-10 bg-brand-amber text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-yellow-400"
          aria-label="Quick add to cart"
        >
          <HiShoppingBag size={16} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-brand-amber mb-1">{product.league}</p>
        <h3 className="font-display text-lg tracking-wide text-white mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{product.team}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-brand-amber">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-600 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <HiStar size={12} className="text-brand-amber" />
              <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
