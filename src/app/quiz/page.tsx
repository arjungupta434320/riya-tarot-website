"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/store/useStore";

const questions = [
  {
    id: 1,
    title: "What are you seeking to invite into your life right now?",
    options: [
      { text: "Love & Deep Connections", category: "Love" },
      { text: "Financial Growth & Success", category: "Abundance" },
      { text: "Inner Peace & Stress Relief", category: "Calm" },
      { text: "Grounding & Energy Shielding", category: "Protection" },
      { text: "Self-Belief & Empowerment", category: "Confidence" },
      { text: "Mental Clarity & Motivation", category: "Focus" }
    ]
  },
  {
    id: 2,
    title: "Which element do you feel most drawn to today?",
    options: [
      { text: "Earth (Stability & Growth)" },
      { text: "Water (Flow & Emotion)" },
      { text: "Fire (Passion & Action)" },
      { text: "Air (Clarity & Spirit)" }
    ]
  },
  {
    id: 3,
    title: "If you could close your eyes and be anywhere, where would you be?",
    options: [
      { text: "A quiet, lush forest" },
      { text: "Listening to the ocean waves" },
      { text: "Sitting by a warm, crackling fire" },
      { text: "On a mountain top with a clear sky" }
    ]
  }
];

export default function CrystalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<Product | null>(null);
  const [error, setError] = useState(false);

  const handleSelectOption = (option: any) => {
    const newAnswers = { ...answers, [currentQuestion]: option.category || option.text };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 400); // slight delay for visual feedback
    } else {
      analyzeResults(newAnswers);
    }
  };

  const analyzeResults = async (finalAnswers: Record<number, string>) => {
    setIsAnalyzing(true);
    
    // The first question determines the category
    const targetCategory = finalAnswers[0] || "Calm";

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', targetCategory)
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Fake delay for "analyzing energy" effect
        setTimeout(() => {
          setRecommendation(data[0] as Product);
          setIsAnalyzing(false);
        }, 2000);
      } else {
        // Fallback if no product in that category
        const { data: fallbackData } = await supabase.from('products').select('*').limit(1);
        setTimeout(() => {
          setRecommendation((fallbackData?.[0] as Product) || null);
          setIsAnalyzing(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Quiz error", err);
      setError(true);
      setIsAnalyzing(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendation(null);
    setIsAnalyzing(false);
    setError(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-3xl">
        
        {!isAnalyzing && !recommendation && (
          <>
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto bg-primary text-secondary rounded-full flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h1 className="font-serif text-3xl md:text-5xl mb-4 text-primary">Crystal Finder Quiz</h1>
              <p className="text-primary/70 text-sm md:text-base max-w-lg mx-auto">
                Let your intuition guide you. Answer a few simple questions and we will reveal the crystal whose energy perfectly aligns with your current journey.
              </p>
            </div>

            <div className="bg-white border border-primary/10 p-8 md:p-12 shadow-sm">
              <div className="flex justify-between items-center mb-8 text-xs tracking-widest text-primary/40 uppercase">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                {currentQuestion > 0 && (
                  <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="hover:text-primary flex items-center gap-1">
                    <ArrowLeft size={12} /> Back
                  </button>
                )}
              </div>
              
              <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">
                {questions[currentQuestion].title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className="border border-primary/20 p-6 text-sm hover:bg-secondary hover:border-primary transition-all duration-300 text-center"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 border-t-2 border-primary border-solid rounded-full animate-spin mb-8"></div>
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-4 animate-pulse">Reading your energy...</h2>
            <p className="text-primary/60 font-light">Finding the perfect crystal for your intentions.</p>
          </div>
        )}

        {recommendation && !isAnalyzing && (
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-4 font-semibold">Your Perfect Match</h2>
            <h1 className="font-serif text-4xl md:text-5xl mb-8 text-primary">The Universe Chose...</h1>
            
            <div className="bg-white border border-primary/10 p-6 md:p-10 shadow-lg max-w-2xl mx-auto flex flex-col md:flex-row gap-8 text-left items-center">
              <div className="w-full md:w-1/2 aspect-square relative bg-secondary">
                <Image 
                  src={recommendation.image || "https://images.unsplash.com/photo-1598046125712-4299b9eb2491"} 
                  alt={recommendation.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h3 className="font-serif text-2xl mb-2">{recommendation.name}</h3>
                <p className="text-xl text-primary mb-4">₹{(recommendation.salePrice || recommendation.price).toLocaleString('en-IN')}</p>
                <div className="w-8 h-px bg-primary/20 mb-4"></div>
                <p className="text-sm font-light leading-relaxed text-primary/80 mb-6 line-clamp-4">
                  {recommendation.description}
                </p>
                
                <div className="flex flex-col gap-3">
                  <Link 
                    href={`/product?id=${recommendation.id}`}
                    className="w-full bg-primary text-secondary text-center text-xs tracking-widest uppercase py-4 hover:bg-accent transition-colors block"
                  >
                    View Your Crystal
                  </Link>
                  <button 
                    onClick={resetQuiz}
                    className="w-full border border-primary/20 text-primary text-center text-xs tracking-widest uppercase py-4 hover:bg-secondary transition-colors"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-red-500 mb-6">Our connection was interrupted. Please try again.</p>
            <button onClick={resetQuiz} className="bg-primary text-white px-8 py-3 text-sm">Restart Quiz</button>
          </div>
        )}

      </div>
    </div>
  );
}
