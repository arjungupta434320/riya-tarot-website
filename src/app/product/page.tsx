"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, Product } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import { fetchProducts } from "@/data/products";
import { Star, Heart, Share2, Plus, Minus, ChevronDown, ArrowRight, ChevronLeft, ChevronRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { addToCart, wishlist, toggleWishlist } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [reviewStatus, setReviewStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  useEffect(() => {
    // Fetch all products
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
      is_approved: true // Auto-approve the review so it shows instantly
    });

    if (error) {
      setReviewStatus('error');
    } else {
      setReviewStatus('success');
      setReviewForm({ name: '', rating: 5, text: '' });
      fetchReviews(); // Refresh the list to show the new review instantly
    }
  };

  if (!product) {
    return <div className="min-h-screen pt-32 pb-24 flex items-center justify-center font-serif text-xl">Loading product...</div>;
  }



  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "5.0";


  const displayImage = selectedImage || product.image;
  const galleryImages = product.gallery || [product.image];
  const currentIndex = galleryImages.indexOf(displayImage);

  const paginate = (newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) nextIndex = galleryImages.length - 1;
    if (nextIndex >= galleryImages.length) nextIndex = 0;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  if (relatedProducts.length < 3) {
    relatedProducts.push(...allProducts.filter(p => p.id !== product.id && !relatedProducts.includes(p)).slice(0, 3 - relatedProducts.length));
  }

  return (
    <div className="pt-28 md:pt-32 pb-12 bg-background">
      
      {/* Product Top Section */}
      <div className="container mx-auto px-6">
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
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= Math.round(Number(averageRating)) ? "currentColor" : "none"} strokeWidth={i <= Math.round(Number(averageRating)) ? 0 : 1} />
                ))}
              </div>
              <a href="#reviews" className="text-xs text-primary/60 font-light underline decoration-primary/20 hover:decoration-primary cursor-pointer transition-colors">
                ({reviews.length} Reviews)
              </a>
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
              
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  useStore.setState({ isCartOpen: false });
                  router.push('/checkout');
                }}
                className="w-full border border-primary/20 text-primary text-sm tracking-widest uppercase py-4 hover:bg-secondary transition-colors magnetic-button"
              >
                Buy It Now
              </button>
            </div>

            <div className="flex gap-6 text-sm text-primary/60">
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center gap-2 transition-colors ${wishlist.includes(product.id) ? 'text-accent' : 'hover:text-primary'}`}
              >
                <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} /> 
                {wishlist.includes(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
              <button 
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: product.name,
                        text: `Check out this ${product.name} at Riya Tarot Crystals!`,
                        url: window.location.href,
                      });
                    } catch (err) {
                      console.log('Error sharing:', err);
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
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

      {/* CUSTOMER REVIEWS */}
      <section id="reviews" className="py-24 bg-white border-t border-primary/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-16">
            
            {/* Reviews Summary */}
            <div className="md:w-1/3">
              <h2 className="font-serif text-3xl mb-4">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-light">{averageRating}</span>
                <div>
                  <div className="flex text-accent mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={16} fill={i <= Math.round(Number(averageRating)) ? "currentColor" : "none"} strokeWidth={i <= Math.round(Number(averageRating)) ? 0 : 1} />
                    ))}
                  </div>
                  <span className="text-xs text-primary/60 uppercase tracking-widest">Based on {reviews.length} reviews</span>
                </div>
              </div>
            </div>

            {/* Write a Review */}
            <div className="md:w-2/3">
              <h3 className="text-sm tracking-widest uppercase mb-6 font-semibold">Write a Review</h3>
              
              {reviewStatus === 'success' ? (
                <div className="p-6 bg-green-50 border border-green-200 text-green-800 rounded-sm">
                  <p className="font-semibold mb-2">Thank you for your review!</p>
                  <p className="text-sm">Your feedback has been published.</p>
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-light">Rating:</span>
                    <div className="flex gap-1 text-accent">
                      {[1,2,3,4,5].map(i => (
                        <button type="button" key={i} onClick={() => setReviewForm({...reviewForm, rating: i})}>
                          <Star size={20} fill={i <= reviewForm.rating ? "currentColor" : "none"} strokeWidth={i <= reviewForm.rating ? 0 : 1} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                  
                  <textarea 
                    placeholder="Share your experience with this bracelet..." 
                    required
                    rows={4}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                    className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                  />
                  
                  {reviewStatus === 'error' && <p className="text-red-500 text-sm">Failed to submit review. Please try again.</p>}
                  
                  <button 
                    type="submit" 
                    disabled={reviewStatus === 'submitting'}
                    className="px-8 py-3 bg-primary text-secondary tracking-[0.2em] uppercase text-xs hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {reviewStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-center text-primary/40 text-sm py-12 border-t border-primary/10">No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="border-t border-primary/10 pt-12 space-y-12">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-primary/5 pb-12 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary/40">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.author_name}</p>
                          <p className="text-xs text-primary/40">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-accent">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={12} fill={i <= review.rating ? "currentColor" : "none"} strokeWidth={i <= review.rating ? 0 : 1} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-primary/80 pl-13">
                      {review.review_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
                <Link href={`/product?id=${p.id}`} className="relative aspect-square mb-4 bg-secondary overflow-hidden block">
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
                    <Link href={`/product?id=${p.id}`}>{p.name}</Link>
                  </h3>
                  <div className="flex flex-col items-center gap-1.5 mt-auto">
                    <div className="flex items-center gap-2">
                      {p.salePrice && (
                        <span className="text-xs text-primary/40 line-through">₹{p.price.toLocaleString('en-IN')}</span>
                      )}
                      <span className="text-sm font-medium text-primary">₹{(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                    </div>
                    {p.salePrice && (
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
      </section>
      
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-24 flex items-center justify-center font-serif text-xl">Loading...</div>}>
      <ProductContent />
    </Suspense>
  );
}
