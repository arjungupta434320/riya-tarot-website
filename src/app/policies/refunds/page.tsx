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
          <p className="mb-4">No cancellations are allowed once an order has been placed successfully. Please review your order carefully before completing the checkout process.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">2. Returns</h2>
          <p className="mb-4">We only accept returns if the product arrives damaged or defective. <strong>To be eligible for a return, you must record a clear, continuous unboxing video while opening the parcel for the first time.</strong> Without an unboxing video, no return or refund claims will be entertained. You must notify us within 48 hours of receiving the item.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">3. Refunds</h2>
          <p className="mb-4">Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed automatically to your original method of payment (via Razorpay) within 5-7 business days.</p>
        </div>
      </div>
    </div>
  );
}
