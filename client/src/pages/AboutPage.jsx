import { Link } from 'react-router-dom'
import { HiShieldCheck, HiGlobe, HiRefresh, HiHeart } from 'react-icons/hi'

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <section className="relative bg-[#0a0a0a] py-24 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none">
          <span className="font-display text-[24vw] text-transparent select-none"
            style={{ WebkitTextStroke: '1px rgba(245,166,35,0.05)', lineHeight: 1 }}>SVW</span>
        </div>
        <div className="page-wrapper relative z-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-brand-amber uppercase mb-4">Our Story</p>
          <h1 className="font-display text-6xl md:text-8xl tracking-widest text-white mb-6">ABOUT SPORT VAULT WEAR</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Founded by sports fans for sports fans, Sport Vault Wear brings authentic, top-quality
            jerseys, sneakers, and sportswear from the world's biggest leagues and brands directly to fans worldwide — without the markup of
            traditional retail.
          </p>
        </div>
      </section>

      <section className="page-wrapper py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-6">OUR MISSION</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              We believe every fan deserves to wear their colors with pride — at a fair price, with
              fast delivery, no matter where in the world they are.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Every product we sell is sourced from official partners and inspected for quality before
              it ships. From Old Trafford to your front door in 24 hours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/5">
            {[['500+','Products in Stock'],['80+','Teams & Brands'],['100+','Countries Shipped To'],['10K+','Happy Customers']].map(([n,l]) => (
              <div key={l} className="bg-[#111] p-8 text-center">
                <div className="font-display text-4xl text-brand-amber mb-2">{n}</div>
                <div className="text-xs tracking-widest uppercase text-gray-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="page-wrapper py-20">
          <h2 className="section-title text-center mb-12">WHY CHOOSE US</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5">
            {[
              { Icon: HiShieldCheck, t: '100% Authentic', d: 'Officially licensed products only.' },
              { Icon: HiGlobe,       t: 'Global Shipping', d: 'Tracked delivery to over 100 countries.' },
              { Icon: HiRefresh,     t: '30-Day Returns',  d: 'Free, hassle-free returns.' },
              { Icon: HiHeart,       t: 'Fan Owned',       d: 'Built by supporters, for supporters.' },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="bg-[#0a0a0a] p-8 text-center">
                <Icon size={32} className="text-brand-amber mx-auto mb-4" />
                <h3 className="font-display text-lg tracking-widest text-white mb-2">{t}</h3>
                <p className="text-sm text-gray-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrapper py-20 text-center">
        <h2 className="section-title mb-6">READY TO GEAR UP?</h2>
        <Link to="/products" className="btn-primary">Shop the Collection</Link>
      </section>
    </div>
  )
}
