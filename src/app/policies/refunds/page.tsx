import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundsPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-stone max-w-none text-primary/80">
          <p className="mb-4">Last updated: October 2026</p>
          
          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">1. Cancellations</h2>
          <p className="mb-4">You may cancel your order within 24 hours of placing it, provided it has not already been dispatched. To cancel an order, please contact our support team immediately. Once an order has been shipped, it cannot be cancelled.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">2. Returns</h2>
          <p className="mb-4">Because our crystals are energetically cleansed and energized for you, we only accept returns if the product arrives damaged or defective. You must notify us within 48 hours of receiving a damaged item, along with photographic evidence.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">3. Refunds</h2>
          <p className="mb-4">Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed automatically to your original method of payment (via Razorpay) within 5-7 business days.</p>
        </div>
      </div>
    </div>
  );
}
