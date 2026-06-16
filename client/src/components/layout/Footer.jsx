import { Link } from 'react-router-dom'
import { HiMail, HiPhone } from 'react-icons/hi'
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 mt-24">
      <div className="page-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-brand-amber rounded-full"></span>
              <span className="font-display text-xl tracking-[0.2em]">SPORT VAULT WEAR</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Premium jerseys, sneakers, and sportswear from the world's biggest leagues and brands. Delivered worldwide.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center text-gray-500 hover:border-brand-amber hover:text-brand-amber transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm tracking-widest text-white mb-4">SHOP</h4>
            <div className="flex flex-col gap-3">
              {[
                ['Football', '/products?sport=football'],
                ['Basketball', '/products?sport=basketball'],
                ['American Football', '/products?sport=american-football'],
                ['Sneakers', '/products?type=sneakers'],
                ['Accessories', '/products?type=accessory'],
              ].map(([cat, link]) => (
                <Link key={cat} to={link} className="text-sm text-gray-500 hover:text-brand-amber transition-colors">{cat}</Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display text-sm tracking-widest text-white mb-4">INFO</h4>
            <div className="flex flex-col gap-3">
              {[['About', '/about'], ['Contact', '/contact'], ['Shipping', '/'], ['Returns', '/'], ['FAQ', '/']].map(([l,h]) => (
                <Link key={l} to={h} className="text-sm text-gray-500 hover:text-brand-amber transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm tracking-widest text-white mb-4">CONTACT</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@sportvaultwear.com" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-amber transition-colors">
                <HiMail size={14} /> info@sportvaultwear.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-amber transition-colors">
                <HiPhone size={14} /> +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Sport Vault Wear. All rights reserved.</p>
          <p className="text-xs text-gray-600">Secure payments by Stripe</p>
        </div>
      </div>
    </footer>
  )
}
