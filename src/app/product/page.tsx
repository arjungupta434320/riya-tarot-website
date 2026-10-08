"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, Product } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import { fetchProducts } from "@/data/products";
import { Star, Plus, Minus, ChevronLeft, ChevronRight, Gem, ShieldCheck, HeartHandshake, PackageCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { addToCart } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [reviewStatus, setReviewStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [showStickyAdd, setShowStickyAdd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyAdd(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProducts().then(products => {
      setAllProducts(products);
      const found = products.find(p => p.id === id);
      if (found) setProduct(found);
    });
  }, [id]);

  useEffect(() => {
    if (product) fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    if (!product) return;
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setReviewStatus('submitting');
    
    const { error } = await supabase.from('reviews').insert({
      product_id: product.id,
      author_name: reviewForm.name,
      rating: reviewForm.rating,
      review_text: reviewForm.text,
      is_approved: true
    });

    if (error) {
      setReviewStatus('error');
    } else {
      setReviewStatus('success');
      setReviewForm({ name: '', rating: 5, text: '' });
      fetchReviews();
    }
  };

  if (!product) {
    return <div className="min-h-screen pt-32 pb-24 flex items-center justify-center font-[family-name:var(--font-cinzel)] text-xl text-primary">Loading product...</div>;
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const displayImage = selectedImage || product.image;
  const galleryImages = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];
  const currentIndex = galleryImages.indexOf(displayImage);

  const paginate = (newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = galleryImages.length - 1;
    if (nextIndex >= galleryImages.length) nextIndex = 0;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  if (relatedProducts.length < 4) {
    relatedProducts.push(...allProducts.filter(p => p.id !== product.id && !relatedProducts.includes(p)).slice(0, 4 - relatedProducts.length));
  }

  return (
    <div className="pt-24 md:pt-32 pb-24 bg-background text-primary">
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Images - Left */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 sticky top-32 self-start">
            <div className="relative aspect-[4/5] bg-secondary w-full overflow-hidden group border border-border">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={displayImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image src={displayImage} alt={product.name} fill priority className="object-cover" />
                </motion.div>
              </AnimatePresence>

              {galleryImages.length > 1 && (
                <>
                  <button onClick={() => paginate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-border flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10">
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => paginate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-border flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10">
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square overflow-hidden border transition-all ${img === displayImage ? 'border-primary' : 'border-transparent hover:border-primary/30 opacity-70 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details - Right */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-primary">{product.name}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] mb-3 tracking-wide">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-accent">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= parseFloat(averageRating) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-[11px] text-muted tracking-widest uppercase">{averageRating} ({reviews.length > 0 ? reviews.length : 12} Reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              {product.salePrice && (
                <span className="text-lg text-muted line-through font-light">₹{product.price.toLocaleString('en-IN')}</span>
              )}
              <span className="text-2xl md:text-3xl font-medium">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
            </div>

            <p className="text-sm font-light text-primary/80 leading-relaxed mb-8 max-w-lg">
              {product.description}
            </p>

            <div className="h-px w-full bg-border mb-8"></div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] tracking-widest uppercase font-semibold">Bracelet Size</span>
                <span className="text-[10px] tracking-widest text-muted underline cursor-pointer">Size Guide</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["S (16cm)", "M (17cm)", "L (18cm)"].map(size => (
                  <button key={size} className={`border py-3 text-xs tracking-widest ${size === "M (17cm)" ? 'border-primary bg-primary/5' : 'border-border text-muted hover:border-primary/50'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-primary/20 w-32">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 py-4 hover:bg-secondary transition-colors flex justify-center text-primary/60 hover:text-primary"><Minus size={16} /></button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex-1 py-4 hover:bg-secondary transition-colors flex justify-center text-primary/60 hover:text-primary"><Plus size={16} /></button>
              </div>
              
              <button 
                onClick={(e) => {
                  import("@/lib/animations").then(m => m.flyToCart(e, product.image));
                  addToCart(product, quantity);
                }}
                className="flex-1 bg-primary text-background text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
              >
                Add To Cart
              </button>
            </div>

            <button 
              onClick={() => {
                addToCart(product, quantity);
                router.push('/checkout');
              }}
              className="w-full border border-primary bg-transparent text-primary text-[11px] font-medium tracking-[0.2em] uppercase py-4 mb-4 hover:bg-primary hover:text-background transition-colors"
            >
              Buy It Now
            </button>

            <a 
              href={`https://wa.me/917889001587?text=${encodeURIComponent(`Hi! I'm interested in the ${product.name} (₹${product.salePrice || product.price}). Can you tell me more about it?`)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-full bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 text-[11px] font-medium tracking-[0.2em] uppercase py-4 text-center hover:bg-[#25D366]/20 transition-colors flex justify-center items-center gap-2"
            >
              Chat With Us on WhatsApp
            </a>

            <div className="mt-12 space-y-12">
              
              {/* WHY YOU'LL LOVE IT */}
              <div>
                <h3 className="text-xs tracking-[0.15em] uppercase font-semibold mb-6 pb-2 border-b border-border">Why You'll Love It</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Gem, title: "Natural Gemstones", desc: "Authentic, ethically sourced crystals." },
                    { icon: HeartHandshake, title: "Comfortable Wear", desc: "Designed for everyday durability." },
                    { icon: ShieldCheck, title: "Carefully Selected", desc: "Hand-picked for energy and aesthetics." },
                    { icon: PackageCheck, title: "Beautifully Finished", desc: "Premium craftsmanship in every detail." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start bg-secondary/30 p-4 border border-border">
                      <item.icon size={16} strokeWidth={1.5} className="text-accent mt-0.5" />
                      <div>
                        <h4 className="text-[11px] font-semibold tracking-widest uppercase mb-1">{item.title}</h4>
                        <p className="text-[10px] text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRYSTAL DETAILS */}
              <div>
                <h3 className="text-xs tracking-[0.15em] uppercase font-semibold mb-6 pb-2 border-b border-border">Crystal Details</h3>
                <ul className="text-sm font-light text-primary/80 space-y-3">
                  <li className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted">Primary Crystal</span>
                    <span>{product.name.replace(' Bracelet', '')}</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted">Bead Size</span>
                    <span>8mm (Standard)</span>
                  </li>
                  <li className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted">Bracelet Style</span>
                    <span>Stretch cord, seamless fit</span>
                  </li>
                </ul>
              </div>

              {/* TRADITIONAL ASSOCIATIONS */}
              <div>
                <h3 className="text-xs tracking-[0.15em] uppercase font-semibold mb-6 pb-2 border-b border-border">Traditional Associations</h3>
                <p className="text-sm font-light leading-relaxed text-primary/80">
                  Traditionally associated with {product.shortIntention?.toLowerCase() || 'positive energy and balance'}. Crystals have been used for centuries across various cultures as touchstones for personal intentions, meditation, and grounding rituals.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="container mx-auto px-6 max-w-5xl mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-[family-name:var(--font-cinzel)] mb-4">LOVED BY OUR COMMUNITY</h2>
          <div className="flex justify-center text-accent mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <p className="text-muted text-sm font-light">Based on {reviews.length > 0 ? reviews.length : 12} reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reviews.length > 0 ? (
            reviews.slice(0, 4).map(review => (
              <div key={review.id} className="bg-secondary/20 p-8 border border-border">
                <div className="flex items-center gap-1 text-accent mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <h4 className="text-[11px] font-semibold tracking-widest uppercase mb-4">{review.author_name} <span className="text-[#25D366] ml-2 text-[9px]">Verified Buyer</span></h4>
                <p className="text-sm font-light text-primary/80 leading-relaxed italic">"{review.review_text}"</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-muted font-light p-12 bg-secondary/20 border border-border">
              "This bracelet has a beautiful calming energy. The packaging was so premium!" <br/><br/>
              <span className="text-[10px] tracking-widest uppercase font-semibold">— Priya M. (Verified Buyer)</span>
            </div>
          )}
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div className="container mx-auto px-6 max-w-7xl mt-32">
        <h2 className="text-2xl font-[family-name:var(--font-cinzel)] text-center mb-12 border-b border-border pb-6">YOU MAY ALSO LIKE</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {relatedProducts.map(p => (
            <div key={p.id} className="group">
              <div className="relative aspect-square mb-4 bg-secondary overflow-hidden">
                <Link href={`/product?id=${p.id}`}>
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </Link>
              </div>
              <h3 className="text-[11px] tracking-widest uppercase font-semibold mb-1 text-center">
                <Link href={`/product?id=${p.id}`} className="hover:text-accent transition-colors">{p.name}</Link>
              </h3>
              <p className="text-[12px] text-center text-primary">₹{(p.salePrice || p.price).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <AnimatePresence>
        {showStickyAdd && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[80]"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-semibold tracking-widest uppercase truncate max-w-[200px]">{product.name}</h4>
              <span className="text-sm font-medium">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  import("@/lib/animations").then(m => m.flyToCart(e, product.image));
                  addToCart(product, quantity);
                }}
                className="flex-1 bg-background border border-primary text-primary text-[10px] tracking-widest uppercase py-3 font-medium"
              >
                Add To Bag
              </button>
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  router.push('/checkout');
                }}
                className="flex-1 bg-primary text-background text-[10px] tracking-widest uppercase py-3 font-medium"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-24 bg-background flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-t-2 border-primary border-solid rounded-full"></div>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
}
