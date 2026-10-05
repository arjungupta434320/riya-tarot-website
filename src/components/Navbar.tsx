"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { cart, wishlist, toggleCart, setDrawerTab } = useStore();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
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
      {/* High CTA Announcement Bar */}
      <div className="bg-primary text-secondary py-2 text-xs sm:text-sm tracking-widest uppercase relative z-[60] overflow-hidden flex whitespace-nowrap items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="flex whitespace-nowrap min-w-max"
        >
          {/* We repeat the content twice to create a seamless infinite loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 font-semibold text-[#b85c38]">✨ SIGN UP & GET 20% OFF YOUR FIRST ORDER ✨</span>
              <span className="mx-8">•</span>
              <span className="mx-8">FREE SHIPPING ON ALL ORDERS</span>
              <span className="mx-8">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-4" : "bg-background md:bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto h-[60px] md:h-[80px] px-4 md:px-6 grid grid-cols-3 items-center">
        
        {/* Left: Mobile Hamburger & Desktop Links */}
        <div className="flex justify-start items-center z-50">
          <button 
            type="button"
            className="xl:hidden text-foreground p-2 -ml-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          <nav className="hidden xl:flex gap-3 xl:gap-4 2xl:gap-6 text-[10px] xl:text-xs tracking-widest uppercase whitespace-nowrap">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-accent transition-colors">Shop All</Link>
            <Link href="/quiz" className="hover:text-accent transition-colors">Crystal Quiz</Link>
            <Link href="/#collections" className="hover:text-accent transition-colors">Collections</Link>
            <Link href="/about" className="hover:text-accent transition-colors">About Us</Link>
            <Link href="/track" className="hover:text-accent transition-colors">Track Order</Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center items-center z-40">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl font-normal tracking-[0.1em] md:tracking-[0.15em] 2xl:tracking-[0.25em] text-center font-[family-name:var(--font-cinzel)] text-primary whitespace-nowrap">
              RIYA TAROT CRYSTALS
            </span>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex justify-end items-center gap-3 sm:gap-4 md:gap-6 z-50">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:block hover:text-accent transition-colors"><Search size={20} /></button>
          <Link href="/account" className="hidden md:block hover:text-accent transition-colors"><User size={20} /></Link>
          <button 
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

      {/* Search Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-background border-b border-primary/10 overflow-hidden z-[45]"
          >
            <div className="container mx-auto px-6 py-6">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex items-center">
                <Search size={20} className="absolute left-4 text-primary/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for crystals, intentions, bracelets..."
                  className="w-full bg-secondary/50 border border-primary/20 py-4 pl-12 pr-24 focus:outline-none focus:border-primary transition-colors text-sm"
                  autoFocus
                />
                <button type="submit" className="absolute right-4 text-xs font-semibold tracking-widest uppercase hover:text-accent transition-colors">
                  Search
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-t border-warm-beige/30 py-6 px-6 flex flex-col gap-4 shadow-2xl z-[100] h-screen">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Shop All</Link>
          <Link href="/quiz" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Crystal Quiz</Link>
          <Link href="/#collections" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Collections</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">About Us</Link>
          <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Track Order</Link>
          
          <div className="flex gap-8 mt-6">
            <button onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); }} className="hover:text-accent transition-colors"><Search size={24} /></button>
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-accent transition-colors"><User size={24} /></Link>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
