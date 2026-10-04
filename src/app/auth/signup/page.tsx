"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`
      }
    });

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes("user already registered")) {
        setError("An account with this email already exists. Please log in.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    // If Supabase has email confirmations turned on, data.user.identities will be empty if the email is taken
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setError("An account with this email already exists. Please log in.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <h1 className="font-serif text-3xl md:text-4xl mb-4 text-primary">Welcome to the Coven!</h1>
          <p className="text-primary/70 mb-8 leading-relaxed">
            Your account has been created successfully. As a thank you for joining, use code <strong className="text-primary font-bold">WELCOME20</strong> for 20% off your first order!
          </p>
          <button 
            onClick={() => router.push('/account')}
            className="w-full bg-primary text-secondary tracking-widest uppercase py-4 hover:bg-accent transition-colors"
          >
            Go To My Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl mb-4 text-primary">Join the Community</h1>
          <p className="text-primary/70 text-sm">Create an account today and instantly receive a 20% off discount code for your first ritual piece.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-primary/60 mb-2 block">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-primary/60 mb-2 block">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-primary/20 py-2 focus:outline-none focus:border-primary transition-colors" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-secondary text-sm tracking-widest uppercase py-4 hover:bg-accent transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-primary/60">
          Already have an account? <Link href="/auth/login" className="text-primary border-b border-primary/30 hover:border-primary pb-0.5">Log in</Link>
        </p>
      </div>
    </div>
  );
}
