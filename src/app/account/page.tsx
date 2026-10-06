"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Package, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user]);

  const fetchOrders = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('customer_email', email)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setFetchingOrders(false);
    }
  };

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
            <div className="bg-gradient-to-br from-primary to-primary/90 text-secondary p-8 md:p-10 border border-primary/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14.5L6.5 12 12 6.5 17.5 12 12 16.5z"/></svg>
              </div>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl md:text-3xl mb-1 text-accent tracking-widest uppercase">The Crystal Club</h2>
              <p className="text-secondary/70 text-xs tracking-widest uppercase mb-8">Your VIP Dashboard</p>
              
              {fetchingOrders ? (
                <div className="animate-pulse h-16 bg-secondary/10 w-full mb-6"></div>
              ) : (
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-serif text-white">{Math.floor(orders.reduce((sum, o) => sum + Number(o.total_amount), 0) / 100)} <span className="text-sm tracking-widest uppercase text-secondary/60">Aura Points</span></span>
                    <span className="text-xs uppercase tracking-widest text-accent font-semibold">{orders.length > 3 ? 'Archangel Tier' : 'Seeker Tier'}</span>
                  </div>
                  <div className="w-full h-1 bg-secondary/20 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-accent transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (orders.reduce((sum, o) => sum + Number(o.total_amount), 0) / 100) / 10)}%` }}
                    />
                  </div>
                  <p className="text-xs text-secondary/60 font-light">Earn 1 Aura Point for every ₹100 spent. Unlock exclusive rituals at 1,000 points.</p>
                </div>
              )}
              
              <div className="bg-background/10 backdrop-blur-md p-6 border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-secondary font-medium mb-1">Your Active Reward</p>
                  <p className="text-xs text-secondary/70 font-light">20% off your next ritual piece.</p>
                </div>
                <div className="px-6 py-2 border border-accent/50 bg-accent/10">
                  <span className="font-mono text-sm font-bold tracking-widest text-accent">VIP20</span>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/10 p-8 border border-primary/10">
              <h2 className="font-serif text-xl mb-4 text-primary">Order History</h2>
              
              {fetchingOrders ? (
                <div className="flex items-center gap-2 text-primary/50 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-primary/50 border-t-transparent rounded-full"></div>
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <p className="text-primary/50 text-sm italic">You haven't placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 border border-primary/10 shadow-sm">
                      <div className="flex justify-between items-start border-b border-primary/10 pb-4 mb-4">
                        <div>
                          <p className="text-xs tracking-widest uppercase text-primary/50 mb-1">Order #{order.id.split('-')[0]}</p>
                          <p className="text-sm text-primary">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="font-medium text-primary mb-1">₹{order.total_amount.toLocaleString('en-IN')}</p>
                          
                          {/* Status Badge */}
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold
                            ${['paid', 'pending_cod'].includes(order.status) ? 'bg-amber-100 text-amber-800' : 
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'}`}
                          >
                            {['paid', 'pending_cod'].includes(order.status) && <Clock size={12} />}
                            {order.status === 'shipped' && <Package size={12} />}
                            {order.status === 'delivered' && <CheckCircle size={12} />}
                            {order.status === 'pending_cod' ? 'Processing (COD)' : order.status === 'paid' ? 'Processing' : order.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-primary/50 text-xs">{item.quantity}x</span>
                              <Link href={`/product?id=${item.id}`} className="hover:text-accent transition-colors">{item.name}</Link>
                            </div>
                            <span className="text-primary/70">₹{(item.salePrice || item.price).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
