"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/data/products";
import { useStore, Product } from "@/store/useStore";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const categories = ["All", "Love", "Abundance", "Calm", "Protection", "Confidence", "Focus"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useStore();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-primary/10 pb-8">
          <div>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
            <button className="flex items-center gap-2 text-sm tracking-widest uppercase border border-primary/20 px-4 py-2 hover:bg-secondary transition-colors">
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 text-sm tracking-widest uppercase border border-primary/20 px-4 py-2 hover:bg-secondary transition-colors">
              Sort <ChevronDown size={14} />
            </button>
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
