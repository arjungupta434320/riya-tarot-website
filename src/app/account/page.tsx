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
