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
  const [showStickyAdd, setShowStickyAdd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyAdd(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const galleryImages = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];
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
    <div className="pt-4 md:pt-8 pb-12 bg-background">
      
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
            
            {/* Removed description */}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.shortIntention.split(" • ").map(tag => (
                <span key={tag} className="text-xs tracking-widest uppercase border border-primary/10 px-3 py-1 bg-primary/5">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full h-px bg-primary/10 mb-8"></div>
            
            {/* Low Stock Indicator */}
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-[#b85c38]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b85c38] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b85c38]"></span>
              </span>
              Only {Math.max(2, (product.name.length % 5) + 2)} left in stock - order soon
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8 relative z-10">
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
                  Add To Bag
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

            <div className="flex gap-6 text-sm text-primary/60 mb-8">
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

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 border border-primary/10 p-4 bg-secondary/30">
              <div className="flex flex-col items-center text-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span className="text-[10px] tracking-wider uppercase text-primary/70">100% Natural<br/>Stones</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                <span className="text-[10px] tracking-wider uppercase text-primary/70">Ethically<br/>Sourced</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span className="text-[10px] tracking-wider uppercase text-primary/70">Secure<br/>Checkout</span>
              </div>
            </div>

            {/* Frequently Bought Together */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 border border-primary/20 p-5 bg-secondary/10">
                <h3 className="text-sm font-serif tracking-widest uppercase mb-4 text-primary">Frequently Bought Together</h3>
                <div className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 bg-secondary flex-shrink-0">
                    <Image src={product.image} fill className="object-cover" alt={product.name} />
                  </div>
                  <Plus size={16} className="text-primary/40 flex-shrink-0" />
                  <div className="relative w-16 h-16 bg-secondary flex-shrink-0">
                    <Image src={relatedProducts[0].image} fill className="object-cover" alt={relatedProducts[0].name} />
                  </div>
                  <div className="flex-grow flex flex-col items-end">
                    <span className="text-xs text-primary/60 mb-1">Bundle Price:</span>
                    <span className="text-lg font-medium text-primary">
                      ₹{Math.round(((product.salePrice || product.price) + (relatedProducts[0].salePrice || relatedProducts[0].price)) * 0.9).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-accent font-semibold uppercase mt-0.5 border border-accent/20 px-2 py-0.5 bg-accent/5">Save 10%</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    addToCart(product, 1);
                    addToCart(relatedProducts[0], 1);
                    useStore.setState({ isCartOpen: true });
                  }}
                  className="w-full mt-5 bg-primary text-secondary text-xs tracking-widest uppercase py-3 hover:bg-accent transition-colors"
                >
                  Add Both To Bag
                </button>
              </div>
            )}

            {/* Accordions */}
            <div className="mt-12 flex flex-col border-t border-primary/10">
              {['Description', 'Frequently Asked Questions'].map((tab) => (
                <div key={tab} className="border-b border-primary/10">
                  <button 
                    onClick={() => setActiveTab(activeTab === tab ? "" : tab)}
                    className="w-full py-5 flex justify-between items-center text-sm tracking-widest uppercase hover:text-accent transition-colors"
                  >
                    {tab}
                    {activeTab === tab ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                  {activeTab === tab && tab === 'Description' && (
                    <div className="pb-8 text-sm font-light text-primary/80 leading-relaxed space-y-8">
                      {/* About the stone */}
                      <div>
                        <h3 className="text-primary tracking-widest uppercase text-xs font-semibold mb-3">About the Stone</h3>
                        <p>{product.description}</p>
                        <p className="text-xs italic opacity-70 mt-2">Note: The properties discussed here are traditionally associated with spiritual practices and crystal healing. They are not scientifically proven to cure or treat any medical conditions.</p>
                      </div>
                      
                      {/* How to wear */}
                      <div>
                        <h3 className="text-primary tracking-widest uppercase text-xs font-semibold mb-3">How to Wear</h3>
                        <p>To maximize the benefits of your <strong>{product.name}</strong>, wear it on your <strong>left hand</strong> (the receiving side) to absorb its healing energy and invite its intentions into your life. Wear it on your <strong>right hand</strong> (the giving side) to project its energy outward and release blockages. You can wear it daily, but remember to consciously set your intention each morning when you put it on.</p>
                      </div>
                      
                      {/* Care guide */}
                      <div>
                        <h3 className="text-primary tracking-widest uppercase text-xs font-semibold mb-3">Care Guide</h3>
                        <p className="mb-2">Crystals are natural minerals and require gentle care to maintain their beauty and energetic charge.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Keep your bracelet away from water, perfumes, lotions, and harsh chemicals to preserve both the elastic cord and the stone's natural polish.</li>
                          <li>Cleanse its energy periodically by resting it on a Selenite charging plate, leaving it under the light of the full moon, or smudging it with sage.</li>
                          <li>When not wearing, store it safely in the provided Riya Tarot pouch to prevent scratches and physical damage.</li>
                        </ul>
                      </div>
                      
                      {/* Our energizing ritual */}
                      <div>
                        <h3 className="text-primary tracking-widest uppercase text-xs font-semibold mb-3">Our Energizing Ritual</h3>
                        <p>At Riya Tarot Crystals, we believe in the profound power of energetic purity. Before your <strong>{product.name}</strong> is packed, it undergoes a sacred cleansing and energizing ritual. We use high-vibration sound frequencies, selenite charging plates, and herbal smoke to clear any stagnant energies it may have absorbed during its journey from the earth. This meticulous process ensures that when your bracelet arrives, it is a pure, vibrant canvas, ready to align entirely with your unique personal intentions.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === tab && tab === 'Frequently Asked Questions' && (
                    <div className="pb-8 text-sm font-light text-primary/80 leading-relaxed space-y-4">
                      <div>
                        <strong className="block text-primary mb-1">How do I know this crystal is authentic?</strong>
                        All our crystals are ethically sourced, 100% natural, and meticulously verified. We do not sell dyed, heated, or synthetic glass stones.
                      </div>
                      <div>
                        <strong className="block text-primary mb-1">How long does shipping take?</strong>
                        Orders are processed and energized within 1-2 business days. Standard delivery usually takes 3-5 business days across India.
                      </div>
                      <div>
                        <strong className="block text-primary mb-1">Can I return my bracelet?</strong>
                        We accept returns only if you provide a continuous, unedited unboxing video showing the original seal being broken. See our Returns policy for full details.
                      </div>
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
                  
                  <div className="flex gap-4 items-center mb-4">
                    <button 
                      type="button" 
                      onClick={() => alert("Photo upload activated! (Preview mode)")}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/60 border border-primary/20 px-4 py-2 hover:bg-secondary transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      Add Photos
                    </button>
                    <span className="text-xs text-primary/40 italic">Customers love seeing real photos!</span>
                  </div>

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
                          <p className="font-semibold text-sm flex items-center gap-2">
                            {review.author_name}
                            <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 border border-green-200 flex items-center gap-1 tracking-widest uppercase">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                              Verified Buyer
                            </span>
                          </p>
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
      
      {/* Sticky Mobile Add To Cart */}
      <AnimatePresence>
        {showStickyAdd && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-primary/10 p-4 md:hidden flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-widest uppercase">{product.name}</span>
              <span className="text-sm text-primary">₹{(product.salePrice || product.price).toLocaleString('en-IN')}</span>
            </div>
            <button 
              onClick={() => addToCart(product, 1)}
              className="bg-primary text-secondary px-6 py-3 text-xs tracking-widest uppercase"
            >
              Add To Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
