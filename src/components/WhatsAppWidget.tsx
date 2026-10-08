"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  const whatsappNumber = "7889001587"; 

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      const hasSeenWidget = localStorage.getItem("hasSeenChatWidget");
      if (!hasSeenWidget) {
        setIsOpen(true);
        localStorage.setItem("hasSeenChatWidget", "true");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl mb-4 w-[320px] overflow-hidden flex flex-col origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white flex justify-between items-center shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight">Riya Tarot Support</h3>
                  <p className="text-[11px] opacity-90 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Typically replies instantly
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              className="p-5 h-64 overflow-y-auto flex flex-col gap-4 relative"
              style={{
                backgroundColor: '#E5DDD5',
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundSize: 'cover'
              }}
            >
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm text-[13px] text-gray-800 max-w-[85%] relative self-start leading-relaxed">
                Hi there! 👋<br/><br/>Welcome to Riya Tarot Crystals.<br/>How can we help you find the perfect crystal today?
                <span className="text-[9px] text-gray-400 absolute bottom-1 right-2">Just now</span>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#f0f0f0] flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-grow bg-white rounded-full px-4 py-2.5 text-[14px] focus:outline-none shadow-sm text-gray-800"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-sm"
              >
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50 relative group"
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
          <div className="absolute right-full mr-4 bg-white text-primary text-xs py-2 px-3 rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            Chat with us!
            {/* Triangle pointer */}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
          </div>
        )}
      </button>
    </div>
  );
}
