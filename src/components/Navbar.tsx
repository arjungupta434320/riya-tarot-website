"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
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
  const { cart, wishlist, toggleCart, setDrawerTab } = useStore();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch products for instant search
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
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-background md:bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto h-[70px] md:h-[90px] px-4 md:px-6 flex justify-between items-center xl:grid xl:grid-cols-3">
        
        {/* Left: Mobile Hamburger, Mobile Logo & Desktop Links */}
        <div className="flex justify-start items-center z-50">
          <button 
            type="button"
            className="xl:hidden text-foreground p-2 -ml-2 cursor-pointer flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          {/* Mobile Logo */}
          <Link href="/" className="xl:hidden ml-1 flex items-center">
            <Image 
              src="/logo.jpg" 
              alt="Riya Tarot Crystals" 
              width={200} 
              height={200} 
              className="h-[65px] w-auto mix-blend-multiply scale-125 origin-left" 
              priority 
            />
          </Link>
          
          <nav className="hidden xl:flex gap-3 xl:gap-4 2xl:gap-6 text-[10px] xl:text-xs tracking-widest uppercase whitespace-nowrap">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-accent transition-colors">Shop All</Link>
            <Link href="/quiz" className="hover:text-accent transition-colors">Crystal Quiz</Link>
            <Link href="/about" className="hover:text-accent transition-colors">About Us</Link>
            <Link href="/track" className="hover:text-accent transition-colors">Track Order</Link>
          </nav>
        </div>

        {/* Center: Desktop Logo */}
        <div className="hidden xl:flex justify-center items-center z-40">
          <Link href="/" className="flex flex-col items-center">
            <Image 
              src="/logo.jpg" 
              alt="Riya Tarot Crystals" 
              width={250} 
              height={250} 
              className="h-[85px] w-auto mix-blend-multiply scale-110" 
              priority 
            />
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex justify-end items-center gap-3 sm:gap-4 md:gap-6 z-50">
          <Link href="/account" className="hover:text-accent transition-colors">
            <User size={20} className="md:w-5 md:h-5 w-[22px] h-[22px]" />
          </Link>
          <button 
            onClick={() => {
              setDrawerTab('wishlist');
              toggleCart();
            }}
            className="hover:text-accent transition-colors relative"
          >
            <Heart size={20} className="md:w-5 md:h-5 w-[22px] h-[22px]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>
          <button 
            id="cart-icon"
            onClick={() => {
              setDrawerTab('cart');
              toggleCart();
            }}
            className="hover:text-accent transition-colors relative p-2 -mr-2 md:p-0 md:mr-0"
          >
            <ShoppingCart size={24} className="md:w-5 md:h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 md:-top-2 md:-right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Persistent Search Bar Below Header */}
      <div className="w-full bg-background border-t border-primary/10 overflow-visible relative z-[9999]">
        <div className="container mx-auto px-4 py-3 md:py-4 relative">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center group">
            <Search size={18} className="absolute left-4 text-primary/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for bracelets, intentions, crystals..."
              className="w-full bg-secondary/50 border border-primary/20 py-3 pl-12 pr-24 focus:outline-none focus:border-primary transition-colors text-sm"
            />
            <button type="submit" className="absolute right-4 text-xs font-semibold tracking-widest uppercase hover:text-accent transition-colors">
              Search
            </button>
            
            {/* Instant Visual Search Overlay */}
            <AnimatePresence>
              {searchQuery.trim().length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-background border border-primary/10 shadow-2xl z-[100] max-h-[70vh] overflow-y-auto"
                >
                  <div className="p-4 border-b border-primary/5">
                    <span className="text-xs tracking-widest uppercase text-primary/50">Instant Results</span>
                  </div>
                  {(() => {
                    const results = products.filter(p => 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (p.shortIntention && p.shortIntention.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).slice(0, 4);

                    if (results.length === 0) {
                      return <div className="p-6 text-center text-sm text-primary/50">No products found for "{searchQuery}"</div>;
                    }

                    return (
                      <div className="flex flex-col">
                        {results.map(product => (
                          <Link 
                            href={`/product?id=${product.id}`} 
                            key={product.id}
                            onClick={() => setSearchQuery("")}
                            className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors border-b border-primary/5 last:border-0"
                          >
                            <div className="w-16 h-16 bg-secondary relative flex-shrink-0">
                              <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-sm font-semibold tracking-widest uppercase">{product.name}</h4>
                              <p className="text-xs text-primary/60 mt-1">{product.shortIntention}</p>
                            </div>
                            <div className="text-sm font-medium text-primary whitespace-nowrap">
                              ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                            </div>
                          </Link>
                        ))}
                        <button 
                          onClick={handleSearchSubmit}
                          className="p-4 bg-secondary/20 text-xs tracking-widest uppercase text-center hover:bg-primary hover:text-secondary transition-colors"
                        >
                          View All Results
                        </button>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-t border-warm-beige/30 py-6 px-6 flex flex-col gap-4 shadow-2xl z-[100] h-screen">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Shop All</Link>
          <Link href="/quiz" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Crystal Quiz</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">About Us</Link>
          <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Track Order</Link>
        </div>
      )}
    </header>
    </>
  );
}
