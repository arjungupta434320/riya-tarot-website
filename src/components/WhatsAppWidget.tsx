"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";

export default function WhatsAppWidget() {
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  return (
    <>
      {/* Invisible full-screen container to constrain dragging so it doesn't leave the screen */}
      <div ref={constraintsRef} className="fixed inset-4 pointer-events-none z-[60]" />
      
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          // Small delay to prevent accidental clicks when finishing a drag
          setTimeout(() => setIsDragging(false), 150);
        }}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        className="fixed bottom-6 right-6 z-[60] flex items-center justify-center group cursor-grab"
        style={{ touchAction: "none" }}
      >
        <Link 
          href="https://wa.me/7889001587" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => {
            if (isDragging) e.preventDefault();
          }}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center pointer-events-auto"
          aria-label="Chat on WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-4 bg-white text-primary text-xs font-semibold py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md whitespace-nowrap">
            Drag to move
          </span>
        </Link>
      </motion.div>
    </>
  );
}
