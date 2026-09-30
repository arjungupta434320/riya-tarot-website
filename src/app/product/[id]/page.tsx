"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { useStore } from "@/store/useStore";
import { Star, Heart, Share2, Plus, Minus, ChevronDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = products.find(p => p.id === resolvedParams.id);
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!product) {
    notFound();
  }

  const displayImage = selectedImage || product.image;
  const galleryImages = product.gallery || [product.image];
  const currentIndex = galleryImages.indexOf(displayImage);

  const paginate = (newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = galleryImages.length - 1;
    if (nextIndex >= galleryImages.length) nextIndex = 0;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  if (relatedProducts.length < 3) {
    relatedProducts.push(...products.filter(p => p.id !== product.id && !relatedProducts.includes(p)).slice(0, 3 - relatedProducts.length));
  }

  return (
    <div className="pt-24 bg-background">
      
      {/* Product Top Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          
          {/* Images - Left */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square bg-secondary w-full overflow-hidden group">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={displayImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={displayImage} 
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slider Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={() => paginate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => paginate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square bg-secondary cursor-pointer border transition-all duration-300 ${displayImage === img ? 'border-primary shadow-sm' : 'border-transparent hover:border-primary/20'}`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name} detail ${i + 1}`}
                      fill
                      className={`object-cover transition-opacity duration-300 ${displayImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details - Right */}
          <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-10 md:sticky top-24 h-max">
            
            <div className="flex items-center gap-2 text-accent mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-xs text-primary/60 font-light underline decoration-primary/20 hover:decoration-primary cursor-pointer transition-colors">
                (12 Reviews)
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-baseline gap-3">
                {product.salePrice && (
                  <span className="text-lg md:text-xl text-primary/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                )}
                <span className="text-2xl md:text-3xl font-medium text-primary">
                  ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                </span>
              </div>
              {product.salePrice && (
                <span className="text-xs tracking-widest font-bold text-[#b85c38] uppercase animate-pulse border border-[#b85c38]/30 px-3 py-1 rounded bg-[#b85c38]/5">
                  50% OFF - FLASH SALE
                </span>
              )}
            </div>
            
            <p className="text-sm font-light leading-relaxed text-primary/80 mb-8">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.shortIntention.split(" • ").map(tag => (
                <span key={tag} className="text-xs tracking-widest uppercase border border-primary/10 px-3 py-1 bg-primary/5">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full h-px bg-primary/10 mb-8"></div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex gap-4">
                <div className="flex items-center border border-primary/20 w-32 justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-4 hover:bg-secondary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-4 hover:bg-secondary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-grow bg-primary text-secondary text-sm tracking-widest uppercase hover:bg-accent transition-colors magnetic-button"
                >
                  Add To Cart
                </button>
              </div>
              
              <button className="w-full border border-primary/20 text-primary text-sm tracking-widest uppercase py-4 hover:bg-secondary transition-colors magnetic-button">
                Buy It Now
              </button>
            </div>

            <div className="flex gap-6 text-sm text-primary/60">
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <Heart size={16} /> Add to Wishlist
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Accordions */}
            <div className="mt-12 flex flex-col border-t border-primary/10">
              {['About the stone', 'How to wear', 'Care guide', 'Our energizing ritual'].map((tab) => (
                <div key={tab} className="border-b border-primary/10">
                  <button 
                    onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
                    className="w-full py-5 flex justify-between items-center text-sm tracking-widest uppercase hover:text-accent transition-colors"
                  >
                    {tab}
                    <ChevronDown size={16} className={`transform transition-transform ${activeTab === tab ? "rotate-180" : ""}`} />
                  </button>
                  {activeTab === tab && (
                    <div className="pb-5 text-sm font-light text-primary/70 leading-relaxed">
                      {tab === 'About the stone' && "Detailed original description of the stone's historical and traditional uses. Note: Properties discussed here are traditionally associated with spiritual practices and not scientifically proven to cure or treat any medical conditions."}
                      {tab === 'How to wear' && "Wear on your receiving hand (usually left) to invite the energy in, or giving hand (usually right) to project the energy outwards."}
                      {tab === 'Care guide' && "Keep away from water, perfumes, and harsh chemicals. Wipe gently with a soft cloth. Store in the provided pouch when not wearing."}
                      {tab === 'Our energizing ritual' && "Every bracelet undergoes a spiritual preparation process before shipping, intended to cleanse its energy and prepare it for your personal intentions."}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* WHY YOU'LL LOVE IT */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-4xl mx-auto">
            <div>
              <div className="w-16 h-16 mx-auto bg-primary text-secondary rounded-full flex items-center justify-center mb-6">
                <Star size={24} strokeWidth={1} />
              </div>
              <h3 className="text-sm tracking-widest uppercase mb-3">Premium Quality</h3>
              <p className="text-sm font-light text-primary/70">Hand-selected natural stones paired with durable, elegant threading.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary text-secondary rounded-full flex items-center justify-center mb-6">
                <Heart size={24} strokeWidth={1} />
              </div>
              <h3 className="text-sm tracking-widest uppercase mb-3">Meaningful Gift</h3>
              <p className="text-sm font-light text-primary/70">Arrives in beautiful packaging, perfect for a thoughtful, intentional gift.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-primary text-secondary rounded-full flex items-center justify-center mb-6">
                <Star size={24} strokeWidth={1} />
              </div>
              <h3 className="text-sm tracking-widest uppercase mb-3">Everyday Elegance</h3>
              <p className="text-sm font-light text-primary/70">Designed to be styled effortlessly with your daily wardrobe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-end items-end mb-12">
            <Link href="/shop" className="hidden md:flex text-sm tracking-widest uppercase hover:text-accent transition-colors items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8">
            {relatedProducts.map((p) => (
              <div key={p.id} className="group flex flex-col h-full">
                <Link href={`/product/${p.id}`} className="relative aspect-square mb-4 bg-secondary overflow-hidden block">
                  <Image 
                    src={p.image} 
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <div className="text-center flex flex-col flex-grow">
                  <h3 className="text-sm tracking-widest uppercase font-semibold mb-1 hover:text-accent transition-colors">
                    <Link href={`/product/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="text-sm font-medium mt-auto">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
