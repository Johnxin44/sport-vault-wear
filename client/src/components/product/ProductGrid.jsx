import ProductCard from './ProductCard'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'
import { HiShoppingBag } from 'react-icons/hi'
import { Link } from 'react-router-dom'

export default function ProductGrid({ products, loading }) {
  if (loading) return <Spinner size="lg" />
  if (!products?.length) return (
    <EmptyState
      icon={<HiShoppingBag />}
      title="NO JERSEYS FOUND"
      message="Try adjusting your filters or search term."
      action={<Link to="/products" className="btn-outline text-sm">View All</Link>}
    />
  )
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  )
}
