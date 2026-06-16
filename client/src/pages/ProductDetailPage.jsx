import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearCurrent, submitReview } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import Spinner from '../components/common/Spinner'
import { HiStar, HiShoppingBag, HiChevronRight } from 'react-icons/hi'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current: product, loading } = useSelector((s) => s.product)
  const { user } = useSelector((s) => s.auth)

  const [selectedSize,  setSelectedSize]  = useState('')
  const [activeImg,     setActiveImg]     = useState(0)
  const [reviewRating,  setReviewRating]  = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => dispatch(clearCurrent())
  }, [id, dispatch])

  if (loading) return <Spinner size="lg" />
  if (!product) return <div className="page-wrapper py-24 text-center text-gray-500">Product not found.</div>

  const handleAddToCart = () => {
    if (!selectedSize) { alert('Please select a size'); return }
    dispatch(addToCart({ product, size: selectedSize, quantity: 1 }))
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!reviewComment.trim()) return
    await dispatch(submitReview({ productId: id, review: { rating: reviewRating, comment: reviewComment } }))
    setReviewComment('')
    setReviewRating(5)
  }

  const images = product.images?.length
    ? product.images.map(img => `/uploads/${img}`)
    : ['https://placehold.co/600x700/111/F5A623?text=ITEM']

  return (
    <div className="page-wrapper py-12 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
        <Link to="/" className="hover:text-brand-amber transition-colors">Home</Link>
        <HiChevronRight size={12} />
        <Link to="/products" className="hover:text-brand-amber transition-colors">Shop</Link>
        <HiChevronRight size={12} />
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-[#111] border border-white/5 overflow-hidden mb-3">
            <img src={images[activeImg]} alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://placehold.co/600x700/111/F5A623?text=ITEM' }} />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 border-2 overflow-hidden transition-colors ${i === activeImg ? 'border-brand-amber' : 'border-white/10'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-amber mb-2">{product.league}</p>
          <h1 className="font-display text-5xl tracking-widest text-white mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{product.team} · {product.season}</p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <HiStar key={s} size={14} className={s <= Math.round(product.rating) ? 'text-brand-amber' : 'text-gray-700'} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-display text-4xl text-brand-amber">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-600 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <hr className="border-white/5 mb-6" />

          {/* Size selector */}
          <div className="mb-6">
            <p className="label">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 text-sm font-semibold border-2 transition-colors ${
                    selectedSize === size
                      ? 'border-brand-amber bg-brand-amber text-black'
                      : 'border-white/10 text-gray-400 hover:border-brand-amber'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
            <HiShoppingBag size={18} /> Add to Cart
          </button>

          <p className="text-xs text-gray-600 text-center mb-8">Free shipping on orders over $150</p>

          <hr className="border-white/5 mb-6" />

          <div>
            <p className="label mb-3">Description</p>
            <p className="text-sm text-gray-400 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20">
        <h2 className="section-title mb-8">REVIEWS</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review list */}
          <div className="space-y-4">
            {product.reviews?.length === 0 && (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
            )}
            {product.reviews?.map((r, i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{r.name}</span>
                  <div className="flex">{[1,2,3,4,5].map(s => <HiStar key={s} size={12} className={s <= r.rating ? 'text-brand-amber' : 'text-gray-700'} />)}</div>
                </div>
                <p className="text-sm text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Write review */}
          {user && (
            <div className="bg-[#111] border border-white/5 p-6">
              <h3 className="font-display text-xl tracking-widest mb-4">WRITE A REVIEW</h3>
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <p className="label">Rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button type="button" key={s} onClick={() => setReviewRating(s)}>
                        <HiStar size={24} className={s <= reviewRating ? 'text-brand-amber' : 'text-gray-700'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label">Comment</p>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                    rows={4} className="input-field resize-none" placeholder="Share your thoughts..." />
                </div>
                <button type="submit" className="btn-primary w-full">Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
