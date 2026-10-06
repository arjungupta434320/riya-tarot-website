"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LogOut, Package, Clock, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews' | 'products'>('orders');
  const [loading, setLoading] = useState(true);
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Product Form State
  const [newProduct, setNewProduct] = useState({
    id: "", name: "", description: "", shortIntention: "", price: "", salePrice: "", category: "Bracelets", image: ""
  });
  const [productSuccess, setProductSuccess] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && session.user.email === "arjungupta434320@gmail.com") {
        fetchOrders();
        fetchReviews();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && session.user.email === "arjungupta434320@gmail.com") {
        fetchOrders();
        fetchReviews();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (data) setReviews(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
      
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  const approveReview = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", reviewId);
    if (!error) setReviews(reviews.map(r => r.id === reviewId ? { ...r, is_approved: true } : r));
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (!error) setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductSuccess("");
    const { error } = await supabase.from('products').insert({
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      shortIntention: newProduct.shortIntention,
      price: Number(newProduct.price),
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
      category: newProduct.category,
      image: newProduct.image
    });

    if (error) {
      alert("Error adding product: " + error.message);
    } else {
      setProductSuccess("Product added successfully!");
      setNewProduct({ id: "", name: "", description: "", shortIntention: "", price: "", salePrice: "", category: "Bracelets", image: "" });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background font-serif text-2xl">Loading...</div>;
  }

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-background">
        <div className="w-full max-w-md bg-secondary/30 p-8 rounded-sm">
          <h1 className="font-serif text-3xl mb-8 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary transition-colors"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full py-4 bg-primary text-secondary tracking-widest uppercase hover:bg-accent transition-colors">
              Enter Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (session.user.email !== "arjungupta434320@gmail.com") {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-3xl text-primary mb-4">Access Denied</h1>
        <p className="text-primary/70 mb-8">You do not have administrative privileges to view this page.</p>
        <button onClick={handleLogout} className="px-8 py-3 bg-primary text-secondary tracking-widest uppercase text-xs hover:bg-accent transition-colors">
          Sign Out
        </button>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl">Admin Vault</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-8 mb-12 border-b border-primary/10 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 whitespace-nowrap tracking-widest uppercase text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-primary/40 hover:text-primary'}`}
          >
            Orders ({orders.filter(o => ['paid', 'pending_cod'].includes(o.status)).length} Pending)
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 whitespace-nowrap tracking-widest uppercase text-sm font-semibold transition-colors ${activeTab === 'products' ? 'border-b-2 border-primary text-primary' : 'text-primary/40 hover:text-primary'}`}
          >
            Add Products
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 tracking-widest uppercase text-sm font-semibold transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'text-primary/40 hover:text-primary'}`}
          >
            Reviews ({reviews.filter(r => !r.is_approved).length} Pending)
          </button>
        </div>

        {activeTab === 'orders' && (
          orders.length === 0 ? (
            <div className="text-center py-24 bg-secondary/10 border border-primary/10">
              <Package size={48} className="mx-auto text-primary/30 mb-4" />
              <p className="text-primary/60 tracking-widest uppercase text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isPending = ['paid', 'pending_cod'].includes(order.status);
                return (
                <div key={order.id} className="bg-white border border-primary/10 p-6 flex flex-col md:flex-row gap-6 shadow-sm">
                  
                  {/* Customer Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="font-semibold text-lg">{order.customer_name}</h2>
                      <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-full flex items-center gap-1 ${
                        isPending ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isPending ? <Clock size={12}/> : <CheckCircle size={12}/>}
                        {order.status === 'pending_cod' ? 'COD - Pending' : order.status}
                      </span>
                    </div>
                    <p className="text-sm text-primary/70"><strong>Email:</strong> {order.customer_email}</p>
                    <p className="text-sm text-primary/70"><strong>Phone:</strong> {order.customer_phone}</p>
                    <p className="text-sm text-primary/70"><strong>Address:</strong> {order.shipping_address}</p>
                    <p className="text-xs text-primary/40 mt-4">Order ID: {order.id.split('-')[0]}</p>
                  </div>

                  {/* Order Items */}
                  <div className="flex-1 bg-secondary/20 p-4 rounded-sm">
                    <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-primary/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-primary/80">{item.quantity}x {item.name}</span>
                          <span>₹{((item.salePrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-primary/20 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-3 min-w-[140px]">
                    {isPending ? (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="py-3 bg-primary text-secondary text-xs uppercase tracking-widest hover:bg-accent transition-colors w-full"
                      >
                        Mark Shipped
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateOrderStatus(order.id, order.status === 'shipped' ? 'paid' : 'pending_cod')}
                        className="py-3 bg-transparent border border-primary/20 text-primary text-xs uppercase tracking-widest hover:bg-secondary transition-colors w-full"
                      >
                        Undo
                      </button>
                    )}
                  </div>

                </div>
              )})}
            </div>
          )
        )}

        {activeTab === 'products' && (
          <div className="bg-white border border-primary/10 p-8 shadow-sm max-w-3xl">
            <h2 className="font-serif text-2xl mb-6 text-primary">Add New Product</h2>
            {productSuccess && <p className="text-green-600 mb-6 bg-green-50 p-4 border border-green-200">{productSuccess}</p>}
            
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Product ID (Unique, e.g. amethyst-bracelet)</label>
                  <input required type="text" value={newProduct.id} onChange={e => setNewProduct({...newProduct, id: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Product Name</label>
                  <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Short Intention (e.g. "For peace and calm")</label>
                <input required type="text" value={newProduct.shortIntention} onChange={e => setNewProduct({...newProduct, shortIntention: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Full Description</label>
                <textarea required rows={4} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Price (₹)</label>
                  <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Sale Price (Optional, ₹)</label>
                  <input type="number" value={newProduct.salePrice} onChange={e => setNewProduct({...newProduct, salePrice: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary">
                    <option value="Bracelets">Bracelets</option>
                    <option value="Love">Love</option>
                    <option value="Abundance">Abundance</option>
                    <option value="Calm">Calm</option>
                    <option value="Protection">Protection</option>
                    <option value="Confidence">Confidence</option>
                    <option value="Focus">Focus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-primary/60 mb-2">Image URL (e.g. from Unsplash or Imgur)</label>
                <input required type="url" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." className="w-full bg-secondary/30 border border-primary/20 px-4 py-3 focus:outline-none focus:border-primary" />
                <p className="text-xs text-primary/40 mt-2">Note: To upload images, you can create a public "products" bucket in your Supabase dashboard, upload your image there, and paste the URL here.</p>
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-secondary tracking-widest uppercase hover:bg-accent transition-colors mt-4">
                Add Product to Store
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reviews' && (
          reviews.length === 0 ? (
            <div className="text-center py-24 bg-secondary/10 border border-primary/10">
              <p className="text-primary/60 tracking-widest uppercase text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-primary/10 p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{review.author_name}</h3>
                      <p className="text-xs text-primary/40 mb-1">{new Date(review.created_at).toLocaleDateString()}</p>
                      <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Product: {review.product_id}</p>
                    </div>
                    <div className="flex gap-1 text-accent">
                      {[1,2,3,4,5].map(i => (
                        <span key={i}>{i <= review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm font-light text-primary/80 mb-6 line-clamp-4">"{review.review_text}"</p>
                  
                  <div className="flex gap-3 mt-auto pt-4 border-t border-primary/10">
                    {!review.is_approved ? (
                      <button 
                        onClick={() => approveReview(review.id)}
                        className="flex-1 py-2 bg-green-600 text-white text-xs uppercase tracking-widest hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <div className="flex-1 py-2 bg-green-50 text-green-700 text-xs uppercase tracking-widest text-center border border-green-200">
                        Approved
                      </div>
                    )}
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 text-xs uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
}
