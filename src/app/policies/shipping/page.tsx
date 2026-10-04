import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Shipping & Delivery Policy</h1>
        
        <div className="prose prose-stone max-w-none text-primary/80">
          <p className="mb-4">Last updated: October 2026</p>
          
          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">1. Processing Time</h2>
          <p className="mb-4">All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. Since our crystals undergo a specific cleansing and energizing ritual before dispatch, this processing time is necessary to ensure the highest energetic quality.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">2. Shipping Rates and Estimates</h2>
          <p className="mb-4">We currently offer <strong>Free Shipping on all orders across India</strong>. Standard delivery typically takes 4-7 business days depending on your location.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">3. Order Tracking</h2>
          <p className="mb-4">When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">4. International Shipping</h2>
          <p className="mb-4">At this time, we only ship within India. We do not offer international shipping.</p>
        </div>
      </div>
    </div>
  );
}
