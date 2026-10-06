"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchProducts } from "@/data/products";
import { useStore, Product } from "@/store/useStore";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const categories = ["Bracelets"];

function ShopContent() {
  const [activeCategory, setActiveCategory] = useState("Bracelets");
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
    const matchesCategory = activeCategory === "Bracelets" || p.category === activeCategory;
    const matchesSearch = !searchQuery || 
      (p.name && p.name.toLowerCase().includes(searchQuery)) || 
      (p.description && p.description.toLowerCase().includes(searchQuery)) || 
      (p.shortIntention && p.shortIntention.toLowerCase().includes(searchQuery)) ||
      (p.category && p.category.toLowerCase().includes(searchQuery));
      
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortOption === "price-low") return priceA - priceB;
    if (sortOption === "price-high") return priceB - priceA;
    return 0; // featured
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6">
        
        {searchQuery && (
          <div className="mb-8">
            <h1 className="font-serif text-2xl md:text-3xl text-primary">
              Search results for "{searchQuery}"
            </h1>
            <button 
              onClick={() => window.location.href = '/shop'} 
              className="text-xs tracking-widest uppercase border-b border-primary/20 text-primary/60 hover:text-primary mt-4"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-primary/10 pb-8">
          <div>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0 relative">
            <button 
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 text-sm tracking-widest uppercase border border-primary/20 px-4 py-2 hover:bg-secondary transition-colors"
            >
              Sort By {sortOption === 'price-low' ? ': Price (Low)' : sortOption === 'price-high' ? ': Price (High)' : ''} <ChevronDown size={14} className={`transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>

            {showSort && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-primary/10 shadow-xl z-50">
                <button 
                  onClick={() => { setSortOption('featured'); setShowSort(false); }}
                  className="block w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-secondary transition-colors"
                >
                  Featured
                </button>
                <button 
                  onClick={() => { setSortOption('price-low'); setShowSort(false); }}
                  className="block w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-secondary transition-colors border-t border-primary/5"
                >
                  Price: Low to High
                </button>
                <button 
                  onClick={() => { setSortOption('price-high'); setShowSort(false); }}
                  className="block w-full text-left px-4 py-3 text-xs tracking-widest uppercase hover:bg-secondary transition-colors border-t border-primary/5"
                >
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Mobile Scroll / Desktop Flex */}
        <div className="flex gap-6 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs tracking-widest uppercase whitespace-nowrap pb-1 transition-colors ${
                activeCategory === cat 
                  ? "border-b border-primary font-semibold" 
                  : "text-primary/50 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col h-full">
              <Link href={`/product?id=${product.id}`} className="relative aspect-square mb-4 bg-secondary overflow-hidden block">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="flex-1 bg-primary text-secondary text-xs tracking-widest py-3 uppercase hover:bg-accent transition-colors magnetic-button"
                  >
                    Quick Add
                  </button>
                </div>
              </Link>
              <div className="text-center flex flex-col flex-grow">
                <h3 className="text-sm tracking-widest uppercase font-semibold mb-1 hover:text-accent transition-colors">
                  <Link href={`/product?id=${product.id}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-primary/60 font-light mb-2 flex-grow">{product.shortIntention}</p>
                <div className="flex flex-col items-center gap-1.5 mt-auto">
                  <div className="flex items-center gap-2">
                    {product.salePrice && (
                      <span className="text-xs text-primary/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-sm font-medium text-primary">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
                  </div>
                  {product.salePrice && (
                    <span className="text-[10px] tracking-widest font-bold text-[#b85c38] uppercase animate-pulse border border-[#b85c38]/30 px-2 py-0.5 rounded bg-[#b85c38]/5">
                      50% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-24 bg-background flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  );
}
