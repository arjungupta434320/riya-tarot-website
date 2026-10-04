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
              <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
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
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
