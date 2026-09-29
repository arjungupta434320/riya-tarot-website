"use client";

import { useStore } from "@/store/useStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } = useStore();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-warm-beige">
          <h2 className="font-serif tracking-widest text-lg">YOUR BAG</h2>
          <button onClick={toggleCart} className="hover:text-accent transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-primary/50 gap-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="font-light tracking-widest uppercase text-sm">Your bag is empty</p>
              <button 
                onClick={toggleCart}
                className="mt-4 px-8 py-3 bg-primary text-secondary text-xs tracking-[0.2em] uppercase hover:bg-accent transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-24 h-24 bg-secondary relative flex-shrink-0 overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs uppercase tracking-widest font-semibold pr-4">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-primary/40 hover:text-primary transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-primary/60 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-primary/20">
                        <button 
                          className="px-2 py-1 hover:bg-primary/5 transition-colors"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs w-6 text-center">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 hover:bg-primary/5 transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-secondary/50 border-t border-warm-beige">
            <div className="flex justify-between text-sm uppercase tracking-widest mb-4">
              <span>Subtotal</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-primary/60 mb-6 font-light">Shipping and taxes calculated at checkout.</p>
            <button className="w-full py-4 bg-primary text-secondary text-sm tracking-[0.2em] uppercase hover:bg-accent transition-colors magnetic-button">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
