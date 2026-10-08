"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchProducts } from "@/data/products";
import { useStore, Product } from "@/store/useStore";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useStore();
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [sortOption, setSortOption] = useState("featured");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      (p.name && p.name.toLowerCase().includes(searchQuery)) || 
      (p.description && p.description.toLowerCase().includes(searchQuery)) || 
      (p.shortIntention && p.shortIntention.toLowerCase().includes(searchQuery)) ||
      (p.category && p.category.toLowerCase().includes(searchQuery));
      
    return matchesSearch;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortOption === "price-low") return priceA - priceB;
    if (sortOption === "price-high") return priceB - priceA;
    return 0; // featured
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {searchQuery ? (
          <div className="mb-12 text-center">
            <h1 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-4xl text-primary tracking-wide">
              Search results for "{searchQuery}"
            </h1>
            <button 
              onClick={() => window.location.href = '/shop'} 
              className="text-[10px] tracking-[0.2em] uppercase border-b border-primary/20 text-primary/60 hover:text-primary mt-4 pb-1 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="mb-16 text-center">
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl text-primary tracking-[0.1em] mb-4">
              THE COLLECTION
            </h1>
            <p className="text-muted text-sm md:text-base font-light max-w-2xl mx-auto">
              Explore our curated selection of intention-based crystal bracelets. Each piece is crafted to support your personal journey.
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-end items-end mb-12 border-b border-primary/10 pb-6 relative z-30">
          <div className="flex gap-4 w-full md:w-auto relative">
            <button 
              onClick={() => setShowSort(!showSort)}
              className="w-full md:w-auto flex items-center justify-between md:justify-center gap-3 text-[11px] tracking-[0.15em] font-medium uppercase border border-primary/20 px-6 py-3 hover:bg-secondary transition-colors"
            >
              Sort By {sortOption === 'price-low' ? ': Price (Low)' : sortOption === 'price-high' ? ': Price (High)' : ''} 
              <ChevronDown size={14} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} strokeWidth={1.5} />
            </button>

            {showSort && (
              <div className="absolute top-full right-0 w-full md:w-48 bg-white border border-border shadow-md z-50">
                <button 
                  onClick={() => { setSortOption('featured'); setShowSort(false); }}
                  className="block w-full text-left px-5 py-3.5 text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-secondary transition-colors text-primary"
                >
                  Featured
                </button>
                <button 
                  onClick={() => { setSortOption('price-low'); setShowSort(false); }}
                  className="block w-full text-left px-5 py-3.5 text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-secondary transition-colors border-t border-border text-primary"
                >
                  Price: Low to High
                </button>
                <button 
                  onClick={() => { setSortOption('price-high'); setShowSort(false); }}
                  className="block w-full text-left px-5 py-3.5 text-[10px] font-medium tracking-[0.15em] uppercase hover:bg-secondary transition-colors border-t border-border text-primary"
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-primary/50 font-light mb-6">No products found matching your criteria.</p>
            <Link href="/shop" className="text-[11px] tracking-widest uppercase border-b border-primary pb-1 text-primary hover:text-accent hover:border-accent transition-colors">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.5) }}
                className="group flex flex-col"
              >
                <div className="relative aspect-square mb-5 bg-secondary overflow-hidden">
                  <Link href={`/product?id=${product.id}`} className="block absolute inset-0 z-0">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 w-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        import("@/lib/animations").then(m => m.flyToCart(e, product.image));
                        addToCart(product, 1);
                      }}
                      className="flex-1 bg-white/90 backdrop-blur-sm border border-border text-primary text-[10px] font-medium tracking-[0.15em] py-3 uppercase hover:bg-primary hover:text-background transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-xs tracking-widest uppercase font-semibold mb-1">
                    <Link href={`/product?id=${product.id}`} className="hover:text-accent transition-colors text-primary">{product.name}</Link>
                  </h3>
                  <p className="text-[11px] text-muted font-light mb-2">{product.shortIntention || "Beautifully crafted bracelet"}</p>
                  
                  <div className="flex items-center gap-2">
                    {product.salePrice && (
                      <span className="text-[11px] text-muted line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-[13px] font-medium text-primary">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-24 bg-background flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-t-2 border-primary border-solid rounded-full"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
