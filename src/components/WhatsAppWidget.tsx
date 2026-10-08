"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

// --- CONFIGURATION ---
const WHATSAPP_NUMBER = "917889001587";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);
  
  const widgetRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  // Handle mounting and product detection
  useEffect(() => {
    setMounted(true);
    
    // Attempt to read product name if on product page
    if (pathname?.includes('/product')) {
      // Find the main H1 which usually contains the product name on our product page
      const h1 = document.querySelector('h1');
      if (h1 && h1.innerText) {
        setProductName(h1.innerText);
      }
    } else {
      setProductName(null);
    }
  }, [pathname, searchParams]);

  // Handle Click Outside & Escape Key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  if (!mounted) return null;

  // Animation settings honoring prefers-reduced-motion
  const animDuration = prefersReducedMotion ? 0 : 0.3;
  const initialScale = prefersReducedMotion ? 1 : 0.95;
  const initialY = prefersReducedMotion ? 0 : 20;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-5 md:right-5 z-[99999] flex flex-col items-end" ref={widgetRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: initialY, scale: initialScale }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: initialY, scale: initialScale }}
            transition={{ duration: animDuration, ease: "easeOut" }}
            className="bg-[#FAFAFA] border border-primary/10 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-2xl mb-4 w-[90vw] max-w-[380px] overflow-hidden flex flex-col origin-bottom-right"
            role="dialog"
            aria-label="WhatsApp Support Chat"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white flex justify-between items-center shadow-sm relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide">Riya Tarot Crystals</h3>
                  <p className="text-[11px] opacity-90 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Typically replies quickly
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close chatbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Welcome Message Box */}
            <div className="p-5 bg-white border-b border-primary/5">
              <div className="bg-[#F5F5F5] p-4 rounded-xl rounded-tl-none shadow-sm text-[13px] text-primary/80 max-w-[90%] relative leading-relaxed">
                <p className="font-semibold text-primary mb-1">Hi! Welcome to Riya Tarot Crystals.</p>
                <p className="mb-3">Need help choosing the right crystal bracelet? We're happy to help.</p>
                <p className="font-medium text-primary">How can we help you today?</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="p-4 flex flex-col gap-2.5 bg-white">
              <button
                onClick={() => openWhatsApp("Hi Riya Tarot Crystals! I need help choosing the best crystal bracelet for my intention. Can you recommend one for me?")}
                className="w-full text-left bg-white border border-primary/15 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors p-3.5 rounded-xl text-[13px] font-medium text-primary flex items-center justify-between group"
              >
                Help me choose a crystal
                <ChevronRight size={16} className="text-primary/40 group-hover:text-[#25D366] transition-colors" />
              </button>
              
              <button
                onClick={() => {
                  const msg = productName 
                    ? `Hi Riya Tarot Crystals! I'm interested in the ${productName} and would like to know more about it.`
                    : "Hi Riya Tarot Crystals! I have a question about one of your crystal bracelets. Can you please help me?";
                  openWhatsApp(msg);
                }}
                className="w-full text-left bg-white border border-primary/15 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors p-3.5 rounded-xl text-[13px] font-medium text-primary flex items-center justify-between group"
              >
                Question about a bracelet
                <ChevronRight size={16} className="text-primary/40 group-hover:text-[#25D366] transition-colors" />
              </button>
              
              <button
                onClick={() => openWhatsApp("Hi Riya Tarot Crystals! I would like to know more about placing an order for a crystal bracelet.")}
                className="w-full text-left bg-white border border-primary/15 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors p-3.5 rounded-xl text-[13px] font-medium text-primary flex items-center justify-between group"
              >
                I want to place an order
                <ChevronRight size={16} className="text-primary/40 group-hover:text-[#25D366] transition-colors" />
              </button>
              
              <button
                onClick={() => openWhatsApp("Hi Riya Tarot Crystals! I visited your website and would like to speak with someone about crystal bracelets.")}
                className="w-full text-left bg-white border border-primary/15 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors p-3.5 rounded-xl text-[13px] font-medium text-primary flex items-center justify-between group"
              >
                Talk to us on WhatsApp
                <ChevronRight size={16} className="text-primary/40 group-hover:text-[#25D366] transition-colors" />
              </button>
            </div>

            {/* Footer */}
            <div className="bg-[#FAFAFA] p-4 text-center border-t border-primary/5">
              <p className="text-[11px] text-primary/60 mb-2">Need help finding your perfect crystal?</p>
              <button
                onClick={() => openWhatsApp("Hi Riya Tarot Crystals! I visited your website and would like help choosing the right crystal bracelet for me.")}
                className="text-[12px] font-semibold text-[#25D366] hover:text-[#1da851] transition-colors inline-flex items-center gap-1"
              >
                Chat with us on WhatsApp &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Riya Tarot Crystals on WhatsApp"
        aria-expanded={isOpen}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.3)] flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50 relative group outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={30} />}
        
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="hidden md:block absolute right-full mr-4 bg-white text-primary text-xs py-2 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            Chat with us
            {/* Triangle pointer */}
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-white"></div>
          </div>
        )}
      </button>
    </div>
  );
}
