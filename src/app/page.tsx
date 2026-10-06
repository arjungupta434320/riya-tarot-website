"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { fetchProducts } from "@/data/products";
import { ArrowRight, Star, ShieldCheck, Gift, Lock } from "lucide-react";
import { useStore } from "@/store/useStore";

const trustFeatures = [
  { icon: ShieldCheck, title: "HAND-FINISHED", desc: "Carefully presented crystal jewelry." },
  { icon: Star, title: "INTENTION PREPARED", desc: "Prepared as part of our spiritual ritual experience." },
  { icon: Gift, title: "GIFT READY", desc: "Elegant packaging for meaningful gifting." },
  { icon: Lock, title: "SECURE SHOPPING", desc: "Simple and secure online checkout." },
];

const intentions = [
  { name: "LOVE", image: "/images/products/rose-quartz-new.jpg", id: "love-attraction" },
  { name: "CALM", image: "/images/products/turquoise-new.jpg", id: "turquoise" },
  { name: "PROTECTION", image: "/images/products/red-carnelian-new.jpg", id: "red-carnelian" },
  { name: "CONFIDENCE", image: "/images/products/tiger-eye-new.jpg", id: "tiger-eye-celeb" },
  { name: "FOCUS", image: "/images/products/citrine-new.jpg", id: "citrine" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const { addToCart } = useStore();
  
  const [dynamicProducts, setDynamicProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchProducts().then(setDynamicProducts);
  }, []);

  const featuredProducts = dynamicProducts.slice(0, 4);

  return (
    <div className="bg-background text-primary overflow-hidden">
      


      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[90vh] md:h-screen w-full bg-primary flex items-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full bg-primary">
          {/* Original Hero Image */}
          <div className="absolute inset-0 bg-[url('/images/hero_background.jpg')] bg-cover bg-center opacity-60 mix-blend-luminosity transition-transform duration-[20000ms] hover:scale-110"></div>
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center h-full pt-20">
          <div className="max-w-4xl text-secondary flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] md:tracking-[0.3em] mb-12 font-[family-name:var(--font-cinzel)]"
            >
              RIYA TAROT CRYSTALS
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            >
              <Link href="/shop" className="px-10 py-4 border border-secondary/60 text-secondary text-xs sm:text-sm tracking-[0.2em] uppercase hover:bg-secondary hover:text-primary transition-all duration-500 ease-out backdrop-blur-sm">
                Shop the Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-12 md:py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {trustFeatures.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <feature.icon className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
                <h3 className="text-sm tracking-widest font-semibold mb-2 uppercase">{feature.title}</h3>
                <p className="text-sm text-primary/70 font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY INTENTION */}
      <section id="collections" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {intentions.map((intention, idx) => (
              <Link href={`/product?id=${intention.id}`} key={idx}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer block relative overflow-hidden aspect-square bg-secondary h-full w-full"
                >
                  <Image 
                    src={intention.image} 
                    alt={intention.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col items-center">
                    <h3 className="text-lg md:text-xl font-serif tracking-widest mb-2">{intention.name}</h3>
                    <span className="text-xs tracking-[0.2em] uppercase border-b border-white/50 pb-1 flex items-center gap-2 group-hover:border-accent group-hover:text-accent transition-colors">
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BRACELETS */}
      <section id="featured" className="py-16 md:py-24 bg-secondary/50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex justify-end items-end mb-12">
            <Link href="/shop" className="hidden md:flex text-sm tracking-widest uppercase hover:text-accent transition-colors items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar -mx-6 px-6">
            {dynamicProducts.slice(0, 6).map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-center group"
              >
                <div className="relative aspect-square mb-6 bg-secondary overflow-hidden">
                  <Link href={`/product?id=${product.id}`} className="block absolute inset-0 z-0">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        import("@/lib/animations").then(m => m.flyToCart(e, product.image));
                        addToCart(product);
                      }}
                      className="flex-1 bg-primary text-secondary text-xs tracking-widest py-3 uppercase hover:bg-accent transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm tracking-widest uppercase font-semibold mb-1 hover:text-accent transition-colors cursor-pointer">
                    <Link href={`/product?id=${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-xs text-primary/60 font-light mb-2 h-4 truncate">{product.shortIntention}</p>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2">
                      {product.salePrice && (
                        <span className="text-xs text-primary/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                      )}
                      <span className="text-sm font-medium text-primary">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
                    </div>
                    {product.salePrice && (
                      <span className="text-[10px] tracking-widest font-bold text-[#b85c38] uppercase animate-pulse border border-[#b85c38]/30 px-2 py-0.5 rounded bg-[#b85c38]/5">
                        50% OFF - LIMITED TIME
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* SOCIAL PROOF / REVIEWS */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-1 text-accent mt-4">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "The presentation alone feels so luxurious. I wear my Dhan Yog bracelet every day as a reminder of my goals.", author: "S. K." },
              { text: "Beautifully crafted. You can really feel the care that went into preparing it. A perfect gift for my sister.", author: "A. M." },
              { text: "Minimal, elegant, and deeply meaningful. I love how it layers with my everyday watch.", author: "R. P." }
            ].map((review, idx) => (
              <div key={idx} className="bg-background p-8 text-center flex flex-col items-center">
                <p className="text-sm italic text-primary/80 mb-6 leading-relaxed">"{review.text}"</p>
                <p className="text-xs font-semibold tracking-widest uppercase">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
