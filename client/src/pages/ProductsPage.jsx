import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productSlice'
import ProductGrid from '../components/product/ProductGrid'
import Pagination from '../components/common/Pagination'
import { HiAdjustments, HiX } from 'react-icons/hi'

const sports = [
  { value: 'football',          label: 'Football' },
  { value: 'basketball',        label: 'Basketball' },
  { value: 'american-football', label: 'American Football' },
  { value: 'lifestyle',         label: 'Lifestyle / Other' },
]

// Which leagues are shown depends on the selected sport
const leaguesBySport = {
  football:          ['Premier League','La Liga','Serie A','Bundesliga','Champions League','International'],
  basketball:        ['NBA'],
  'american-football': ['NFL'],
  lifestyle:         [],
}

const types = [
  { value: 'jersey',    label: 'Jerseys' },
  { value: 'sneakers',  label: 'Sneakers' },
  { value: 'tracksuit', label: 'Tracksuits & Hoodies' },
  { value: 'accessory', label: 'Accessories' },
]

const sortOptions = [
  { value: '',           label: 'Default' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest' },
  { value: 'rating',     label: 'Top Rated' },
]

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { products, loading, total, pages } = useSelector((s) => s.product)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const search   = searchParams.get('search')   || ''
  const sport    = searchParams.get('sport')    || ''
  const league   = searchParams.get('category')   || '' // backend filter name = league
  const type     = searchParams.get('type')     || ''
  const badge    = searchParams.get('badge')    || ''
  const sort     = searchParams.get('sort')     || ''
  const page     = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    dispatch(fetchProducts({ search, category: league, sport, type, badge, sort, page, limit: 12 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [dispatch, search, league, sport, type, badge, sort, page])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    // Changing any filter resets pagination back to page 1 —
    // but don't wipe it out when the page number itself is what's being set
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  // Selecting a sport clears any league that doesn't belong to it
  const handleSportClick = (value) => {
    const next = new URLSearchParams(searchParams)
    if (sport === value) {
      next.delete('sport')
    } else {
      next.set('sport', value)
      next.delete('category')
    }
    next.delete('page')
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  const hasFilters = search || sport || league || type || badge || sort
  const availableLeagues = sport ? (leaguesBySport[sport] || []) : []

  const pageTitle = search ? `SEARCH: "${search}"`
    : league || (type && types.find(t => t.value === type)?.label.toUpperCase())
    || (sport && sports.find(s => s.value === sport)?.label.toUpperCase())
    || 'ALL PRODUCTS'

  const FilterContent = () => (
    <>
      <div className="mb-8">
        <h4 className="label">Shop by Sport</h4>
        {sports.map(s => (
          <button key={s.value} onClick={() => handleSportClick(s.value)}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors mb-1 ${
              sport === s.value ? 'bg-brand-amber/10 text-brand-amber border-l-2 border-brand-amber' : 'text-gray-400 hover:text-white'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {availableLeagues.length > 0 && (
        <div className="mb-8">
          <h4 className="label">League</h4>
          {availableLeagues.map(l => (
            <button key={l} onClick={() => setParam('category', league === l ? '' : l)}
              className={`block w-full text-left py-2 px-3 text-sm transition-colors mb-1 ${
                league === l ? 'bg-brand-amber/10 text-brand-amber border-l-2 border-brand-amber' : 'text-gray-400 hover:text-white'
              }`}>
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h4 className="label">Product Type</h4>
        {types.map(t => (
          <button key={t.value} onClick={() => setParam('type', type === t.value ? '' : t.value)}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors mb-1 ${
              type === t.value ? 'bg-brand-amber/10 text-brand-amber border-l-2 border-brand-amber' : 'text-gray-400 hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h4 className="label">Collection</h4>
        {[['new','New Arrivals'],['hot','Hot'],['sale','On Sale']].map(([v,l]) => (
          <button key={v} onClick={() => setParam('badge', badge === v ? '' : v)}
            className={`block w-full text-left py-2 px-3 text-sm transition-colors mb-1 ${
              badge === v ? 'bg-brand-amber/10 text-brand-amber border-l-2 border-brand-amber' : 'text-gray-400 hover:text-white'
            }`}>
            {l}
          </button>
        ))}
      </div>
    </>
  )

  return (
    <div className="page-wrapper py-12 animate-fade-in">
      <div className="flex items-start gap-8">

        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl tracking-widest">FILTERS</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <HiX size={12} /> Clear
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/70 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-72 bg-[#0a0a0a] p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl tracking-widest">FILTERS</h3>
                <button onClick={() => setShowFilters(false)}><HiX size={20} /></button>
              </div>
              <FilterContent />
              {hasFilters && (
                <button onClick={clearFilters} className="btn-outline w-full mt-4">Clear All Filters</button>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl tracking-widest text-white">{pageTitle}</h1>
              <p className="text-sm text-gray-500 mt-1">{total} results</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-9 h-9 border border-white/10 flex items-center justify-center text-gray-400 hover:border-brand-amber hover:text-brand-amber transition-colors">
                <HiAdjustments size={16} />
              </button>
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="bg-[#1a1a1a] border border-white/10 text-gray-300 text-xs tracking-widest uppercase px-3 py-2.5 focus:outline-none focus:border-brand-amber"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Active filters pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {sport  && <span className="flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs px-3 py-1.5">
                {sports.find(s => s.value === sport)?.label} <button onClick={() => handleSportClick(sport)}><HiX size={10} /></button></span>}
              {league && <span className="flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs px-3 py-1.5">
                {league} <button onClick={() => setParam('category','')}><HiX size={10} /></button></span>}
              {type   && <span className="flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs px-3 py-1.5">
                {types.find(t => t.value === type)?.label} <button onClick={() => setParam('type','')}><HiX size={10} /></button></span>}
              {badge  && <span className="flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs px-3 py-1.5">
                {badge} <button onClick={() => setParam('badge','')}><HiX size={10} /></button></span>}
              {search && <span className="flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-xs px-3 py-1.5">
                "{search}" <button onClick={() => setParam('search','')}><HiX size={10} /></button></span>}
            </div>
          )}

          <ProductGrid products={products} loading={loading} />
          <Pagination page={page} pages={pages} onPageChange={(p) => setParam('page', p)} />
        </div>
      </div>
    </div>
  )
}
