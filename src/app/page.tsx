"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { products } from "@/data/products";
import { ArrowRight, Star, ShieldCheck, Gift, Lock } from "lucide-react";
import { useStore } from "@/store/useStore";

const trustFeatures = [
  { icon: ShieldCheck, title: "HAND-FINISHED", desc: "Carefully presented crystal jewelry." },
  { icon: Star, title: "INTENTION PREPARED", desc: "Prepared as part of our spiritual ritual experience." },
  { icon: Gift, title: "GIFT READY", desc: "Elegant packaging for meaningful gifting." },
  { icon: Lock, title: "SECURE SHOPPING", desc: "Simple and secure online checkout." },
];

const intentions = [
  { name: "LOVE", image: "/images/products/love-attraction-main.jpg" },
  { name: "ABUNDANCE", image: "/images/products/dhan-yog-main.jpg" },
  { name: "CALM", image: "/images/products/turquoise-main.jpg" },
  { name: "PROTECTION", image: "/images/products/red-carnelian-main.jpg" },
  { name: "CONFIDENCE", image: "/images/products/tiger-eye-main.jpg" },
  { name: "FOCUS", image: "/images/products/citrine-main.jpg" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const { addToCart } = useStore();

  return (
    <div className="bg-background text-primary overflow-hidden">
      


      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[90vh] md:h-screen w-full bg-primary flex items-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
          {/* I will use the generated hero image here */}
          <div className="absolute inset-0 bg-[url('/images/hero_background.jpg')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="max-w-2xl text-secondary">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8"
            >
              RIYA TAROT<br className="hidden sm:block"/>
              <span className="text-accent italic">CRYSTALS</span>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link href="/shop" className="px-8 py-4 bg-accent text-primary text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold hover:bg-secondary transition-colors text-center magnetic-button w-full sm:w-auto">
                Shop Bracelets
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
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer block relative overflow-hidden aspect-square bg-secondary"
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
            {products.slice(0, 6).map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-center group"
              >
                <div className="relative aspect-square mb-6 bg-secondary overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-primary text-secondary text-xs tracking-widest py-3 uppercase hover:bg-accent transition-colors"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm tracking-widest uppercase font-semibold mb-1 hover:text-accent transition-colors cursor-pointer">
                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-xs text-primary/60 font-light mb-2 h-4 truncate">{product.shortIntention}</p>
                  <p className="text-sm font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE RITUAL */}
      <section id="ritual" className="py-16 md:py-24 bg-primary text-secondary">
        <div className="container mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-px bg-secondary/20"></div>

            {[
              { num: "01", title: "SELECT", desc: "Choose the bracelet that resonates with your intention." },
              { num: "02", title: "PREPARE", desc: "Your bracelet is prepared with care as part of our spiritual ritual." },
              { num: "03", title: "INTEND", desc: "Take a moment to set a personal intention when you receive it." },
              { num: "04", title: "WEAR", desc: "Make it part of your everyday ritual and personal style." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.2 }}
                className="text-center relative z-10"
              >
                <div className="w-24 h-24 mx-auto rounded-full border border-secondary/20 flex items-center justify-center bg-primary mb-6">
                  <span className="font-serif text-3xl text-accent">{step.num}</span>
                </div>
                <h3 className="text-sm tracking-widest uppercase mb-3">{step.title}</h3>
                <p className="text-sm text-secondary/70 font-light px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-lg font-light text-primary/80 mb-10 leading-relaxed">
            We believe in the power of intention. Our premium crystal bracelets are hand-selected not just for their natural beauty, but to serve as a daily reminder of what you are calling into your life. Through mindful gifting and personal rituals, we bring traditional symbolism into contemporary everyday style.
          </p>
          <Link href="/about" className="inline-block border-b border-primary pb-1 text-sm tracking-widest uppercase hover:text-accent hover:border-accent transition-colors">
            Discover Our Story
          </Link>
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
