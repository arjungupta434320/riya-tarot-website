import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Privacy Policy</h1>
        
        <div className="prose prose-stone max-w-none text-primary/80">
          <p className="mb-4">Last updated: October 2026</p>
          
          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">1. Information We Collect</h2>
          <p className="mb-4">When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, phone number, and email address.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to fulfill your orders, communicate with you about your purchase, and securely process payments. We do not store your payment card details on our servers; they are securely processed by Razorpay.</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">3. Third-Party Services</h2>
          <p className="mb-4">In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us (e.g., payment gateways and shipping partners).</p>

          <h2 className="text-xl font-serif mt-8 mb-4 text-primary">4. Security</h2>
          <p className="mb-4">To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.</p>
        </div>
      </div>
    </div>
  );
}
