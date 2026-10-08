import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-secondary pt-20 pb-10 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl mb-6 tracking-widest">RIYA TAROT CRYSTALS</h3>
          </div>

          <div>
            <h4 className="text-sm tracking-widest uppercase mb-6 text-accent">Shop</h4>
            <ul className="flex flex-col gap-3 text-sm font-light text-secondary/80">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Bracelets</Link></li>
              <li><Link href="/#collections" className="hover:text-white transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-widest uppercase mb-6 text-accent">About</h4>
            <ul className="flex flex-col gap-3 text-sm font-light text-secondary/80">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm tracking-widest uppercase mb-6 text-accent">Help & Legal</h4>
            <ul className="flex flex-col gap-3 text-sm font-light text-secondary/80">
              <li><Link href="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/policies/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/policies/refunds" className="hover:text-white transition-colors">Cancellation & Refunds</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-secondary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-secondary/50">
          <p>© {new Date().getFullYear()} Riya Tarot Crystals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/riya__tarot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            <a href="https://wa.me/7889001587" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
