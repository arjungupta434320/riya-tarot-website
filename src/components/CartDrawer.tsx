"use client";

import { useStore, Product } from "@/store/useStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/data/products";

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setAllProducts);
  }, []);

  const subtotal = cart.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const progressPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Recommendations: products not in cart
  const cartIds = cart.map(i => i.id);
  const recommendations = allProducts.filter(p => !cartIds.includes(p.id)).slice(0, 2);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60] transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-[family-name:var(--font-cinzel)] tracking-widest text-lg text-primary">YOUR CART</h2>
          <button onClick={toggleCart} className="text-primary hover:text-accent transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
              <ShoppingBag size={48} className="text-primary/20 mb-4" strokeWidth={1} />
              <p className="text-sm font-light text-primary/60 mb-6">Your cart is currently empty.</p>
              <button 
                onClick={() => { toggleCart(); router.push('/shop'); }}
                className="bg-primary text-background text-[11px] tracking-[0.2em] uppercase py-4 px-8 hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              <div className="p-6 bg-secondary/50 border-b border-border">
                <p className="text-[11px] tracking-widest uppercase text-center mb-3 text-primary font-medium">
                  {amountToFreeShipping > 0 
                    ? `You're ₹${amountToFreeShipping.toLocaleString('en-IN')} away from free shipping` 
                    : "✨ You've unlocked free shipping! ✨"}
                </p>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="p-6 flex flex-col gap-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-secondary relative overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/product?id=${item.id}`} onClick={toggleCart} className="text-xs font-semibold tracking-widest uppercase hover:text-accent transition-colors text-primary">
                          {item.name}
                        </Link>
                        <button onClick={() => removeFromCart(item.id)} className="text-primary/40 hover:text-primary transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-[11px] text-muted mb-auto">{item.shortIntention || "Handcrafted Bracelet"}</p>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-border">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1.5 text-primary hover:bg-secondary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs w-6 text-center text-primary">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-primary hover:bg-secondary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          ₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* You May Also Like */}
              {recommendations.length > 0 && (
                <div className="mt-auto border-t border-border bg-secondary/30 p-6">
                  <h3 className="text-[10px] tracking-[0.15em] uppercase font-semibold text-primary mb-4">You May Also Like</h3>
                  <div className="flex flex-col gap-4">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="flex gap-4 items-center bg-background p-3 border border-border">
                        <div className="w-16 h-16 bg-secondary relative">
                          <Image src={rec.image} alt={rec.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[11px] font-semibold tracking-widest uppercase text-primary truncate">{rec.name}</h4>
                          <p className="text-[11px] text-primary">₹{(rec.salePrice || rec.price).toLocaleString('en-IN')}</p>
                        </div>
                        <button 
                          onClick={() => {
                            const { addToCart } = useStore.getState();
                            addToCart(rec, 1);
                          }}
                          className="text-[10px] tracking-widest uppercase border-b border-primary text-primary hover:text-accent hover:border-accent transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 bg-background">
            <div className="flex justify-between items-center mb-4 text-primary">
              <span className="text-xs tracking-widest uppercase">Subtotal</span>
              <span className="text-lg font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-muted mb-4 text-center">Shipping & taxes calculated at checkout.</p>
            <button 
              onClick={() => { toggleCart(); router.push('/checkout'); }}
              className="w-full bg-primary text-background text-[11px] tracking-[0.2em] font-medium uppercase py-4 hover:bg-primary/90 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
