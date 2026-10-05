"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [discountInput, setDiscountInput] = useState("");
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  const subtotal = cart.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0);
  const discountAmount = discountCode === "WELCOME20" ? subtotal * 0.20 : 0;
  const onlineDiscountAmount = paymentMethod === 'online' ? subtotal * 0.05 : 0;
  const finalTotal = subtotal - discountAmount - onlineDiscountAmount;

  const handleApplyDiscount = () => {
    if (discountInput.trim().toUpperCase() === "WELCOME20") {
      setDiscountCode("WELCOME20");
      setDiscountError("");
    } else {
      setDiscountError("Invalid discount code");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setLoading(true);
    setError(null);

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.pincode}`;

    if (paymentMethod === 'cod') {
      try {
        const { error: submitError } = await supabase
          .from('orders')
          .insert({
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            shipping_address: fullAddress,
            total_amount: finalTotal,
            items: cart,
            status: 'pending_cod'
          });
        
        if (submitError) throw submitError;
        setSuccess(true);
        clearCart();
      } catch (err) {
        setError("Error recording order. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const isSdkLoaded = await loadRazorpay();
    if (!isSdkLoaded) {
      setError("Payment gateway failed to load. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Razorpay order via Cloudflare function
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal })
      });
      
      const orderData = await orderRes.json();
      if (!orderData.id) throw new Error("Failed to initialize payment");

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.key_id, 
        amount: orderData.amount, 
        currency: orderData.currency,
        name: "Riya Tarot Crystals",
        description: "Premium Spiritual Jewelry",
        order_id: orderData.id, 
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch("/api/razorpay/verify", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
               // 4. Save confirmed order to Supabase
               const { error: submitError } = await supabase
                 .from('orders')
                 .insert({
                   customer_name: formData.name,
                   customer_email: formData.email,
                   customer_phone: formData.phone,
                   shipping_address: fullAddress,
                   total_amount: finalTotal,
                   items: cart,
                   status: 'paid'
                 });
                 
               if (submitError) throw submitError;
               
               setSuccess(true);
               clearCart();
            } else {
               setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setError("Error recording order. Please contact support.");
          }
        },
        prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
        },
        theme: {
            color: "#4f4136" // our primary brand color
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description);
      });
      rzp.open();
      
    } catch (err: any) {
       console.error(err);
       setError("Something went wrong. Please try again.");
    } finally {
       setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center bg-background">
        <CheckCircle className="text-green-600 mb-6" size={64} />
        <h1 className="font-serif text-3xl md:text-4xl mb-4 text-center">Order Received!</h1>
        <p className="text-primary/70 text-center max-w-md mb-8 leading-relaxed">
          Thank you, {formData.name}. We have successfully received your order. You can track your shipment status at any time using your email address on the <Link href="/track" className="underline hover:text-primary">Track Order</Link> page.
        </p>
        <Link href="/" className="px-8 py-3 bg-primary text-secondary tracking-[0.2em] uppercase text-xs hover:bg-accent transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl mb-12">Checkout</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-primary/60 mb-6">Your bag is empty.</p>
            <Link href="/shop" className="px-8 py-3 bg-primary text-secondary tracking-[0.2em] uppercase text-xs hover:bg-accent transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left Column - Form */}
            <div className="flex-grow lg:w-3/5">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div>
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="Email address" 
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="Phone number" 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Full name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                    <textarea 
                      name="address"
                      required
                      placeholder="Complete address (House No, Street, Landmark)" 
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        name="city"
                        required
                        placeholder="City" 
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                      <input 
                        type="text" 
                        name="pincode"
                        required
                        placeholder="PIN Code" 
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <label className={`block border ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-primary/20'} p-4 cursor-pointer transition-colors`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-primary" />
                          <span className="font-medium text-primary">Pay Online (Razorpay)</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest bg-[#b85c38] text-white px-2 py-1 rounded-sm">Extra 5% Off</span>
                      </div>
                      <p className="text-xs text-primary/60 mt-2 ml-7">Securely pay using UPI, Cards, or Netbanking.</p>
                    </label>

                    <label className={`block border ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-primary/20'} p-4 cursor-pointer transition-colors`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-primary" />
                        <span className="font-medium text-primary">Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-primary/60 mt-2 ml-7">Pay when your order is delivered to your doorstep.</p>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-primary text-secondary text-sm tracking-[0.2em] uppercase hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : (paymentMethod === 'cod' ? "Confirm COD Order" : "Proceed to Payment")}
                </button>
                <p className="text-xs text-primary/40 text-center mt-4">
                  {paymentMethod === 'cod' ? "You will pay upon delivery." : "You will be redirected to securely complete your payment."}
                </p>

              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-2/5">
              <div className="bg-secondary/30 p-6 md:p-8 rounded-sm sticky top-32">
                <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-secondary flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-secondary text-[10px] flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-grow flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest">{item.name}</span>
                        <span className="text-sm">₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-primary/10 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm text-primary/60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-[#b85c38]">
                      <span>Discount (WELCOME20)</span>
                      <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {onlineDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-[#b85c38]">
                      <span>Online Payment Offer (5%)</span>
                      <span>- ₹{onlineDiscountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-primary/60">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-4 pb-6 border-b mb-6">
                  <p className="text-xs uppercase tracking-widest text-primary/60 mb-2">Discount Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      placeholder="Enter code" 
                      className="flex-grow min-w-0 bg-transparent border border-primary/20 px-3 py-2 text-sm focus:outline-none focus:border-primary uppercase"
                      disabled={!!discountCode}
                    />
                    <button 
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={!!discountCode}
                      className="px-4 flex-shrink-0 bg-primary text-secondary text-xs uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {discountCode ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {discountError && <p className="text-red-500 text-xs mt-2">{discountError}</p>}
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-sm font-semibold uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <span className="text-xs text-primary/40 block">INR</span>
                    <span className="text-2xl font-medium">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
