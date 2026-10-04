"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/account');
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl mb-4 text-primary">Log In</h1>
          <p className="text-primary/70 text-sm">Welcome back. Enter your details to access your account.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-primary/60">
          Don't have an account? <Link href="/auth/signup" className="text-primary border-b border-primary/30 hover:border-primary pb-0.5">Create one</Link>
        </p>
      </div>
    </div>
  );
}
