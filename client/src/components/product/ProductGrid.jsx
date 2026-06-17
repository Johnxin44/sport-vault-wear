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
      title="NO PRODUCTS FOUND"
      message="Try adjusting your filters or search term — or let us know what you're looking for."
      action={
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/products" className="btn-outline text-sm">View All</Link>
          <Link to="/request-product" className="btn-primary text-sm">Request This Item</Link>
        </div>
      }
    />
  )
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  )
}
