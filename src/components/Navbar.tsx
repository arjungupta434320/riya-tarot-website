"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts } from "@/data/products";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const { cart, toggleCart, setDrawerTab } = useStore();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    fetchProducts().then(setProducts);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4" 
            : "bg-background py-6"
        }`}
      >
        <div className="container mx-auto px-6 grid grid-cols-3 items-center">
        
          {/* Left: Desktop Links & Mobile Hamburger */}
          <div className="flex justify-start items-center">
            <button 
              type="button"
              className="lg:hidden text-primary p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
            
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] tracking-[0.15em] uppercase font-medium text-primary">
              <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
              <Link href="/quiz" className="hover:text-accent transition-colors">Find Your Crystal</Link>
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center items-center">
            <Link href="/" className="flex flex-col items-center group">
              <span className="text-base sm:text-lg lg:text-xl tracking-[0.2em] md:tracking-[0.25em] text-center font-[family-name:var(--font-cinzel)] text-primary group-hover:opacity-80 transition-opacity">
                RIYA TAROT CRYSTALS
              </span>
            </Link>
          </div>

          {/* Right Nav */}
          <div className="flex justify-end items-center gap-5">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:text-accent transition-colors text-primary"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link href="/account" className="hidden sm:block hover:text-accent transition-colors text-primary">
              <User size={20} strokeWidth={1.5} />
            </Link>
            <button 
              id="cart-icon"
              onClick={() => {
                setDrawerTab('cart');
                toggleCart();
              }}
              className="hover:text-accent transition-colors relative text-primary p-2 -mr-2 sm:p-0 sm:mr-0"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 sm:-top-2 sm:-right-2 bg-primary text-secondary text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-background border-b border-border overflow-hidden shadow-sm"
            >
              <div className="container mx-auto px-6 py-6">
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center group">
                  <Search size={18} className="absolute left-4 text-primary/40" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for intention, crystal or color..."
                    className="w-full bg-secondary/30 border border-primary/10 rounded-sm py-3.5 pl-12 pr-24 focus:outline-none focus:border-primary transition-colors text-sm text-primary"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-4 text-[11px] font-semibold tracking-widest uppercase hover:text-accent transition-colors">
                    Search
                  </button>
                </form>

                {searchQuery.trim().length > 1 && (
                  <div className="max-w-2xl mx-auto mt-4 bg-white border border-primary/5 shadow-sm rounded-sm overflow-hidden">
                    {(() => {
                      const results = products.filter(p => 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.shortIntention && p.shortIntention.toLowerCase().includes(searchQuery.toLowerCase()))
                      ).slice(0, 3);

                      if (results.length === 0) return <div className="p-4 text-center text-sm text-primary/50">No results found</div>;

                      return (
                        <div className="flex flex-col">
                          {results.map(product => (
                            <Link 
                              href={`/product?id=${product.id}`} 
                              key={product.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors border-b border-primary/5 last:border-0"
                            >
                              <div className="w-12 h-12 bg-secondary relative">
                                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover rounded-sm" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-xs font-semibold tracking-widest uppercase text-primary">{product.name}</h4>
                                <p className="text-[11px] text-muted mt-1">{product.shortIntention}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-background z-[100] flex flex-col pt-24 px-6"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 left-6 text-primary"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
            <nav className="flex flex-col gap-8 text-lg tracking-[0.2em] uppercase font-light font-serif mt-12">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop Collection</Link>
              <Link href="/quiz" onClick={() => setIsMobileMenuOpen(false)}>Crystal Quiz</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Brand Story</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
