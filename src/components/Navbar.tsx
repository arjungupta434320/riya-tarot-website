"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, toggleCart } = useStore();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* High CTA Announcement Bar */}
      <div className="bg-primary text-secondary py-2 px-4 text-center text-xs sm:text-sm tracking-widest uppercase relative z-[60] flex items-center justify-center gap-2">
        <span>FREE SHIPPING ON ALL ORDERS</span>
      </div>

      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-4" : "bg-background md:bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto h-[60px] md:h-[80px] flex justify-center items-center relative">
        
        {/* Left: Mobile Hamburger & Desktop Links */}
        <div className="absolute left-4 md:left-6 flex justify-start items-center z-50">
          <button 
            type="button"
            className="xl:hidden text-foreground p-2 -ml-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          <nav className="hidden xl:flex gap-6 2xl:gap-8 text-xs tracking-widest uppercase ml-4">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-accent transition-colors">Shop All</Link>
            <Link href="/#collections" className="hover:text-accent transition-colors">Collections</Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center items-center z-40 px-12">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-sm sm:text-base md:text-2xl font-normal tracking-[0.15em] md:tracking-[0.25em] text-center font-[family-name:var(--font-cinzel)] text-primary">
              RIYA TAROT CRYSTALS
            </span>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="absolute right-4 md:right-6 flex items-center justify-end gap-3 sm:gap-4 md:gap-6 z-50">
          <button className="hidden md:block hover:text-accent transition-colors"><Search size={20} /></button>
          <button className="hidden md:block hover:text-accent transition-colors"><User size={20} /></button>
          <button className="hidden md:block hover:text-accent transition-colors"><Heart size={20} /></button>
          <button onClick={toggleCart} className="hover:text-accent transition-colors relative p-2 -mr-2 md:p-0 md:mr-0">
            <ShoppingCart size={24} className="md:w-5 md:h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 md:-top-2 md:-right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-t border-warm-beige/30 py-6 px-6 flex flex-col gap-4 shadow-2xl z-[100] h-screen">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Shop All</Link>
          <Link href="/#collections" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Collections</Link>
          <Link href="/#ritual" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 border-b border-warm-beige/20 text-foreground">Our Ritual</Link>
          <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-base tracking-widest uppercase py-3 text-foreground">Our Story</Link>
          
          <div className="flex gap-8 mt-6">
            <button className="hover:text-accent transition-colors"><Search size={24} /></button>
            <button className="hover:text-accent transition-colors"><User size={24} /></button>
            <button className="hover:text-accent transition-colors"><Heart size={24} /></button>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
