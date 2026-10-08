import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-background pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:col-span-2">
            <h3 className="font-[family-name:var(--font-cinzel)] text-2xl tracking-[0.2em] mb-6">RIYA TAROT CRYSTALS</h3>
            <p className="text-sm font-light text-background/70 mb-8 max-w-sm leading-relaxed">
              Discover beautifully crafted crystal bracelets selected to complement your personal intentions, style, and everyday rituals.
            </p>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs tracking-[0.2em] uppercase text-accent font-semibold">JOIN THE RIYA COMMUNITY</h4>
              <p className="text-xs text-background/60">Discover new crystals, collections and stories.</p>
              <div className="flex border-b border-background/20 pb-2 max-w-sm mt-2 focus-within:border-accent transition-colors">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-transparent text-sm w-full outline-none placeholder:text-background/30 text-background"
                />
                <button className="text-xs tracking-widest uppercase hover:text-accent transition-colors flex items-center gap-2">
                  Subscribe <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase mb-8 font-semibold">Shop</h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-background/70">
              <li><Link href="/shop" className="hover:text-accent transition-colors">All Bracelets</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase mb-8 font-semibold">Discover</h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-background/70">
              <li><Link href="/quiz" className="hover:text-accent transition-colors">Find Your Crystal</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">Brand Story</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">Crystal Guide</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">Crystal Journal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase mb-8 font-semibold">Help</h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-background/70">
              <li><Link href="/policies/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/track" className="hover:text-accent transition-colors">Track Order</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-accent transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/policies/refunds" className="hover:text-accent transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-light text-background/50">
          <p>© {new Date().getFullYear()} Riya Tarot Crystals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/riya__tarot" target="_blank" rel="noopener noreferrer" className="hover:text-accent uppercase tracking-widest transition-colors">Instagram</a>
            <a href="https://wa.me/917889001587" target="_blank" rel="noopener noreferrer" className="hover:text-accent uppercase tracking-widest transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
