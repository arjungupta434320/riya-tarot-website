"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Search, Clock, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";

export default function TrackOrderPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", email.trim().toLowerCase())
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      setSearched(true);
    } catch (err: any) {
      console.error(err);
      setError("Unable to find orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] pt-32 pb-24 bg-background flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-secondary text-primary rounded-full flex items-center justify-center mb-6 border border-primary/10">
            <Package size={24} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl mb-4 text-primary">Track Your Order</h1>
          <p className="text-primary/70 text-sm">Enter the email address used during checkout to view the status of your recent orders.</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 mb-12">
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            className="flex-grow bg-transparent border border-primary/20 px-4 py-4 focus:outline-none focus:border-primary transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 bg-primary text-secondary text-xs tracking-widest uppercase hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Searching..." : <><Search size={16} /> Track</>}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded text-sm mb-8 border border-red-100 text-center">
            {error}
          </div>
        )}

        {searched && orders.length === 0 && !loading && !error && (
          <div className="text-center py-12 bg-secondary/30 border border-primary/10">
            <p className="text-primary/60 mb-4">No orders found for this email address.</p>
            <Link href="/shop" className="text-xs uppercase tracking-widest text-primary border-b border-primary/30 hover:border-primary pb-1">
              Start Shopping
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              // Status formatting
              let statusLabel = order.status;
              let StatusIcon = Clock;
              let statusColor = "bg-orange-100 text-orange-700";
              
              if (order.status === 'paid' || order.status === 'pending_cod') {
                statusLabel = "Processing";
                StatusIcon = Clock;
                statusColor = "bg-orange-100 text-orange-700";
              } else if (order.status === 'shipped') {
                statusLabel = "Shipped";
                StatusIcon = Truck;
                statusColor = "bg-blue-100 text-blue-700";
              } else if (order.status === 'delivered') {
                statusLabel = "Delivered";
                StatusIcon = CheckCircle;
                statusColor = "bg-green-100 text-green-700";
              }

              return (
                <div key={order.id} className="bg-white border border-primary/10 p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-primary/5">
                    <div>
                      <p className="text-xs text-primary/40 uppercase tracking-widest mb-1">
                        Order #{order.id.split('-')[0]}
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold ${statusColor}`}>
                      <StatusIcon size={12} />
                      {statusLabel}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-primary/80 flex items-center gap-3">
                          <span className="w-6 h-6 bg-secondary flex items-center justify-center text-xs rounded-full">
                            {item.quantity}
                          </span>
                          {item.name}
                        </span>
                        <span>₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                    <span className="text-xs uppercase tracking-widest text-primary/60">Total</span>
                    <span className="font-semibold text-lg">₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  );
}
