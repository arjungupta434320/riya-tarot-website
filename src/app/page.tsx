"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { fetchProducts } from "@/data/products";
import { ArrowRight, Sparkles, Gem, ShieldCheck, HeartHandshake, PackageCheck, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";

const trustFeatures = [
  { icon: Gem, title: "NATURAL GEMSTONES" },
  { icon: ShieldCheck, title: "QUALITY CHECKED" },
  { icon: PackageCheck, title: "SECURE CHECKOUT" },
  { icon: HeartHandshake, title: "CUSTOMER SUPPORT" },
];

const intentions = [
  { name: "LOVE", desc: "Attract & nurture relationships", image: "/images/products/rose-quartz-new.jpg", id: "love-attraction" },
  { name: "CALM", desc: "Inner peace & stress relief", image: "/images/products/turquoise-new.jpg", id: "turquoise" },
  { name: "PROTECTION", desc: "Grounding & energy shielding", image: "/images/products/red-carnelian-new.jpg", id: "red-carnelian" },
  { name: "CONFIDENCE", desc: "Self-belief & empowerment", image: "/images/products/tiger-eye-new.jpg", id: "tiger-eye-celeb" },
  { name: "ABUNDANCE", desc: "Financial growth & success", image: "/images/products/citrine-new.jpg", id: "citrine" },
  { name: "FOCUS", desc: "Mental clarity & motivation", image: "/images/products/clear-quartz.jpg", id: "clear-quartz" }, // Assuming a clear quartz product
];

const stacks = [
  {
    name: "CALM STACK",
    crystals: ["Amethyst", "Howlite", "Lepidolite"],
    image: "https://images.unsplash.com/photo-1611078519441-26792cd8623b"
  },
  {
    name: "PROTECTION STACK",
    crystals: ["Black Tourmaline", "Black Obsidian", "Hematite"],
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1"
  },
  {
    name: "ABUNDANCE STACK",
    crystals: ["Citrine", "Green Aventurine", "Clear Quartz"],
    image: "https://images.unsplash.com/photo-1598046125712-4299b9eb2491"
  }
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const { addToCart } = useStore();
  const prefersReducedMotion = useReducedMotion();
  
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setDynamicProducts);
  }, []);

  const featuredProducts = dynamicProducts.slice(0, 6);

  return (
    <div className="bg-background text-primary overflow-hidden">

      {/* LUXURY HERO SECTION */}
      <section ref={heroRef} className="relative h-[85vh] md:h-[90vh] w-full bg-secondary flex items-center overflow-hidden">
        <motion.div style={{ y: prefersReducedMotion ? 0 : y }} className="absolute inset-0 w-full h-full bg-secondary">
          {/* Using a premium minimal aesthetic image placeholder */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2940')] bg-cover bg-center opacity-40 mix-blend-multiply transition-transform duration-[20000ms] hover:scale-105"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90"></div>
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center h-full pt-16">
          <div className="max-w-3xl flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-tight font-light tracking-[0.05em] mb-6 font-[family-name:var(--font-cinzel)] text-primary"
            >
              CRYSTALS WITH INTENTION
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-sm md:text-base font-light text-primary/80 mb-10 max-w-lg leading-relaxed"
            >
              Discover beautifully crafted crystal bracelets selected to complement your personal intentions, style, and everyday rituals.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/shop" className="px-10 py-4 bg-primary text-background text-[11px] tracking-[0.2em] uppercase hover:bg-primary/90 transition-all text-center">
                Shop Bracelets
              </Link>
              <Link href="/quiz" className="px-10 py-4 border border-primary text-primary text-[11px] tracking-[0.2em] uppercase hover:bg-primary/5 transition-all text-center">
                Find Your Crystal
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP (MINIMAL) */}
      <section className="py-8 md:py-12 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustFeatures.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <feature.icon className="w-5 h-5 text-accent mb-3 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                <h3 className="text-[10px] tracking-[0.15em] font-medium uppercase text-primary/70">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY INTENTION (EDITORIAL) */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-primary mb-4">SHOP BY INTENTION</h2>
            <p className="text-muted font-light text-sm md:text-base">Choose a bracelet based on the intention you'd like to carry with you.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {intentions.map((intention, idx) => (
              <Link href={`/product?id=${intention.id}`} key={idx} className="group block">
                <div className="relative aspect-[4/5] bg-secondary overflow-hidden mb-5">
                  <Image 
                    src={intention.image} 
                    alt={intention.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                </div>
                <div className="text-center flex flex-col items-center">
                  <h3 className="text-sm md:text-base font-[family-name:var(--font-cinzel)] tracking-[0.15em] text-primary mb-2">{intention.name}</h3>
                  <p className="text-[11px] text-muted mb-3 h-8">{intention.desc}</p>
                  <span className="text-[10px] tracking-widest uppercase border-b border-border pb-1 flex items-center gap-2 group-hover:border-accent group-hover:text-accent transition-colors">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THE SIGNATURE COLLECTION */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-primary mb-4">THE SIGNATURE COLLECTION</h2>
              <p className="text-muted font-light text-sm md:text-base max-w-md">Our most-loved crystal bracelets, thoughtfully selected for everyday wear.</p>
            </div>
            <Link href="/shop" className="text-[11px] tracking-widest uppercase hover:text-accent transition-colors flex items-center gap-2 font-medium">
              View All Bracelets <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
            {featuredProducts.map((product, idx) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-square mb-5 bg-background overflow-hidden">
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
                    <Link href={`/product?id=${product.id}`} className="hover:text-accent transition-colors">{product.name}</Link>
                  </h3>
                  <p className="text-[11px] text-muted font-light mb-2">{product.shortIntention || "Beautifully crafted bracelet"}</p>
                  <div className="flex items-center gap-2">
                    {product.salePrice && (
                      <span className="text-[11px] text-muted line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-[13px] font-medium text-primary">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CRYSTAL QUIZ BANNER */}
      <section className="py-0 bg-background">
        <div className="container mx-auto px-6 py-24 md:py-32 border-b border-border">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 relative aspect-square lg:aspect-[4/3] bg-secondary overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1598449356475-b9f71db7d847" 
                alt="Crystal Quiz" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
              <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold mb-4">Personalized Guide</span>
              <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] text-primary mb-6 leading-tight">
                NOT SURE WHICH CRYSTAL TO CHOOSE?
              </h2>
              <p className="text-muted font-light text-sm md:text-base mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Find the bracelet that best matches your current intention, aesthetic, and spiritual journey.
              </p>
              <Link href="/quiz" className="inline-flex justify-center lg:justify-start">
                <span className="px-8 py-4 bg-primary text-background text-[11px] tracking-[0.15em] uppercase hover:bg-primary/90 transition-all font-medium">
                  Take the 30-Second Crystal Quiz
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BUILD YOUR CRYSTAL STACK */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-primary mb-4">BUILD YOUR CRYSTAL STACK</h2>
            <p className="text-muted font-light text-sm md:text-base">Choose bracelets that complement your intentions and personal style.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stacks.map((stack, idx) => (
              <div key={idx} className="group border border-border bg-background p-6 hover:border-accent/50 transition-colors">
                <div className="relative aspect-[4/3] bg-secondary mb-6 overflow-hidden">
                  <Image src={stack.image} alt={stack.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-sm tracking-[0.15em] uppercase font-semibold text-primary mb-3 text-center">{stack.name}</h3>
                <ul className="text-[12px] text-muted font-light text-center flex flex-col gap-1.5 mb-6">
                  {stack.crystals.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop" className="inline-block text-[11px] tracking-[0.15em] uppercase font-medium border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
              Explore Stacks
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-primary mb-8">THE RIYA TAROT CRYSTALS STORY</h2>
            <div className="flex justify-center mb-8"><Sparkles className="text-accent" size={24} strokeWidth={1} /></div>
            <p className="text-sm md:text-base text-primary/80 font-light leading-relaxed mb-6">
              Founded on the belief that everyday jewelry should carry profound personal meaning, Riya Tarot Crystals was born to bridge the gap between elegant aesthetics and intentional living. 
            </p>
            <p className="text-sm md:text-base text-primary/80 font-light leading-relaxed mb-10">
              Every natural gemstone is thoughtfully selected, beautifully finished, and presented to serve as a quiet, sophisticated reminder of your personal journey and aspirations.
            </p>
            <Link href="/about" className="text-[11px] tracking-[0.15em] uppercase font-medium border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* THE CRYSTAL JOURNAL (SEO / BLOG TEASER) */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-cinzel)] text-primary mb-4">THE CRYSTAL JOURNAL</h2>
              <p className="text-muted font-light text-sm md:text-base">Editorial insights on crystals, care, and intentional living.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "How to Choose Your First Crystal Bracelet", category: "Guides", img: "https://images.unsplash.com/photo-1598046125712-4299b9eb2491" },
              { title: "Understanding Crystal Colors and Textures", category: "Education", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a" },
              { title: "How to Care for Your Crystal Jewelry", category: "Care", img: "https://images.unsplash.com/photo-1573408301145-b98c4af01077" }
            ].map((article, idx) => (
              <Link href="/about" key={idx} className="group block">
                <div className="relative aspect-[4/3] bg-secondary mb-6 overflow-hidden">
                  <Image src={article.img} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold mb-2 block">{article.category}</span>
                <h3 className="text-lg font-[family-name:var(--font-cinzel)] text-primary group-hover:text-accent transition-colors leading-snug">{article.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
