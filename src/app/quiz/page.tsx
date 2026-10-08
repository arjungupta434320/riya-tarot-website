"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, useStore } from "@/store/useStore";

const questions = [
  {
    id: 1,
    title: "What do you need the most right now?",
    options: [
      { text: "Love & Healing", category: "Love" },
      { text: "Money & Success", category: "Abundance" },
      { text: "Peace & Calm", category: "Calm" },
      { text: "Protection & Boundaries", category: "Protection" }
    ]
  },
  {
    id: 2,
    title: "Which color calls out to your soul?",
    options: [
      { text: "Soft Pinks & Deep Reds" },
      { text: "Calming Blues & Greens" },
      { text: "Warm Yellows & Golds" },
      { text: "Protective Blacks & Browns" }
    ]
  },
  {
    id: 3,
    title: "How do you plan to use your crystals?",
    options: [
      { text: "Daily Wear (Jewelry)" },
      { text: "Meditation & Manifestation" },
      { text: "Placing in my Home/Office" },
      { text: "A Gift for someone special" }
    ]
  }
];

export default function CrystalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const addToCart = useStore((state) => state.addToCart);

  const handleSelectOption = (option: any) => {
    const newAnswers = { ...answers, [currentQuestion]: option.category || option.text };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 400);
    } else {
      analyzeResults(newAnswers);
    }
  };

  const analyzeResults = async (finalAnswers: Record<number, string>) => {
    setIsAnalyzing(true);
    
    // The first question determines the primary category
    const targetCategory = finalAnswers[0] || "Love";

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', targetCategory)
        .limit(2);
        
      if (error) throw error;
      
      let finalRecs = data as Product[];
      
      // If we didn't find 2 products, fallback and get any 2
      if (finalRecs.length < 2) {
        const { data: fallbackData } = await supabase.from('products').select('*').limit(2);
        finalRecs = fallbackData as Product[] || [];
      }

      setTimeout(() => {
        setRecommendations(finalRecs);
        setIsAnalyzing(false);
      }, 2500);
    } catch (err) {
      console.error("Quiz error", err);
      setError(true);
      setIsAnalyzing(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
    setIsAnalyzing(false);
    setError(false);
  };

  const addBothToBag = (e: React.MouseEvent) => {
    import("@/lib/animations").then(m => m.flyToCart(e, recommendations[0].image));
    recommendations.forEach(product => addToCart(product, 1));
    setTimeout(() => useStore.setState({ isCartOpen: true }), 800);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {!isAnalyzing && recommendations.length === 0 && (
          <>
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto bg-primary text-secondary rounded-full flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl mb-4 text-primary tracking-[0.1em]">Crystal Finder Quiz</h1>
              <p className="text-primary/70 text-sm md:text-base max-w-lg mx-auto">
                Let your intuition guide you. Answer 3 simple questions and we will reveal the crystals whose energy perfectly aligns with your current journey.
              </p>
            </div>

            <div className="bg-white border border-primary/10 p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8 text-xs tracking-widest text-primary/40 uppercase">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                {currentQuestion > 0 && (
                  <button onClick={() => setCurrentQuestion(currentQuestion - 1)} className="hover:text-primary flex items-center gap-1">
                    <ArrowLeft size={12} /> Back
                  </button>
                )}
              </div>
              
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl mb-8 text-center text-primary">
                {questions[currentQuestion].title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className="border border-primary/20 p-6 text-sm font-semibold tracking-wide hover:bg-secondary hover:border-primary transition-all duration-300 text-center"
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
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl text-primary mb-4 animate-pulse tracking-widest">Reading your energy...</h2>
            <p className="text-primary/60 font-light tracking-wide">Calculating your Aura profile and finding the perfect crystals.</p>
          </div>
        )}

        {recommendations.length > 0 && !isAnalyzing && (
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-4 font-bold">Your Aura Profile Match</h2>
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl md:text-5xl mb-12 text-primary tracking-wide">The Universe Chose These For You</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white border border-primary/10 shadow-lg group relative flex flex-col">
                  <Link href={`/product?id=${rec.id}`} className="block relative aspect-square bg-secondary overflow-hidden">
                    <Image 
                      src={rec.image || "https://images.unsplash.com/photo-1598046125712-4299b9eb2491"} 
                      alt={rec.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-[family-name:var(--font-cinzel)] font-bold text-xl mb-2 text-primary tracking-wide">{rec.name}</h3>
                    <p className="text-lg text-primary font-medium mb-4">₹{(rec.salePrice || rec.price).toLocaleString('en-IN')}</p>
                    <p className="text-xs font-light leading-relaxed text-primary/70 line-clamp-3 mb-6 flex-grow">
                      {rec.description}
                    </p>
                    <button 
                      onClick={(e) => {
                        import("@/lib/animations").then(m => m.flyToCart(e, rec.image));
                        addToCart(rec, 1);
                      }}
                      className="w-full border border-primary text-primary text-xs tracking-widest uppercase py-3 hover:bg-primary hover:text-secondary transition-colors"
                    >
                      Add To Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-xl mx-auto bg-secondary/30 p-8 border border-primary/10 mb-8">
              <h3 className="font-serif text-xl mb-2 text-primary">The Ultimate Healing Bundle</h3>
              <p className="text-sm text-primary/70 mb-6">These two crystals work perfectly in tandem to balance your energy.</p>
              <button 
                onClick={addBothToBag}
                className="w-full bg-primary text-secondary text-sm tracking-widest uppercase py-4 hover:bg-accent transition-colors shadow-lg"
              >
                Add Both To Bag
              </button>
            </div>

            <button 
              onClick={resetQuiz}
              className="text-xs tracking-widest uppercase text-primary/50 hover:text-primary transition-colors underline underline-offset-4"
            >
              Retake Quiz
            </button>
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
