"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading || !user) {
    return <div className="min-h-screen pt-32 pb-24 bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-serif text-3xl md:text-4xl mb-12 text-primary">My Account</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 border-r border-primary/10 pr-8">
            <p className="text-sm tracking-widest uppercase text-primary/50 mb-2">Logged in as</p>
            <p className="font-medium text-primary mb-8 break-all">{user.email}</p>
            
            <button 
              onClick={handleLogout}
              className="text-sm tracking-widest uppercase border-b border-primary/30 pb-1 hover:border-primary transition-colors text-primary/70 hover:text-primary"
            >
              Sign Out
            </button>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <div className="bg-secondary/30 p-8 border border-primary/10">
              <h2 className="font-serif text-xl mb-2 text-primary">Your Rewards</h2>
              <p className="text-primary/70 text-sm mb-4 leading-relaxed">
                Thank you for being part of our community. Use the code below at checkout to receive 20% off your next ritual piece.
              </p>
              <div className="bg-background inline-block px-6 py-3 border border-primary/20">
                <span className="font-mono text-lg font-bold tracking-widest text-accent">WELCOME20</span>
              </div>
            </div>
            
            <div className="bg-secondary/10 p-8 border border-primary/10">
              <h2 className="font-serif text-xl mb-4 text-primary">Order History</h2>
              <p className="text-primary/50 text-sm italic">You haven't placed any orders yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
