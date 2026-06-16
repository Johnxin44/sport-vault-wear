import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedProducts } from '../store/slices/productSlice'
import ProductGrid from '../components/product/ProductGrid'
import { HiArrowRight, HiShieldCheck, HiGlobe, HiRefresh } from 'react-icons/hi'

const categories = [
  { label: 'Football',          emoji: '⚽', link: '/products?sport=football',                  count: 'Jerseys' },
  { label: 'Basketball',        emoji: '🏀', link: '/products?sport=basketball',                count: 'NBA Jerseys' },
  { label: 'American Football', emoji: '🏈', link: '/products?sport=american-football',        count: 'NFL Jerseys' },
  { label: 'Sneakers',          emoji: '👟', link: '/products?type=sneakers',                   count: 'Footwear' },
  { label: 'Tracksuits',        emoji: '🧥', link: '/products?type=tracksuit',                  count: 'Hoodies & Sets' },
  { label: 'Accessories',       emoji: '🧢', link: '/products?type=accessory',                  count: 'Caps & Bags' },
]

export default function HomePage() {
  const dispatch = useDispatch()
  const { featured, loading } = useSelector((s) => s.product)

  useEffect(() => { dispatch(fetchFeaturedProducts()) }, [dispatch])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0a] min-h-[90vh] flex items-center">
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none">
          <span className="font-display text-[28vw] text-transparent select-none"
            style={{ WebkitTextStroke: '1px rgba(245,166,35,0.05)', lineHeight: 1 }}>10</span>
        </div>
        <div className="page-wrapper relative z-10 py-24">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.3em] text-brand-amber uppercase mb-6">
              <span className="w-8 h-px bg-brand-amber"></span>
              2024 / 25 Collection
            </p>
            <h1 className="font-display text-7xl md:text-9xl leading-none tracking-wider text-white mb-6">
              WEAR THE<br /><span className="text-brand-amber">LEGEND</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-10">
              Authentic jerseys, sneakers, and sportswear from the world's biggest leagues and brands. Delivered worldwide within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center gap-2">Shop Collection <HiArrowRight size={16} /></Link>
              <Link to="/products?badge=new" className="btn-outline">New Arrivals</Link>
            </div>
            <div className="flex gap-10 mt-16 pt-10 border-t border-white/5">
              {[['500+','Products'],['80+','Teams & Brands'],['24H','Dispatch'],['100%','Authentic']].map(([n,l]) => (
                <div key={l}>
                  <div className="font-display text-3xl text-brand-amber">{n}</div>
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[#080808]">
        <div className="page-wrapper">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="section-title">SHOP BY CATEGORY</h2>
            <Link to="/products" className="text-xs font-semibold tracking-widest uppercase text-brand-amber hover:opacity-70 transition-opacity">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5">
            {categories.map(({ label, emoji, link, count }) => (
              <Link key={label} to={link}
                className="card p-6 text-center group hover:bg-[#1a1a1a] transition-colors">
                <span className="text-3xl block mb-3">{emoji}</span>
                <p className="text-xs font-semibold tracking-widest uppercase text-white group-hover:text-brand-amber transition-colors mb-1">{label}</p>
                <p className="text-[10px] text-gray-600">{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 bg-[#080808]">
        <div className="page-wrapper">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="section-title">FEATURED DROPS</h2>
            <Link to="/products" className="text-xs font-semibold tracking-widest uppercase text-brand-amber hover:opacity-70 transition-opacity">View All →</Link>
          </div>
          <ProductGrid products={featured} loading={loading} />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="page-wrapper">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {[
              { Icon: HiShieldCheck, title: '100% Authentic',   desc: 'Every product officially licensed.' },
              { Icon: HiGlobe,       title: 'Ships Worldwide',  desc: 'Fast tracked delivery to 100+ countries.' },
              { Icon: HiRefresh,     title: '30-Day Returns',   desc: 'Free returns, no questions asked.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 py-10 px-6">
                <Icon size={28} className="text-brand-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-lg tracking-widest text-white mb-1">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
